<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, watchEffect } from 'vue';

import { AuthenticationLogin, Verification, z } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useTenantStore } from '@vben/stores';

import {
  checkCaptcha,
  getCaptcha,
  getTenantByWebsite,
  getTenantIdByName,
} from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const { tenantEnable, captchaEnable } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

const authStore = useAuthStore();
const tenantStore = useTenantStore();

const captchaType = 'blockPuzzle';
const loginData = ref<Recordable<any>>({});

const verifyRef = ref();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.tenantName'),
      },
      fieldName: 'tenantName',
      label: $t('authentication.tenantName'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.tenantNameTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_TENANT_NAME),
      dependencies: {
        triggerFields: ['tenantName'],
        if: tenantEnable && !tenantStore.tenantId,
        trigger: (values) => {
          tenantStore.setTenantName(values.tenantName);
        },
      },
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.usernameTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_USERNAME),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.passwordTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_PASSWORD),
    },
  ];
});

/**
 * 处理登录
 */
const handleLogin = async (values: any) => {
  // 是否开启租户
  if (tenantEnable && !tenantStore.tenantId) {
    const tenantId = await getTenantIdByName(values.tenantName);
    if (tenantId) {
      tenantStore.setTenantId(tenantId);
    }
  }
  // 是否开启验证码
  if (captchaEnable) {
    loginData.value = values;
    verifyRef.value.show();
  } else {
    authStore.authLogin(values);
  }
};

const handleVerifySuccess = async ({ captchaVerification }: any) => {
  try {
    await authStore.authLogin({
      ...loginData.value,
      captchaVerification,
    });
  } catch (error) {
    console.error('Error in handleLogin:', error);
  }
};

watchEffect(async () => {
  if (tenantEnable) {
    const website = window.location.hostname;
    const tenant = await getTenantByWebsite(website);
    if (tenant) {
      tenantStore.setTenant({
        tenantId: tenant.id,
        tenantName: tenant.name,
      });
    }
  }
});
</script>

<template>
  <div>
    <AuthenticationLogin
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="handleLogin"
    />
    <Verification
      ref="verifyRef"
      :captcha-type="captchaType"
      :check-captcha-api="checkCaptcha"
      :get-captcha-api="getCaptcha"
      :img-size="{ width: '400px', height: '200px' }"
      mode="pop"
      @on-success="handleVerifySuccess"
    />
  </div>
</template>
