/**
 * PingCode 知识管理（Wiki）相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { CreateSpaceOptions, UpdateSpaceOptions, CreatePageOptions, PaginatedResponse } from '../types.js';

export class WikiAPI {
  constructor(private client: PingCodeClient) {}

  // ============== 空间管理 ==============

  async listSpaces(keywords?: string, pageIndex = 0, pageSize = 30): Promise<any> {
    const params: Record<string, any> = {
      page_index: pageIndex,
      page_size: Math.min(pageSize, 100),
    };
    if (keywords) params.keywords = keywords;
    return this.client.get('/v1/wiki/spaces', params);
  }

  async getSpace(spaceId: string): Promise<any> {
    return this.client.get(`/v1/wiki/spaces/${spaceId}`);
  }

  async createSpace(options: CreateSpaceOptions): Promise<any> {
    const data: Record<string, any> = {
      name: options.name,
      identifier: options.identifier,
      scope_type: options.scopeType ?? 'organization',
      visibility: options.visibility ?? 'private',
    };
    if (options.description) data.description = options.description;
    return this.client.post('/v1/wiki/spaces', data);
  }

  async updateSpace(spaceId: string, options: UpdateSpaceOptions): Promise<any> {
    const data: Record<string, any> = {};
    if (options.name) data.name = options.name;
    if (options.description !== undefined) data.description = options.description;
    if (options.visibility) data.visibility = options.visibility;
    return this.client.patch(`/v1/wiki/spaces/${spaceId}`, data);
  }

  async deleteSpace(spaceId: string): Promise<any> {
    return this.client.delete(`/v1/wiki/spaces/${spaceId}`);
  }

  // ============== 页面管理 ==============

  async createPage(options: CreatePageOptions): Promise<any> {
    const data: Record<string, any> = {
      space_id: options.spaceId,
      name: options.name,
      content: options.content,
      format_type: options.formatType ?? 'text',
    };
    if (options.parentId) data.parent_id = options.parentId;
    return this.client.post('/v1/wiki/pages', data);
  }

  async getPage(pageId: string): Promise<any> {
    return this.client.get(`/v1/wiki/pages/${pageId}`);
  }

  async getPageContent(pageId: string): Promise<any> {
    return this.client.get(`/v1/wiki/pages/${pageId}/content`);
  }

  async updatePageContent(pageId: string, content: string, formatType = 'text'): Promise<any> {
    return this.client.put(`/v1/wiki/pages/${pageId}/content`, { content, format_type: formatType });
  }

  async getPageVersions(pageId: string): Promise<any[]> {
    const result = await this.client.get(`/v1/wiki/pages/${pageId}/versions`);
    return result.values ?? [];
  }

  async getSpacePages(spaceId: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.client.get('/v1/wiki/pages', {
      space_id: spaceId, page_index: pageIndex, page_size: Math.min(pageSize, 100),
    });
  }

  // ============== 空间成员管理 ==============

  async addSpaceMember(spaceId: string, userId: string, role = 'member'): Promise<any> {
    return this.client.post(`/v1/wiki/spaces/${spaceId}/members`, {
      member: { id: userId, type: 'user' }, role,
    });
  }

  async updateSpaceMember(spaceId: string, memberId: string, role: string): Promise<any> {
    return this.client.patch(`/v1/wiki/spaces/${spaceId}/members/${memberId}`, { role });
  }

  async removeSpaceMember(spaceId: string, memberId: string): Promise<any> {
    return this.client.delete(`/v1/wiki/spaces/${spaceId}/members/${memberId}`);
  }

  async getSpaceMembers(spaceId: string): Promise<any[]> {
    const result = await this.client.get(`/v1/wiki/spaces/${spaceId}/members`);
    return result.values ?? [];
  }
}
