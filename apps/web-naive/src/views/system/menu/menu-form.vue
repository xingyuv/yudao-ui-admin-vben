<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createMenu, getMenu, updateMenu } from '#/api/system/menu';

import { modalSchema } from './menu.data';

defineOptions({ name: 'MenuModel' });

const isUpdate = ref(false);

const [Form, formApi] = useVbenForm({
  schema: modalSchema,
  handleSubmit: onSubmit,
  showDefaultActions: false,
});

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
      isUpdate.value = !!id;
      if (id) {
        const values = await getMenu(id);
        formApi.setValues(values);
      }
    }
  },
  title: isUpdate.value ? '新增菜单' : '编辑菜单',
});

async function onSubmit(values: Record<string, any>) {
  await (isUpdate.value
    ? updateMenu(values as any)
    : createMenu(values as any));
  modalApi.close();
  await formApi.resetForm();
}
</script>
<template>
  <Modal class="w-1/2">
    <Form />
  </Modal>
</template>
