<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { getFilePage } from '#/api/infra/file';
import { ActionButtons } from '#/components/action-buttons';

import { tableColumns } from './file.data';

/**
 * 表格配置
 */
const gridOptions = reactive<any>({
  columns: tableColumns,
  height: 'auto',
  checkboxConfig: {
    reserve: true,
    highlight: true,
    // labelField: 'id',
  },
  rowConfig: {
    keyField: 'id',
  },
  proxyConfig: {
    ajax: {
      query: async (e, params) => {
        const data = await getFilePage({
          pageNo: e.page.currentPage,
          pageSize: e.page.pageSize,
          ...params,
        });
        return data;
      },
    },
  },
} as VxeGridProps);

/**
 * 表格事件
 */
const gridEvents = reactive<any>({});

// 使用表格组件
const [Grid] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});

/**
 * 使用 上传表单组件
 */
const [UploadForm, uploadFormApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./components/upload-form.vue'),
  ),
});

const handleUpload = () => {
  uploadFormApi.open();
};
const handleView = (_row: any) => {};
const handleEdit = (_row: any) => {};
const handleDelete = (_row: any) => {};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <ActionButtons
          :actions="[
            {
              type: 'primary',
              label: '上传文件',
              icon: 'ant-design:plus-outlined',
              onClick: handleUpload,
            },
          ]"
        />
      </template>
      <template #action="{ row }">
        <ActionButtons
          :actions="[
            {
              label: '查看',
              icon: 'ant-design:eye-outlined',
              onClick: () => handleView(row),
            },
            {
              label: '编辑',
              icon: 'ant-design:edit-outlined',
              onClick: () => handleEdit(row),
            },
            {
              label: '删除',
              icon: 'ant-design:delete-outlined',
              onClick: () => handleDelete(row),
            },
          ]"
        />
      </template>
    </Grid>
    <UploadForm />
  </Page>
</template>
