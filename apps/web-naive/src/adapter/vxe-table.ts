import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { NButton, NImage } from 'naive-ui';

import { getDictObj } from '#/utils/dict';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        toolbarConfig: {
          import: true,
          export: true,
          refresh: true,
          print: true,
          zoom: true,
          custom: true,
        },
        customConfig: {
          mode: 'modal',
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'list',
            total: 'total',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(NImage, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          NButton,
          { size: 'small', type: 'primary', quaternary: true },
          { default: () => props?.text },
        );
      },
    });

    // 字典 表格配置项可以用 cellRender: { name: 'CellDict',props:{dictType: ''} },
    vxeUI.renderer.add('CellDict', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        if (!props) {
          return '';
        }
        const dict = getDictObj(props.type, row[column.field]);
        // 转义
        if (dict) {
          if (`${dict.colorType}` === 'primary') dict.colorType = 'processing';
          else if (`${dict.colorType}` === 'danger') dict.colorType = 'error';
          else if (`${dict.colorType}` === 'info') dict.colorType = 'default';
          else if (!dict.colorType) dict.colorType = 'default';
          return h(
            Tag,
            { color: dict.colorType },
            { default: () => dict.label },
          );
        }
        return '';
      },
    });
    // 图标 表格配置项可以用 cellRender: { name: 'CellIcon' },
    vxeUI.renderer.add('CellIcon', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(IconifyIcon, { icon: row[column.field], size: 14 });
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
