<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :indent="20"
      :pagination="false"
      :columns="columns"
      :request-api="getTableTree"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus">新增菜单</el-button>
      </template>
      <!-- 菜单操作 -->
      <template #operation>
        <el-button type="primary" link :icon="EditPen"> 编辑</el-button>
        <el-button type="primary" link :icon="Delete"> 删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps, EnumProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSysMenuTree } from "@/api/modules/menu";

const proTable = ref();

const getTableTree = () => {
  return getSysMenuTree();
};

const yesOrNo: EnumProps[] = [
  {
    value: true,
    label: "是",
    tagType: "success"
  },
  {
    value: false,
    label: "否",
    tagType: "warning"
  }
];

const MenuTypeProps: EnumProps[] = [
  {
    value: 1,
    label: "目录",
    tagType: "primary"
  },
  {
    value: 2,
    label: "菜单",
    tagType: "success"
  },
  {
    value: 3,
    label: "按钮",
    tagType: "info"
  }
];

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单标题", width: 200, align: "left", fixed: "left" },
  { prop: "moduleName", label: "所属模块", fixed: "left" },
  {
    prop: "menuType",
    label: "类型",
    fixed: "left",
    tag: true,
    enum: MenuTypeProps
  },
  { prop: "path", label: "菜单路径", width: 300 },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "redirect", label: "重定向", width: 300 },
  { prop: "meta.link", label: "外链地址", width: 300 },
  { prop: "meta.hide", label: "菜单中隐藏", width: 100, tag: true, enum: yesOrNo },
  { prop: "meta.full", label: "全屏", width: 100, tag: true, enum: yesOrNo },
  { prop: "meta.affix", label: "固定标签页", width: 100, tag: true, enum: yesOrNo },
  { prop: "meta.keepAlive", label: "路由缓存", width: 100, tag: true, enum: yesOrNo },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
</script>
