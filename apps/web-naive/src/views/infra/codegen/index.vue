<script lang="ts" setup>
import { defineAsyncComponent, reactive, ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';

import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { type CodegenApi, getCodegenTablePage } from '#/api/infra/codegen';
import { ActionButtons, IconEnum } from '#/components/action-buttons';

import { CodegenDefaultData } from './codegen.data';

// checked
const checkedStatus = ref<boolean>(false);

/**
 * 删除
 */
const handleDelete = (_row: CodegenApi.CodegenTableRespVO) => {
  // console.log('删除', row);
};

/**
 * 批量删除
 */
const handleBatchDelete = (_rows: CodegenApi.CodegenTableRespVO[]) => {
  // console.log('批量删除', rows);
};

/**
 * 同步
 */
const handleSync = (_row: CodegenApi.CodegenTableRespVO) => {
  // console.log('同步', row);
};

/**
 * 批量同步
 */
const handleBatchSync = (_rows: CodegenApi.CodegenTableRespVO[]) => {
  // console.log('批量同步', rows);
};

/**
 * 生成代码
 */
const handleGenerateCode = (_row: CodegenApi.CodegenTableRespVO) => {
  // console.log('生成代码', row);
};

/**
 * 批量生成代码
 */
const handleBatchGenerateCode = (_rows: CodegenApi.CodegenTableRespVO[]) => {
  // console.log('批量生成代码', rows);
};

/**
 * 表格查询表单配置
 */
const formOptions = reactive<any>({
  // 默认展开
  collapsed: false,
  schema: CodegenDefaultData.formSchema,
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
  columns: CodegenDefaultData.tableColumns,
  height: 'auto',
  checkboxConfig: {
    reserve: true,
    highlight: true,
    // labelField: 'id',
  },
  rowConfig: {
    keyField: 'id',
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, params) => {
        const data = await getCodegenTablePage({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...params,
        });
        return data;
      },
    },
  },
} as VxeGridProps);

const gridEvents = reactive<any>({
  checkboxChange: (params) => {
    const { checked } = params;
    checkedStatus.value = checked;
  },
  checkboxAll: (params) => {
    const { checked } = params;
    checkedStatus.value = checked;
  },
} as VxeGridListeners);

// 使用表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

// 使用导入表弹窗组件
const [ImportTableModal, importTableModalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./components/import-table-modal.vue'),
  ),
  onClosed: () => {
    gridApi.reload(formOptions.values);
  },
});

// 使用预览代码弹窗组件
const [PreviewCodeModal, previewCodeModalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./components/preview-code-modal.vue'),
  ),
});

// 使用修改代码生成配置弹窗组件
const [CodegenOptionsModal, codegenOptionsModalApi] = useVbenModal({
  connectedComponent: defineAsyncComponent(
    () => import('./components/codegen-options-modal.vue'),
  ),
});

/**
 * 打开导入表弹窗
 */
const handleOpenImportTableModal = () => {
  importTableModalApi.open();
};

/**
 * 打开预览代码弹窗
 */
const handleOpenPreviewCodeModal = (row: CodegenApi.CodegenTableRespVO) => {
  previewCodeModalApi.setData(row);
  previewCodeModalApi.open();
};

/**
 * 打开修改代码生成配置弹窗
 */
const handleOpenCodegenOptionsModal = (row: CodegenApi.CodegenTableRespVO) => {
  codegenOptionsModalApi.setData(row);
  codegenOptionsModalApi.open();
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
              label: '导入表',
              icon: IconEnum.ADD,
              onClick: handleOpenImportTableModal,
            },
            {
              label: '批量同步',
              disabled: !checkedStatus,
              class: checkedStatus
                ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400 hover:!text-white hover:!border-emerald-400 active:!bg-emerald-600 active:!text-white active:!border-emerald-600'
                : '',
              icon: 'ant-design:sync-outlined',
              onClick: handleBatchSync,
            },
            {
              label: '批量生成',
              disabled: !checkedStatus,
              class: checkedStatus
                ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400 hover:!text-white hover:!border-emerald-400 active:!bg-emerald-600 active:!text-white active:!border-emerald-600'
                : '',
              icon: 'ant-design:code-outlined',
              onClick: handleBatchGenerateCode,
            },
            {
              label: '批量删除',
              disabled: !checkedStatus,
              danger: true,
              icon: 'ant-design:delete-outlined',
              onClick: handleBatchDelete,
            },
          ]"
        />
      </template>
      <template #action="{ row }">
        <ActionButtons
          :actions="[
            {
              type: 'link',
              label: '查看',
              icon: 'ant-design:eye-outlined',
              onClick: handleOpenPreviewCodeModal.bind(null, row),
            },
            {
              type: 'link',
              label: '编辑',
              icon: 'ant-design:edit-outlined',
              onClick: handleOpenCodegenOptionsModal.bind(null, row),
            },
            {
              type: 'link',
              label: '删除',
              danger: true,
              icon: 'ant-design:delete-outlined',
              onClick: handleDelete.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: '同步',
              icon: 'ant-design:sync-outlined',
              onClick: handleSync.bind(null, row),
            },
            {
              label: '生成代码',
              icon: 'ant-design:code-outlined',
              onClick: handleGenerateCode.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
    <ImportTableModal />
    <PreviewCodeModal />
    <CodegenOptionsModal />
  </Page>
</template>
