<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';

import { defineAsyncComponent, h, reactive } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { NImage } from 'naive-ui';

import { message, modal } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import {
  deleteFileConfig,
  getFileConfigPage,
  testFileConfig,
  updateFileConfigMaster,
} from '#/api/infra/file-config';
import { ActionButtons } from '#/components/action-buttons';

import { formSchema, tableColumns } from './file-config.data';

defineOptions({
  name: 'InfraFileConfig',
});

/**
 * 表格查询表单配置
 */
const formOptions = reactive<any>({
  // 默认展开
  collapsed: false,
  schema: formSchema,
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  // 按下回车时是否提交表单
  submitOnEnter: false,
} as VbenFormProps);

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
        const data = await getFileConfigPage({
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
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

// 使用编辑弹窗组件
const [EditFormModal, editFormModalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./components/edit-form.vue'),
  ),
  onClosed: () => {
    gridApi.reload();
  },
});

/**
 * 新增
 */
const handleCreate = () => {
  editFormModalApi.open();
};

/**
 * 编辑
 * @param row 行数据
 */
const handleEdit = (row: Record<string, any>) => {
  editFormModalApi.setData(row);
  editFormModalApi.open();
};

/**
 * 主配置
 * @param row 行数据
 */
const handleMainConfig = async (row: Record<string, any>) => {
  const res = await updateFileConfigMaster(row.id);
  if (res) {
    message.success('设置成功');
    gridApi.reload();
  }
};

/**
 * 测试
 * @param row 行数据
 */
const handleTest = async (row: Record<string, any>) => {
  // 上传中
  message.loading({
    content: '测试文件上传中...',
    key: 'test_file_upload',
    duration: 0,
  });
  try {
    const res = await testFileConfig(row.id);
    if (res) {
      message.success({
        content: '测试文件上传成功',
        key: 'test_file_upload',
      });
      // 是否预览测试文件弹窗
      modal.confirm({
        title: '测试文件上传成功',
        content: '是否预览测试文件',
        onOk: () => {
          modal.success({
            title: '测试文件',
            content: h('div', { style: { marginRight: '32px' } }, [
              h(
                'p',
                { style: { marginBottom: '16px' } },
                `测试文件地址: ${res}`,
              ),
              h(NImage, { src: res, width: '100%' }),
            ]),
          });
        },
      });
    }
  } catch {
    message.error({
      content: '测试文件上传失败',
      key: 'test_file_upload',
    });
  }
};

/**
 * 删除
 * @param row 行数据
 */
const handleDelete = async (row: Record<string, any>) => {
  try {
    await deleteFileConfig(row.id);
    message.success('删除成功');
    gridApi.reload();
  } catch {}
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <ActionButtons
          :actions="[
            {
              type: 'primary',
              icon: 'ant-design:plus-outlined',
              label: '新增',
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #action="{ row }">
        <ActionButtons
          :actions="[
            {
              type: 'link',
              label: '编辑',
              onClick: () => handleEdit(row),
            },
            {
              type: 'link',
              label: '主配置',
              disabled: row.master,
              popConfirm: {
                title: '确定要设置为主配置吗？',
                confirm: () => handleMainConfig(row),
              },
            },
            {
              type: 'link',
              label: '测试',
              popConfirm: {
                title: '确定要测试吗？',
                confirm: () => handleTest(row),
              },
            },
            {
              type: 'link',
              danger: true,
              label: '删除',
              popConfirm: {
                title: '确定要删除吗？',
                confirm: () => handleDelete(row),
              },
            },
          ]"
        />
      </template>
    </Grid>
    <EditFormModal />
  </Page>
</template>
