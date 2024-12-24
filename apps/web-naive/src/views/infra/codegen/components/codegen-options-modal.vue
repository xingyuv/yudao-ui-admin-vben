<script setup lang="ts">
import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { CodegenOptionsModalData } from '../codegen.data';

defineOptions({
  name: 'CodegenOptionsModal',
});

// 使用表单组件
const [Form] = useVbenForm({
  commonConfig: {
    labelWidth: 120,
    wrapperClass: 'w-full',
  },
  schema: CodegenOptionsModalData.formSchema,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

// 使用弹窗组件
const [Modal] = useVbenModal({
  title: '修改代码生成配置',
  class: 'w-[90%] h-[90%]',
  onOpenChange(isOpen) {
    if (isOpen) {
      // TODO: 打开弹窗
    }
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
