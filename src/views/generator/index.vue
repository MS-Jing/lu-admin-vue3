<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', 2)">新增</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', 1, scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', 3, scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openPreviewDrawer(scope.row)">预览/生成</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteData(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <GeneratorOperateDrawer ref="drawerRef" />
    <PreviewDrawer ref="previewDrawerRef" />
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import {
  deleteTableConfig,
  GenPageParams,
  GenPageResult,
  getTableConfigList,
  saveOrUpdateTableConfig
} from "@/api/modules/generator";
import GeneratorOperateDrawer from "@/views/generator/GeneratorOperateDrawer.vue";
import PreviewDrawer from "@/views/generator/PreviewDrawer.vue";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: GenPageParams) => {
  console.log(params);
  return getTableConfigList(params);
};

// 表格配置项
const columns = reactive<ColumnProps<GenPageResult>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "tableName",
    label: "表名",
    search: { el: "input", tooltip: "根据真实的物理表名搜索" }
  },
  {
    prop: "comment",
    label: "表注释"
  },
  {
    prop: "updateTime",
    label: "更新时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 删除信息
const deleteData = async (params: GenPageResult) => {
  await useHandleData(deleteTableConfig, [params.id], `删除【${params.tableName}】表配置`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteTableConfig, id, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof GeneratorOperateDrawer> | null>(null);
const openDrawer = (title: string, operate: number, row: Partial<GenPageResult> = {}) => {
  const params = {
    title: title,
    isView: operate == 1,
    isSave: operate == 2,
    isUpdate: operate == 3,
    row: { ...row },
    api: operate == 2 ? saveOrUpdateTableConfig : operate == 3 ? saveOrUpdateTableConfig : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 预览
const previewDrawerRef = ref<InstanceType<typeof PreviewDrawer> | null>(null);
const openPreviewDrawer = (row: Partial<GenPageResult> = {}) => {
  previewDrawerRef.value?.openPreviewDrawer({ row: { ...row } });
};
</script>
