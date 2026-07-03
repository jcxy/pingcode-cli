/**
 * PingCode OAuth 认证管理器
 *
 * 支持两种认证模式：
 * - client: 客户端凭证模式（应用级别）
 * - user: 授权码模式（用户级别）
 */

import 'dotenv/config';
import { TokenStore } from './token-store.js';
import type { PingCodeAuthOptions, TokenData, TokenResponse } from './types.js';

export class PingCodeAuth {
  readonly apiRoot: string;
  private oauth2Root: string; // OAuth2 授权端点根路径
  readonly authMode: 'client' | 'user';
  private clientId?: string;
  private clientSecret?: string;
  private tokenStore: TokenStore;

  private accessToken?: string;
  private refreshTokenValue?: string;
  private expiresAt?: number;

  constructor(options: PingCodeAuthOptions = {}) {
    this.apiRoot = (options.apiRoot || process.env.PINGCODE_API_ROOT || 'https://open.pingcode.com').replace(/\/+$/, '');
    
    // 根据 API 地址推导 OAuth2 根路径
    // 公有云：apiRoot=https://open.pingcode.com → oauth2Root=https://open.pingcode.com/oauth2
    // 私有部署：apiRoot=https://pm.example.com/open → oauth2Root=https://pm.example.com/oauth2
    if (this.apiRoot.endsWith('/open')) {
      this.oauth2Root = this.apiRoot.replace(/\/open$/, '') + '/oauth2';
    } else {
      this.oauth2Root = `${this.apiRoot}/oauth2`;
    }
    
    this.authMode = options.authMode || (process.env.PINGCODE_AUTH_MODE as 'client' | 'user') || 'client';
    this.tokenStore = new TokenStore(options.tokenFile || process.env.PINGCODE_TOKEN_FILE || '.pingcode_token.json');

    if (this.authMode === 'user') {
      this.clientId = options.clientId || process.env.PINGCODE_USER_CLIENT_ID;
      this.clientSecret = options.clientSecret || process.env.PINGCODE_USER_CLIENT_SECRET;
    } else {
      this.clientId = options.clientId || process.env.PINGCODE_CLIENT_ID;
      this.clientSecret = options.clientSecret || process.env.PINGCODE_CLIENT_SECRET;
    }

    this.refreshTokenValue = options.refreshToken;
    this._loadTokens();

    if (this.accessToken && this.isTokenValid) return;

    if (options.code) {
      // 不在构造函数中 await，延迟到 getToken
    }
  }

  get isTokenValid(): boolean {
    if (!this.accessToken || !this.expiresAt) return false;
    return Date.now() / 1000 < this.expiresAt - 86400;
  }

  getAuthorizeUrl(redirectUri?: string): string {
    if (!this.clientId) {
      throw new Error('缺少 client_id，请检查 PINGCODE_USER_CLIENT_ID 配置');
    }
    let url = `${this.oauth2Root}/authorize?response_type=code&client_id=${this.clientId}`;
    if (redirectUri) {
      url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }
    return url;
  }

  private _loadTokens(): void {
    const data = this.tokenStore.load();
    if (!data) return;
    if (data.auth_mode && data.auth_mode !== this.authMode) return;
    this.accessToken = data.access_token;
    this.refreshTokenValue = data.refresh_token ?? this.refreshTokenValue;
    this.expiresAt = data.expires_at;
  }

  private _saveTokens(): void {
    if (!this.accessToken) return;
    this.tokenStore.save({
      access_token: this.accessToken,
      refresh_token: this.refreshTokenValue,
      expires_at: this.expiresAt,
      auth_mode: this.authMode,
      updated_at: Date.now() / 1000,
    });
  }

  async getUserToken(code: string): Promise<TokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        '缺少授权码模式的凭据，请在 .env 中配置：\n  PINGCODE_USER_CLIENT_ID=xxx\n  PINGCODE_USER_CLIENT_SECRET=xxx'
      );
    }
    const url = `${this.apiRoot}/v1/auth/token?grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${code}`;
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`获取用户令牌失败: HTTP ${res.status} - ${await res.text()}`);
    const result: TokenResponse = await res.json() as TokenResponse;
    if (!result.access_token) throw new Error('API 返回的响应中缺少 access_token');
    this.accessToken = result.access_token;
    this.refreshTokenValue = result.refresh_token;
    if (result.expires_in) this.expiresAt = result.expires_in;
    this._saveTokens();
    return result;
  }

  async getClientToken(): Promise<TokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        '缺少客户端凭证，请在 .env 中配置：\n  PINGCODE_CLIENT_ID=xxx\n  PINGCODE_CLIENT_SECRET=xxx'
      );
    }
    const url = `${this.apiRoot}/v1/auth/token?grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`获取客户端令牌失败: HTTP ${res.status} - ${await res.text()}`);
    const result: TokenResponse = await res.json() as TokenResponse;
    if (!result.access_token) throw new Error('API 返回的响应中缺少 access_token');
    this.accessToken = result.access_token;
    if (result.expires_in) this.expiresAt = result.expires_in;
    this._saveTokens();
    return result;
  }

  async refreshUserToken(): Promise<TokenResponse> {
    if (!this.refreshTokenValue) {
      throw new Error('没有 refresh_token，无法刷新。请重新获取授权码');
    }
    const url = `${this.apiRoot}/v1/auth/token?grant_type=refresh_token&refresh_token=${this.refreshTokenValue}`;
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`刷新用户令牌失败: HTTP ${res.status} - ${await res.text()}`);
    const result: TokenResponse = await res.json() as TokenResponse;
    if (!result.access_token) throw new Error('API 返回的响应中缺少 access_token');
    this.accessToken = result.access_token;
    if (result.expires_in) this.expiresAt = result.expires_in;
    this._saveTokens();
    return result;
  }

  async getToken(): Promise<string> {
    if (!this.accessToken) {
      if (this.authMode === 'user') {
        throw new Error(
          `当前为授权码模式，但未找到有效令牌。\n\n请运行 pingcode-cli auth login 重新登录`
        );
      } else {
        if (this.clientId && this.clientSecret) {
          await this.getClientToken();
        } else {
          throw new Error('未配置认证信息。请运行 pingcode-cli auth login 进行配置');
        }
      }
    }

    // 检查是否需要刷新（提前 1 天刷新）
    if (this.expiresAt && Date.now() / 1000 >= this.expiresAt - 86400) {
      if (this.refreshTokenValue) {
        await this.refreshUserToken();
      } else if (this.authMode === 'client') {
        await this.getClientToken();
      } else {
        throw new Error(
          `用户令牌已过期且无 refresh_token。\n请运行 pingcode-cli auth login 重新登录`
        );
      }
    }

    return this.accessToken!;
  }

  async getHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
}
