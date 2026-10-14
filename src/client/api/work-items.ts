/**
 * PingCode 工作项（Work Items）相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { ListWorkItemsOptions, CreateWorkItemOptions, UpdateWorkItemOptions, PaginatedResponse } from '../types.js';

export class WorkItemsAPI {
  constructor(private client: PingCodeClient) {}

  async listWorkItems(options: ListWorkItemsOptions = {}): Promise<PaginatedResponse> {
    const params: Record<string, any> = {
      page_index: options.pageIndex ?? 0,
      page_size: Math.min(options.pageSize ?? 30, 100),
    };
    if (options.projectIds) params.project_ids = options.projectIds;
    if (options.identifier) params.identifier = options.identifier;
    if (options.assigneeIds) params.assignee_ids = options.assigneeIds;
    if (options.priorityIds) params.priority_ids = options.priorityIds;
    if (options.sprintIds) params.sprint_ids = options.sprintIds;
    if (options.participantId) params.participant_id = options.participantId;
    if (options.keywords) params.keywords = options.keywords;
    if (options.includePublicImageToken) params.include_public_image_token = options.includePublicImageToken;
    return this.client.get('/v1/project/work_items', params);
  }

  async getWorkItem(workItemId: string): Promise<any> {
    return this.client.get(`/v1/project/work_items/${workItemId}`);
  }

  async createWorkItem(options: CreateWorkItemOptions): Promise<any> {
    const data: Record<string, any> = {
      project_id: options.projectId,
      title: options.title,
      type_id: options.typeId,
    };
    if (options.description) data.description = options.description;
    if (options.assigneeId) data.assignee_id = options.assigneeId;
    if (options.stateId) data.state_id = options.stateId;
    if (options.priorityId) data.priority_id = options.priorityId;
    if (options.parentId) data.parent_id = options.parentId;
    if (options.sprintId) data.sprint_id = options.sprintId;
    if (options.startAt) data.start_at = options.startAt;
    if (options.endAt) data.end_at = options.endAt;
    if (options.properties) data.properties = options.properties;
    return this.client.post('/v1/project/work_items', data);
  }

  async updateWorkItem(workItemId: string, options: UpdateWorkItemOptions): Promise<any> {
    const data: Record<string, any> = {};
    if (options.title) data.title = options.title;
    if (options.description) data.description = options.description;
    if (options.assigneeId) data.assignee_id = options.assigneeId;
    if (options.stateId) data.state_id = options.stateId;
    if (options.priorityId) data.priority_id = options.priorityId;
    if (options.parentId) data.parent_id = options.parentId;
    if (options.startAt) data.start_at = options.startAt;
    if (options.endAt) data.end_at = options.endAt;
    if (options.properties) data.properties = options.properties;
    if (options.phaseId) data.phase_id = options.phaseId;
    if (options.storyPoints !== undefined) data.story_points = options.storyPoints;
    if (options.estimatedWorkload !== undefined) data.estimated_workload = options.estimatedWorkload;
    if (options.remainingWorkload !== undefined) data.remaining_workload = options.remainingWorkload;
    return this.client.patch(`/v1/project/work_items/${workItemId}`, data);
  }

  async deleteWorkItem(workItemId: string): Promise<any> {
    return this.client.delete(`/v1/project/work_items/${workItemId}`);
  }

  async searchWorkItems(keywords: string, projectIds?: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.listWorkItems({ projectIds, keywords, pageIndex, pageSize });
  }

  async getWorkItemTypes(projectId: string): Promise<any[]> {
    const result = await this.client.get('/v1/project/work_item/types', { project_id: projectId });
    return result.values ?? [];
  }

  async getWorkItemPriorities(projectId: string): Promise<any[]> {
    const result = await this.client.get('/v1/project/work_item/priorities', { project_id: projectId });
    return result.values ?? [];
  }

  async getWorkItemStatuses(projectId: string): Promise<any[]> {
    const result = await this.client.get('/v1/project/work_item_statuses', { project_id: projectId });
    return result.values ?? [];
  }

  async listWorkItemTags(workItemId: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.client.get(`/v1/project/work_items/${workItemId}/tags`, {
      page_index: pageIndex, page_size: Math.min(pageSize, 100),
    });
  }

  async addWorkItemTag(workItemId: string, tagId: string): Promise<any> {
    return this.client.post(`/v1/project/work_items/${workItemId}/tags`, { tag_id: tagId });
  }

  async removeWorkItemTag(workItemId: string, tagId: string): Promise<any> {
    return this.client.delete(`/v1/project/work_items/${workItemId}/tags/${tagId}`);
  }

  async getWorkItemRelationTypes(): Promise<any[]> {
    const result = await this.client.get('/v1/project/work_item/relation_types');
    return result.values ?? [];
  }

  /** 获取工作项附件列表（含图片附件，图片附件带 download_url） */
  async listWorkItemAttachments(workItemId: string, commentId?: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    const params: Record<string, any> = {
      principal_type: 'work_item',
      principal_id: workItemId,
      page_index: pageIndex,
      page_size: Math.min(pageSize, 100),
    };
    if (commentId) params.comment_id = commentId;
    return this.client.get('/v1/attachments', params);
  }

  // ============== 评论子 API ==============

  async listWorkItemComments(workItemId: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.client.get(`/v1/project/work_items/${workItemId}/comments`, {
      page_index: pageIndex, page_size: Math.min(pageSize, 100),
    });
  }

  async addWorkItemComment(workItemId: string, content: string, parentId?: string): Promise<any> {
    const data: Record<string, any> = { content };
    if (parentId) data.parent_id = parentId;
    return this.client.post(`/v1/project/work_items/${workItemId}/comments`, data);
  }

  async updateWorkItemComment(workItemId: string, commentId: string, content: string): Promise<any> {
    return this.client.patch(`/v1/project/work_items/${workItemId}/comments/${commentId}`, { content });
  }

  async deleteWorkItemComment(workItemId: string, commentId: string): Promise<any> {
    return this.client.delete(`/v1/project/work_items/${workItemId}/comments/${commentId}`);
  }
}
