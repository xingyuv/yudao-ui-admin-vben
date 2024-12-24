import type { AuthPermissionInfo, Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import {
  resetAllStores,
  useAccessStore,
  useDictStore,
  useUserStore,
} from '@vben/stores';

import { defineStore } from 'pinia';

import { notification } from '#/adapter/naive';
import { getAuthPermissionInfoApi, loginApi, logoutApi } from '#/api';
import { getSimpleDictDataList } from '#/api/system/dict-data';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const dictStore = useDictStore();
  const router = useRouter();
  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let authPermissionInfo: AuthPermissionInfo | null = null;
    try {
      loginLoading.value = true;
      const { accessToken, refreshToken } = await loginApi(params);

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        authPermissionInfo = await getAuthPermissionInfo();

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          // 执行成功回调
          await onSuccess?.();
          // 跳转首页
          // const router = useRouter();
          await router.push(authPermissionInfo.homePath || DEFAULT_HOME_PATH);
        }

        // 设置字典数据
        dictStore.setDictCacheByApi(
          getSimpleDictDataList,
          {},
          'label',
          'value',
        );

        if (
          authPermissionInfo?.user.realName ||
          authPermissionInfo.user.nickname
        ) {
          notification.success({
            content: $t('authentication.loginSuccess'),
            description: `${$t('authentication.loginSuccessDesc')}:${authPermissionInfo?.user.realName ?? authPermissionInfo?.user.nickname}`,
            duration: 3000,
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      authPermissionInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);
    // const router = useRouter();
    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function getAuthPermissionInfo() {
    let authPermissionInfo: AuthPermissionInfo | null = null;
    authPermissionInfo = await getAuthPermissionInfoApi();
    userStore.setUserInfo(authPermissionInfo.user);
    userStore.setUserRoles(authPermissionInfo.roles);
    userStore.setAccessMenus(authPermissionInfo.menus as []);
    accessStore.setAccessCodes(authPermissionInfo.permissions);
    return authPermissionInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    getAuthPermissionInfo,
    loginLoading,
    logout,
  };
});
