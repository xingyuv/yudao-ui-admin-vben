<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { createPost, getPost, updatePost } from '#/api/system/post';

import { modalSchema } from './post.data';

defineOptions({ name: 'PostModel' });

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

      isUpdate.value = !isEmpty(id);
      if (id) {
        const values = await getPost(id);
        formApi.setValues(values);
      }
      modalApi.setState({ title: isUpdate.value ? '编辑岗位' : '新增岗位' });
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  await (isUpdate.value
    ? updatePost(values as any)
    : createPost(values as any));
  modalApi.close();
  await formApi.resetForm();
}
</script>
<template>
  <Modal class="w-1/3">
    <Form />
  </Modal>
</template>
