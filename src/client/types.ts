/**
 * PingCode 公共类型定义
 */

/** 分页响应 */
export interface PaginatedResponse<T = any> {
  page_size: number;
  page_index: number;
  total: number;
  values: T[];
}

/** 分页参数 */
export interface PaginationParams {
  pageIndex?: number;
  pageSize?: number;
}

/** 响应格式 */
export type ResponseFormat = 'json' | 'markdown';

/** 令牌数据（持久化） */
export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  auth_mode: string;
  updated_at: number;
}

/** 令牌响应（API 返回） */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

// ============== 子 API 参数类型 ==============

/** 需求列表查询参数（对应 GET /v1/ship/ideas） */
export interface ListStoriesOptions extends PaginationParams {
  productId?: string;
  stateId?: string;
  priorityId?: string;
  keywords?: string;
  createdBetween?: string;
  updatedBetween?: string;
  /** 包含图片资源 token 的属性，支持 description 和多行文本类型属性 */
  includePublicImageToken?: string;
}

/** 工作项列表查询参数 */
export interface ListWorkItemsOptions extends PaginationParams {
  projectIds?: string;
  identifier?: string;
  assigneeIds?: string;
  priorityIds?: string;
  sprintIds?: string;
  participantId?: string;
  keywords?: string;
  /** 包含图片资源 token 的属性，使用','分割，最多 20 个，支持 description 和多行文本类型属性 */
  includePublicImageToken?: string;
}

/** 创建工作项参数 */
export interface CreateWorkItemOptions {
  projectId: string;
  title: string;
  typeId: string;
  description?: string;
  assigneeId?: string;
  stateId?: string;
  priorityId?: string;
  parentId?: string;
  sprintId?: string;
  startAt?: number;
  endAt?: number;
  properties?: Record<string, any>;
}

/** 更新工作项参数 */
export interface UpdateWorkItemOptions {
  title?: string;
  description?: string;
  assigneeId?: string;
  stateId?: string;
  priorityId?: string;
  parentId?: string;
  startAt?: number;
  endAt?: number;
  properties?: Record<string, any>;
  phaseId?: string;
  storyPoints?: number;
  estimatedWorkload?: number;
  remainingWorkload?: number;
}

/** 迭代列表查询参数 */
export interface ListSprintsOptions extends PaginationParams {
  projectId: string;
  name?: string;
  status?: string;
  createdBetween?: string;
  updatedBetween?: string;
}

/** 创建迭代参数 */
export interface CreateSprintOptions {
  projectId: string;
  name: string;
  startAt: number;
  endAt: number;
  assigneeId: string;
  description?: string;
  status?: string;
  categoryIds?: string[];
}

/** 更新迭代参数 */
export interface UpdateSprintOptions {
  name?: string;
  startAt?: number;
  endAt?: number;
  assigneeId?: string;
  description?: string;
  status?: string;
  categoryIds?: string[];
}

/** 创建交付目标参数 */
export interface CreateDeliverableOptions {
  workItemId: string;
  name: string;
  contentType: string;
  content: Record<string, any>;
}

/** 更新交付目标参数 */
export interface UpdateDeliverableOptions {
  workItemId?: string;
  name?: string;
  contentType?: string;
  content?: Record<string, any>;
}

/** 创建 Wiki 空间参数 */
export interface CreateSpaceOptions {
  name: string;
  identifier: string;
  scopeType?: string;
  description?: string;
  visibility?: string;
}

/** 更新 Wiki 空间参数 */
export interface UpdateSpaceOptions {
  name?: string;
  description?: string;
  visibility?: string;
}

/** 创建 Wiki 页面参数 */
export interface CreatePageOptions {
  spaceId: string;
  name: string;
  content: string;
  formatType?: string;
  parentId?: string;
}

/** 创建评论参数 */
export interface CreateCommentOptions {
  principalType: string;
  content: string;
  principalId?: string;
  reviewId?: string;
  createdAt?: number;
  createdBy?: string;
}

/** PingCodeClient 构造参数 */
export interface PingCodeClientOptions {
  apiRoot?: string;
  clientId?: string;
  clientSecret?: string;
  orgId?: string;
  productId?: string;
  code?: string;
  refreshToken?: string;
  authMode?: 'client' | 'user';
}

/** PingCodeAuth 构造参数 */
export interface PingCodeAuthOptions {
  clientId?: string;
  clientSecret?: string;
  apiRoot?: string;
  code?: string;
  refreshToken?: string;
  tokenFile?: string;
  authMode?: 'client' | 'user';
}
