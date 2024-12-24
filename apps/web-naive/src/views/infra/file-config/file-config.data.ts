import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FileConfigApi } from '#/api/infra/file-config';

import { h } from 'vue';

import { useDictStore } from '@vben/stores';

import { NTag } from 'naive-ui';

import { type VbenFormProps, z } from '#/adapter/form';
import { $t } from '#/locales';
import { DICT_TYPE } from '#/utils/dict';

/**
 * 文件配置 表格查询表单配置
 */
export const formSchema: VbenFormProps['schema'] = [
  {
    fieldName: 'name',
    label: '配置名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入配置名称',
    },
  },
  {
    fieldName: 'storage',
    label: '储存器',
    component: 'ApiSelect',
    componentProps: {
      class: 'w-full',
      placeholder: '请选择储存器',
      api: () => {
        return useDictStore().getDictOptions(DICT_TYPE.INFRA_FILE_STORAGE);
      },
    },
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    component: 'DatePicker',
  },
];

/**
 * 文件配置 表格配置
 */
export const tableColumns: VxeGridProps<FileConfigApi.FileConfigVO>['columns'] =
  [
    {
      fixed: 'left',
      type: 'checkbox',
      width: 50,
    },
    {
      fixed: 'left',
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '配置名称' },
    {
      field: 'storage',
      title: '储存器',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_FILE_STORAGE },
      },
    },
    { field: 'remark', title: '备注' },
    {
      field: 'master',
      title: '主配置',
      slots: {
        default: ({ row }) => {
          return h(
            NTag,
            {
              type: row.master ? 'success' : 'default',
            },
            { default: () => (row.master ? '是' : '否') },
          );
        },
      },
    },
    { field: 'createTime', title: '创建时间', formatter: 'formatDateTime' },
    {
      field: 'action',
      fixed: 'right',
      width: '180px',
      slots: { default: 'action' },
      title: $t('page.action.action'),
    },
  ];

/**
 * 文件配置 编辑表单配置
 */
export const editFormSchema: VbenFormProps['schema'] = [
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
    fieldName: 'name',
    label: '配置名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入配置名称',
    },
    rules: z.string().min(1, '请输入配置名称'),
  },
  {
    fieldName: 'remark',
    label: '备注',
    component: 'Input',
  },
  {
    fieldName: 'storage',
    label: '储存器',
    component: 'ApiSelect',
    componentProps: {
      class: 'w-full',
      placeholder: '请选择储存器',
      api: () => {
        return useDictStore().getDictOptions(DICT_TYPE.INFRA_FILE_STORAGE);
      },
    },
    rules: 'required',
    defaultValue: '1',
  },
  {
    fieldName: 'config.basePath',
    label: '基础路径',
    component: 'Input',
    componentProps: {
      placeholder: '请输入基础路径',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => {
        return [10, 11, 12].includes(values.storage);
      },
    },
  },
  {
    fieldName: 'config.host',
    label: '主机地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入主机地址',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => [11, 12].includes(values.storage),
    },
  },
  {
    fieldName: 'config.port',
    label: '主机端口',
    component: 'Input',
    componentProps: {
      placeholder: '请输入主机端口',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => [11, 12].includes(values.storage),
    },
  },
  {
    fieldName: 'config.username',
    label: '用户名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户名',
    },
    rules: z.string().min(1, '请输入用户名'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => [11, 12].includes(values.storage),
    },
  },
  {
    fieldName: 'config.password',
    label: '密码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入密码',
    },
    rules: z.string().min(1, '请输入密码'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => [11, 12].includes(values.storage),
    },
  },
  {
    fieldName: 'config.mode',
    label: '连接模式',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '主动模式', value: 'active' },
        { label: '被动模式', value: 'passive' },
      ],
      class: 'w-full',
      placeholder: '请选择连接模式',
    },
    rules: z.string().min(1, '请选择连接模式'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => values.storage === 11,
    },
  },
  {
    fieldName: 'config.endpoint',
    label: '端点/节点地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入端点/节点地址',
    },
    rules: z.string().min(1, '请输入端点/节点地址'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => values.storage === 20,
    },
  },
  {
    fieldName: 'config.bucket',
    label: '桶名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入桶名称',
    },
    rules: z.string().min(1, '请输入桶名称'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => values.storage === 20,
    },
  },
  {
    fieldName: 'config.accessKey',
    label: 'accessKey',
    component: 'Input',
    componentProps: {
      placeholder: '请输入访问密钥',
    },
    rules: z.string().min(1, '请输入访问密钥'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => values.storage === 20,
    },
  },
  {
    fieldName: 'config.accessSecret',
    label: 'accessSecret',
    component: 'Input',
    componentProps: {
      placeholder: '请输入访问密钥',
    },
    rules: z.string().min(1, '请输入访问密钥'),
    dependencies: {
      triggerFields: ['storage'],
      if: (values: Record<string, any>) => values.storage === 20,
    },
  },
  {
    fieldName: 'config.domain',
    label: '自定义域名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入自定义域名',
    },
  },
];
