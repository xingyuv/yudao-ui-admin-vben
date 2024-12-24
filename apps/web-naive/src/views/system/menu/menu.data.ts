import type { VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

import { type VbenFormSchema } from '#/adapter/form';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '菜单名称',
  },
  {
    component: 'Input',
    fieldName: 'code',
    label: '岗位编码',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      placeholder: '请选择',
    },
    fieldName: 'status',
    label: '状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  // { title: '序号', type: 'seq', width: 50 },
  // { field: 'id', title: '岗位编号' },
  { field: 'name', title: '菜单名称', minWidth: 100, treeNode: true },
  {
    field: 'icon',
    title: '菜单图标',
    cellRender: { name: 'CellIcon' },
    width: 100,
  },
  {
    field: 'type',
    title: '菜单类型',
    cellRender: {
      name: 'CellDict',
      props: { type: DICT_TYPE.SYSTEM_MENU_TYPE },
    },
  },
  { field: 'permission', title: '权限标识' },
  { field: 'component', title: '组件路径' },
  { field: 'componentName', title: '组件名称' },
  {
    field: 'status',
    title: '状态',
    cellRender: { name: 'CellDict', props: { type: DICT_TYPE.COMMON_STATUS } },
  },
  { field: 'createTime', formatter: 'formatDateTime', title: '创建时间' },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: $t('page.action.action'),
    width: 160,
  },
];

export const modalSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'id',
    label: 'id',
    dependencies: {
      triggerFields: [''],
      show: () => false,
    },
  },
];
