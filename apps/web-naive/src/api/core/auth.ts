import type { AuthPermissionInfo } from '@vben/types';

import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    captchaVerification?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    userId: number;
    expiresTime: number;
  }

  export interface TenantSimple {
    id: number;
    name: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/system/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: string) {
  return requestClient.post<AuthApi.LoginResult>(
    `/system/auth/refresh-token?refreshToken=${refreshToken}`,
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/system/auth/logout');
}

/**
 * 获取用户权限信息
 */
export function getAuthPermissionInfoApi() {
  return requestClient.get<AuthPermissionInfo>(
    '/system/auth/get-permission-info',
  );
}

/**
 * 使用租户名，获得租户编号
 * @param name 租户名
 * @returns 租户编号
 */
export async function getTenantIdByName(name: string) {
  return requestClient.get<number>(
    `/system/tenant/get-id-by-name?name=${name}`,
  );
}

/**
 * 使用租户域名，获得租户信息
 * @param website 域名
 * @returns 租户信息
 */
export async function getTenantByWebsite(website: string) {
  return requestClient.get<AuthApi.TenantSimple>(
    `/system/tenant/get-by-website?website=${website}`,
  );
}

// 获取验证图片 以及token
export async function getCaptcha(data: any) {
  return baseRequestClient.post('/system/captcha/get', data);
}

// 滑动或者点选验证
export async function checkCaptcha(data: any) {
  return baseRequestClient.post('/system/captcha/check', data);
}
