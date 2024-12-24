<script lang="ts" setup>
import type { CodegenApi } from '#/api/infra/codegen';

import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import hljs from 'highlight.js'; // 导入代码高亮文件
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { NCard, NTree, type TreeOption } from 'naive-ui';

import { getPreviewCodegen } from '#/api/infra/codegen';

import 'highlight.js/styles/github.css'; // 导入代码高亮样式

defineOptions({ name: 'PreviewCodeModal' });

const fileTreeLoading = ref(false);
const fileTreeRef = ref();

const tabList = ref([]);

// 预览数据
const previewData = reactive({
  fileTree: [] as TreeOption[], // 文件树
  activeName: '', // 激活的文件
});
// 文件树选中的节点
const treeSelectedKeys = ref<string[]>();
// 文件树展开的节点
const expandedKeys = ref<string[]>();

// 预览代码
const previewCodegenDataList = ref<CodegenApi.CodegenPreviewRespVO[]>();

/**
 * 将路径转换为树形结构
 * @param data 路径数据
 * @returns 树形结构
 */
const convertPathToTreeData = (
  data: CodegenApi.CodegenPreviewRespVO[],
): TreeOption[] => {
  const filePaths = data.map((item) => item.filePath);
  const treeData: TreeOption[] = [];

  filePaths.forEach((path) => {
    // 分割路径
    const parts = path.split('/');
    let currentNode = treeData;

    parts.forEach((part, index) => {
      // 查找当前层级是否已存在该节点
      let node = currentNode.find((n) => n.label === part);
      // 判断是否为最后一层
      const isLastLevel = index === parts.length - 1;

      if (!node) {
        // 创建新节点
        node = {
          label: part,
          key: parts.slice(0, index + 1).join('/'),
          isLeaf: isLastLevel,
          children: [],
        };
        currentNode.push(node);
      }

      // 移动到下一层
      currentNode = node.children!;
    });
  });

  return treeData;
};

/**
 * 将文件路径转换为文件名
 * @param path 文件路径
 * @returns 文件名
 */
const convertPathToFileName = (path: string) => {
  return path.split('/').pop()!;
};

/**
 * 切换文件
 */
const handleChangeFile = (key: any) => {
  previewData.activeName = key;
  treeSelectedKeys.value = [key];
  fileTreeRef.value?.scrollTo(key);
};

/**
 * tree 节点点击事件
 */
const handleTreeSelect = (keys: any) => {
  handleChangeFile(keys[0]);
};

/**
 * 代码高亮
 */
const highlightedCode = (item: CodegenApi.CodegenPreviewRespVO) => {
  const language = item.filePath.slice(item.filePath.lastIndexOf('.') + 1);
  const result = hljs.highlight(item.code, { language, ignoreIllegals: true });
  return result.value || '&nbsp;';
};

const [Modal, modalApi] = useVbenModal({
  title: '预览代码',
  class: 'w-[90%] h-[90%]',
  closeOnClickModal: false,
  closeOnPressEscape: false,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const sharedData = modalApi.getData();
      fileTreeLoading.value = true;
      const res = await getPreviewCodegen(sharedData.id);
      previewCodegenDataList.value = res;
      // 生成tab列表
      tabList.value = res.map((item: CodegenApi.CodegenPreviewRespVO) => ({
        key: item.filePath,
        tab: convertPathToFileName(item.filePath),
      }));
      // 生成文件树
      const treeData = convertPathToTreeData(res);
      previewData.fileTree = treeData ?? [];
      fileTreeLoading.value = false;
      // 默认选中第一个文件
      handleChangeFile(res[0].filePath);
    }
  },
});

/**
 * 获取预览代码
 */
const getPreviewCode = computed(() => {
  if (!previewData.activeName || !previewCodegenDataList.value) {
    return '&nbsp;';
  }
  const item = previewCodegenDataList.value?.find(
    (item) => item.filePath === previewData.activeName,
  ) as CodegenApi.CodegenPreviewRespVO;
  return highlightedCode(item) || '&nbsp;';
});

// 初始化
onMounted(() => {
  // 注册代码高亮的各种语言
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('vue', xml);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('typescript', typescript);
});
</script>

<template>
  <Modal>
    <div class="flex h-full gap-4 overflow-hidden">
      <NCard
        :body-style="{ height: 'inherit', padding: '1px 16px' }"
        :loading="fileTreeLoading"
        class="h-full w-5/12"
        title="文件目录"
      >
        <div class="h-[calc(100%-58px)] w-full overflow-auto">
          <NTree
            v-model:expanded-keys="expandedKeys"
            v-model:selected-keys="treeSelectedKeys"
            :data="previewData.fileTree"
            default-expand-all
            show-line
            @update:selected-keys="handleTreeSelect"
          />
        </div>
      </NCard>
      <NCard
        v-model:active-tab-key="previewData.activeName"
        :body-style="{ height: 'inherit', padding: '1px 16px' }"
        :tab-list="tabList"
        class="h-full w-7/12"
        title="代码预览"
        @tab-change="handleChangeFile"
      >
        <div class="h-[calc(100%-58px)] w-full overflow-auto">
          <pre>
            <code v-dompurify-html="getPreviewCode"></code>
          </pre>
        </div>
      </NCard>
    </div>
  </Modal>
</template>
