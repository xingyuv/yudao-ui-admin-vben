import type {
  AppRouteRecordRaw,
  RouteRecordStringComponent,
} from '@vben/types';

import { isHttpUrl } from '@vben/utils';

function buildMenus(
  menuList: AppRouteRecordRaw[],
  parent = '',
): RouteRecordStringComponent[] {
  const menus: RouteRecordStringComponent[] = [];
  menuList.forEach((menu) => {
    // 处理顶级链接菜单
    if (isHttpUrl(menu.path) && menu.parentId === 0) {
      const urlMenu: RouteRecordStringComponent = {
        component: 'IFrameView',
        meta: {
          hideInMenu: !menu.visible,
          icon: menu.icon,
          link: menu.path,
          orderNo: menu.sort,
          title: menu.name,
        },
        name: menu.name,
        path: `/${menu.path}/index`,
      };
      menus.push(urlMenu);
      return;
    } else if (menu.children && menu.parentId === 0) {
      menu.component = 'BasicLayout';
    } else if (!menu.children) {
      menu.component = menu.component as string;
    }
    if (menu.component === 'Layout') {
      menu.component = 'BasicLayout';
    }

    if (menu.children && menu.parentId !== 0) {
      menu.component = '';
    }

    // path
    if (parent) {
      menu.path = `${parent}/${menu.path}`;
    }

    if (!menu.path.startsWith('/')) {
      menu.path = `/${menu.path}`;
    }

    const buildMenu: RouteRecordStringComponent = {
      component: menu.component,
      meta: {
        hideInMenu: !menu.visible,
        icon: menu.icon,
        keepAlive: menu.keepAlive,
        orderNo: menu.sort,
        title: menu.name,
      },
      name: menu.name,
      path: menu.path,
    };

    if (menu.children && menu.children.length > 0) {
      buildMenu.children = buildMenus(menu.children, menu.path);
    }

    menus.push(buildMenu);
  });
  return menus;
}

export { buildMenus };
