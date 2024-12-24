import { requestClient } from '#/api/request';

export interface MenuVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  sort: number;
  parentId: number;
  path: string;
  icon: string;
  component: string;
  componentName?: string;
  status: number;
  visible: boolean;
  keepAlive: boolean;
  alwaysShow?: boolean;
  createTime: Date;
}

// 查询菜单（精简）列表
export function getSimpleMenusList() {
  return requestClient.get('/system/menu/simple-list');
}

// 查询菜单列表
export function getMenuList(params: any) {
  return requestClient.get('/system/menu/list', params);
}

// 获取菜单详情
export function getMenu(id: number) {
  return requestClient.get(`/system/menu/get?id=${id}`);
}

// 新增菜单
export function createMenu(data: MenuVO) {
  return requestClient.post('/system/menu/create', data);
}

// 修改菜单
export function updateMenu(data: MenuVO) {
  return requestClient.put('/system/menu/update', data);
}

// 删除菜单
export function deleteMenu(id: number) {
  return requestClient.delete(`/system/menu/delete?id=${id}`);
}
