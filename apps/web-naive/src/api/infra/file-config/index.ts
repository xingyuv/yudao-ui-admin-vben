import { type PageParam, requestClient } from '#/api/request';

export namespace FileConfigApi {
  export interface FileClientConfig {
    basePath: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    mode?: string;
    endpoint?: string;
    bucket?: string;
    accessKey?: string;
    accessSecret?: string;
    domain: string;
  }

  export interface FileConfigVO {
    id: number;
    name: string;
    storage?: number;
    master: boolean;
    visible: boolean;
    config: FileClientConfig;
    remark: string;
    createTime: Date;
  }
}

// 查询文件配置列表
export function getFileConfigPage(params: PageParam) {
  return requestClient.get('/infra/file-config/page', { params });
}

// 查询文件配置详情
export function getFileConfig(id: number) {
  return requestClient.get(`/infra/file-config/get?id=${id}`);
}

// 更新文件配置为主配置
export function updateFileConfigMaster(id: number) {
  return requestClient.put(`/infra/file-config/update-master?id=${id}`);
}

// 新增文件配置
export function createFileConfig(data: FileConfigApi.FileConfigVO) {
  return requestClient.post('/infra/file-config/create', data);
}

// 修改文件配置
export function updateFileConfig(data: FileConfigApi.FileConfigVO) {
  return requestClient.put('/infra/file-config/update', data);
}

// 删除文件配置
export function deleteFileConfig(id: number) {
  return requestClient.delete(`/infra/file-config/delete?id=${id}`);
}

// 测试文件配置
export function testFileConfig(id: number) {
  return requestClient.get(`/infra/file-config/test?id=${id}`);
}
