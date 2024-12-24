<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { NButton, NMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenuList, type MenuVO } from '#/api/system/menu';

import { columns, formSchema } from './menu.data';
import MenuForm from './menu-form.vue';

defineOptions({ name: 'SystemMenu' });

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: formSchema,
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<MenuVO> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns,
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async (formValues) => {
        return await getMenuList({
          ...formValues,
        });
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: MenuForm,
});

function handleCreate() {
  formModalApi.setData({
    valuse: {},
  });
  formModalApi.open();
}
async function handleEdit(id: number) {
  formModalApi.setData({ id });
  formModalApi.open();
}
// TODO
function handleDelete(id: number) {
  NMessage.success(id);
}
const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <NButton
          type="primary"
          v-access:code="['system:post:create']"
          @click="handleCreate"
        >
          {{ $t('page.action.add') }}
        </NButton>
      </template>
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary" @click="expandAll">
          展开全部
        </NButton>
        <NButton type="primary" @click="collapseAll"> 折叠全部 </NButton>
      </template>
      <template #action="{ row }">
        <NButton
          type="link"
          v-access:code="['system:post:update']"
          @click="handleEdit(row.id)"
        >
          {{ $t('page.action.edit') }}
        </NButton>
        <NButton
          danger
          type="link"
          v-access:code="['system:post:delete']"
          @click="handleDelete(row.id)"
        >
          {{ $t('page.action.delete') }}
        </NButton>
      </template>
    </Grid>
    <FormModal />
  </Page>
</template>
