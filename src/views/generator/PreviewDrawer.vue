<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="95%">
    <template #header="{ titleId, titleClass }">
      <div :id="titleId" :class="titleClass">
        {{ drawerProps.row.tableName }} 表代码预览
        <el-link type="primary" style="margin-left: 8px" :icon="Download" @click="downloadSource"> 下载源码</el-link>
      </div>
    </template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
          <el-tree
            style="margin: 10px"
            :data="dirTree"
            :props="defaultProps"
            :highlight-current="true"
            node-key="key"
            @node-click="handleNodeClick"
            :current-node-key="defaultChecked"
            default-expand-all
          />
        </el-aside>
        <el-container>
          <el-header>
            <div class="card">
              {{ path }}
              <el-link type="primary" style="margin-left: 8px" :icon="DocumentCopy" v-copy="codeContent">复制代码</el-link>
            </div>
          </el-header>
          <el-main>
            <div class="content-box card">
              <highlightjs style="width: 100%; height: 100%" language="java" :code="codeContent"></highlightjs>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { generate, GenPageResult, preview, PreviewResult } from "@/api/modules/generator";
import { DocumentCopy, Download } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import { ElTree } from "element-plus";

const drawerVisible = ref(false);

interface PreviewDrawerProps {
  row: Partial<GenPageResult>;
}

const drawerProps = ref<PreviewDrawerProps>({
  row: {}
});

const openPreviewDrawer = (props: PreviewDrawerProps) => {
  drawerProps.value = props;
  dirTree.value = [];
  idKey = 0;
  // 初始化节点树
  initTree(props.row.id);
  drawerVisible.value = true;
};

const downloadSource = () => {
  let tempName = drawerProps.value.row.comment;
  if (!tempName) {
    tempName = "代码生成";
  }
  useDownload(generate, tempName, drawerProps.value.row.id, false, ".zip");
};

// 目录树
const dirTree = ref<Tree[]>([]);
// 代码内容
const codeContent = ref<string>("");
const path = ref<string | undefined>("");

const defaultChecked = ref<String>("");

const initTree = async (tableId: string | undefined) => {
  let { data } = await preview(tableId);
  for (const item of data) {
    assembleTree(item);
  }
  // 默认选中第一个文件展示
  defaultChecked.value = data[0].fileName;
  codeContent.value = data[0].content;
  path.value = data[0].pathList.join("/");
};

// 每个节点分配一个id
let idKey: number = 0;
const assembleTree = (item: PreviewResult) => {
  let tempDirTree: Tree[] = dirTree.value;
  // 组装文件数层级
  for (const path of item.pathList) {
    // 一级一级找进行组装
    let children: Tree[] | undefined = findTreeChildren(tempDirTree, path);
    // 如果当前这级没有进行组装那么进行组装
    if (children) {
      tempDirTree = children;
    } else {
      let chr: Tree[] = new Array<Tree>();
      tempDirTree.push({ key: idKey++, label: path, children: chr });
      tempDirTree = chr;
    }
  }
  item.pathList.push(item.fileName);
  // 文件的所有层级都组装好了，组装文件的层级
  tempDirTree.push({ key: item.fileName, label: item.fileName, content: item.content, path: item.pathList.join("/") });
};

const findTreeChildren = (tempDirTree: Tree[], treeLabel: string) => {
  for (const treeItem of tempDirTree) {
    if (treeItem.label == treeLabel) {
      return treeItem.children;
    }
  }
};

interface Tree {
  key: number | string;
  label: string;
  children?: Tree[];
  content?: string;
  path?: string;
}

const handleNodeClick = (data: Tree) => {
  if (data.content) {
    path.value = data.path;
    codeContent.value = data.content;
  }
};

const defaultProps = {
  children: "children",
  label: "label",
  content: "content"
};

defineExpose({
  openPreviewDrawer
});
</script>

<style scoped lang="scss"></style>
