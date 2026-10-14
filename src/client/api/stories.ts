/**
 * PingCode 需求（Ship Ideas）相关 API
 *
 * 端点依据 pingcodeDocs/产品管理/需求：/v1/ship/ideas
 */

import type { PingCodeClient } from '../client.js';
import type { ListStoriesOptions, PaginatedResponse } from '../types.js';

export class StoriesAPI {
  constructor(private client: PingCodeClient) {}

  async listStories(options: ListStoriesOptions = {}): Promise<PaginatedResponse> {
    const params: Record<string, any> = {
      page_index: options.pageIndex ?? 0,
      page_size: Math.min(options.pageSize ?? 30, 100),
    };
    if (options.productId) params.product_id = options.productId;
    if (options.stateId) params.state_id = options.stateId;
    if (options.priorityId) params.priority_id = options.priorityId;
    if (options.keywords) params.keywords = options.keywords;
    if (options.createdBetween) params.created_between = options.createdBetween;
    if (options.updatedBetween) params.updated_between = options.updatedBetween;
    if (options.includePublicImageToken) params.include_public_image_token = options.includePublicImageToken;
    return this.client.get('/v1/ship/ideas', params);
  }

  async searchStories(keywords: string, productId?: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.listStories({ productId, keywords, pageIndex, pageSize });
  }

  async getStoryStatuses(productId?: string): Promise<any[]> {
    const params: Record<string, any> = {};
    if (productId) params.product_id = productId;
    const result = await this.client.get('/v1/ship/idea/states', params);
    return result.values ?? [];
  }

  async getStoryPriorities(productId?: string): Promise<any[]> {
    const params: Record<string, any> = {};
    if (productId) params.product_id = productId;
    const result = await this.client.get('/v1/ship/idea/priorities', params);
    return result.values ?? [];
  }
}
