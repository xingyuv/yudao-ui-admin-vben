import type { VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

import { type VbenFormSchema } from '#/adapter/form';

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '岗位名称',
  },
  {
    component: 'Input',
    fieldName: 'code',
    label: '岗位编码',
  },
  // TODO: dict
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        {
          label: 'Color1',
          value: '1',
        },
        {
          label: 'Color2',
          value: '2',
        },
      ],
      placeholder: '请选择',
    },
    fieldName: 'status',
    label: '状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  { title: '序号', type: 'seq', width: 50 },
  { field: 'id', title: '岗位编号' },
  { field: 'name', title: '岗位名称' },
  { field: 'code', title: '岗位编码' },
  { field: 'sort', title: '岗位顺序' },
  { field: 'remark', title: '岗位备注' },
  {
    field: 'status',
    title: '状态',
    cellRender: { name: 'CellDict', props: { type: 'common_status' } },
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
  {
    component: 'Input',
    fieldName: 'name',
    label: '岗位标题',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'code',
    label: '岗位编码',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'sort',
    label: '岗位顺序',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
    },
    fieldName: 'status',
    label: '状态',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'remark',
    label: '备注',
  },
];
