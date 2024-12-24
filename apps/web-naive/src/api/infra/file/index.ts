import { type PageParam, requestClient } from '#/api/request';

export namespace FileApi {
  export interface FilePageReqVO extends PageParam {
    path?: string;
    type?: string;
    createTime?: Date[];
  }

  // 文件预签名地址 Response VO
  export interface FilePresignedUrlRespVO {
    // 文件配置编号
    configId: number;
    // 文件上传 URL
    uploadUrl: string;
    // 文件 URL
    url: string;
  }
}

// 查询文件列表
export function getFilePage(params: FileApi.FilePageReqVO) {
  return requestClient.get('/infra/file/page', { params });
}

// 删除文件
export function deleteFile(id: number) {
  return requestClient.delete(`/infra/file/delete?id=${id}`);
}

// 获取文件预签名地址
export function getFilePresignedUrl(path: string) {
  return requestClient.get<FileApi.FilePresignedUrlRespVO>(
    '/infra/file/presigned-url',
    { params: { path } },
  );
}

export function createFile(data: any) {
  return requestClient.post('/infra/file/create', data);
}

// 上传文件
export function uploadFile(data: any) {
  return requestClient.upload('/infra/file/upload', data);
}
