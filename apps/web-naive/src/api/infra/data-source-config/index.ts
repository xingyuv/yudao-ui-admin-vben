import { requestClient } from '#/api/request';

export namespace DataSourceConfigApi {
  export interface DataSourceConfigRespVO {
    id: number;
    name: string;
    url: string;
    username: string;
    createTime?: Date;
  }

  export interface DataSourceConfigSaveReqVO {
    id?: number;
    name: string;
    url: string;
    username: string;
    password: string;
  }
}
// 新增数据源配置
export function createDataSourceConfig(
  data: DataSourceConfigApi.DataSourceConfigSaveReqVO,
) {
  return requestClient.post('/infra/data-source-config/create', data);
}

// 修改数据源配置
export function updateDataSourceConfig(
  data: DataSourceConfigApi.DataSourceConfigSaveReqVO,
) {
  return requestClient.put('/infra/data-source-config/update', data);
}

// 删除数据源配置
export function deleteDataSourceConfig(id: number) {
  return requestClient.delete(`/infra/data-source-config/delete?id=${id}`);
}

// 查询数据源配置详情
export function getDataSourceConfig(id: number) {
  return requestClient.get<DataSourceConfigApi.DataSourceConfigRespVO>(
    `/infra/data-source-config/get?id=${id}`,
  );
}

// 查询数据源配置列表
export function getDataSourceConfigList() {
  return requestClient.get<DataSourceConfigApi.DataSourceConfigRespVO[]>(
    '/infra/data-source-config/list',
  );
}
