import type { VxeGridProps } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';

import { type FileApi, uploadFile } from '#/api/infra/file';

/**
 * 文件 表格查询表单配置
 */
export const formSchema: VbenFormProps['schema'] = [];

/**
 * 文件 表格配置
 */
export const tableColumns: VxeGridProps<FileApi.FilePageReqVO>['columns'] = [
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
  { field: 'name', title: '文件名称' },
  { field: 'path', title: '文件路径' },
  { field: 'url', title: '文件 URL' },
  { field: 'type', title: '文件类型' },
  { field: 'size', title: '文件大小' },
  { field: 'createTime', title: '创建时间' },
];

/**
 * 文件 编辑表单配置
 */
export const editFormSchema: VbenFormProps['schema'] = [];

/**
 * 文件 上传表单配置
 */
export const uploadFormSchema: VbenFormProps['schema'] = [
  {
    fieldName: 'file',
    label: '文件',
    component: 'ApiUpload',
    componentProps: {
      api: uploadFile,
      uploadMode: 'file',
    },
  },
];
