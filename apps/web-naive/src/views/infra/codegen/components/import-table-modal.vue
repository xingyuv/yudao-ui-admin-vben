<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal, type VbenFormProps } from '@vben/common-ui';
import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '@vben/plugins/vxe-table';

import {
  type CodegenApi,
  createCodegenList,
  getSchemaTableList,
} from '#/api/infra/codegen';

import { CodegenImportTableModalData } from '../codegen.data';

const confirmLoading = ref<boolean>(false);

// checked
const checkedStatus = ref<boolean>(false);
const checkedRecords = ref<any[]>([]);
/**
 * 表格查询表单配置
 */
const formOptions = reactive<any>({
  // 默认展开
  collapsed: false,
  schema: CodegenImportTableModalData.formSchema,
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
  columns: CodegenImportTableModalData.tableColumns,
  toolbarConfig: {
    enabled: false,
  },
  height: 'auto',
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async (_, values) => {
        return await getSchemaTableList(values);
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
} as VxeGridProps);

const gridEvents = reactive<any>({
  checkboxChange: (params) => {
    const { checked, $grid } = params;
    checkedStatus.value = checked;
    checkedRecords.value = $grid.getCheckboxRecords();
  },
  checkboxAll: (params) => {
    const { checked } = params;
    checkedStatus.value = checked;
  },
} as VxeGridListeners);

// 使用表格组件
const [Grid, gridApi] = useVbenVxeGrid(
  reactive({
    formOptions,
    gridOptions,
    gridEvents,
  }),
);

const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px] h-[800px]',
  confirmLoading: confirmLoading.value,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  onConfirm: async () => {
    modalApi.setState({ confirmLoading: true });
    const formValues = await gridApi.formApi.getValues();
    // 获取选中的数据
    const checkedRecords =
      gridApi.grid.getCheckboxRecords() as CodegenApi.DatabaseTableRespVO[];
    try {
      await createCodegenList({
        dataSourceConfigId: formValues.dataSourceConfigId,
        tableNames: checkedRecords.map((item) => item.name),
      });
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
    modalApi.close();
  },
});
</script>

<template>
  <Modal>
    <Grid />
  </Modal>
</template>
