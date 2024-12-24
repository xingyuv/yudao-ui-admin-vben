import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from '#/adapter/naive';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

import { buildMenus } from './helper';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const authStore = useAuthStore();
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading(`${$t('common.loadingMenu')}...`, {
        duration: 1500,
      });
      const authPermissionInfo = await authStore.getAuthPermissionInfo();
      const menus = authPermissionInfo.menus;
      const routes = buildMenus(menus);
      const menuList = [...routes];
      return menuList;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
