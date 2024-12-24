import { requestClient } from '#/api/request';

export interface PostVO {
  id?: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  remark: string;
  createTime?: Date;
}

// 查询岗位列表
export function getPostPage(params: any) {
  return requestClient.get('/system/post/page', { params });
}

// 获取岗位精简信息列表
export function getSimplePostList() {
  return requestClient.get('/system/post/simple-list');
}

// 查询岗位详情
export function getPost(id: number) {
  return requestClient.get(`/system/post/get?id=${id}`);
}

// 新增岗位
export function createPost(data: PostVO) {
  return requestClient.post('/system/post/create', data);
}

// 修改岗位
export function updatePost(data: PostVO) {
  return requestClient.put('/system/post/update', data);
}

// 删除岗位
export function deletePost(id: number) {
  return requestClient.delete(`/system/post/delete?id=${id}`);
}

// 导出岗位
export function exportPost(params: any) {
  return requestClient.download('/system/post/export', params);
}
