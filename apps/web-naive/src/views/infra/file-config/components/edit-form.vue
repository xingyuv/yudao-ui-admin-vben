<script setup lang="ts">
import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  createFileConfig,
  getFileConfig,
  updateFileConfig,
} from '#/api/infra/file-config';

import { editFormSchema } from '../file-config.data';

defineOptions({ name: 'FileConfigEditForm' });

const isUpdate = ref(false);

// 使用表单组件
const [Form, formApi] = useVbenForm({
  schema: editFormSchema,
  showDefaultActions: false,
  handleSubmit: onSubmit,
});

// 使用弹窗组件
const [Modal, modalApi] = useVbenModal({
  onCancel: async () => {
    modalApi.close();
    await formApi.resetForm();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { id } = modalApi.getData<Record<string, any>>();

      isUpdate.value = !isEmpty(id);
      if (id) {
        const values = await getFileConfig(id);
        formApi.setValues(values);
      }
      modalApi.setState({
        title: `${isUpdate.value ? '编辑' : '新增'} 文件配置`,
      });
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  await (isUpdate.value
    ? updateFileConfig(values as any)
    : createFileConfig(values as any));
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
