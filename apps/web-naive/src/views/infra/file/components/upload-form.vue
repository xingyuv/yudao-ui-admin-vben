<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

import { uploadFormSchema } from '../file.data';

const [Modal] = useVbenModal({
  title: '上传文件',
});
const [Form] = useVbenForm({
  schema: uploadFormSchema,
  showDefaultActions: false,
  handleSubmit: async (_values) => {},
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
