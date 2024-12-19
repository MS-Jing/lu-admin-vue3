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
        <el-button v-auth="'sys:sys_menu:save'" type="primary" :icon="CirclePlus" @click="onOperate('新增', 2)">
          新增菜单
        </el-button>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button v-auth="'sys:sys_menu:update'" type="primary" link :icon="EditPen" @click="onOperate('编辑', 3, scope.row)">
          编辑
        </el-button>
        <el-button v-auth="'sys:sys_menu:delete'" type="primary" link :icon="Delete" @click="onDelete(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <MenuOperateDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps, EnumProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { deleteSysMenu, getSysMenuTree, MenuTypeProps, saveSysMenu, SysMenuInfoResult, updateSysMenu } from "@/api/modules/menu";
import MenuOperateDrawer from "@/views/system/menuMange/MenuOperateDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

const proTable = ref<ProTableInstance>();

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

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单标题", width: 200, align: "left", fixed: "left" },
  { prop: "moduleName", label: "所属模块", width: 100, fixed: "left" },
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

// 删除信息
const onDelete = async (row: SysMenuInfoResult) => {
  await useHandleData(deleteSysMenu, row.id, `删除【${row.meta?.title}】菜单`);
  proTable.value?.getTableList();
};

const drawerRef = ref<InstanceType<typeof MenuOperateDrawer> | null>(null);
const onOperate = (title: string, operate: number, row: Partial<SysMenuInfoResult> = {}) => {
  const params = {
    title: title,
    isSave: operate == 2,
    isUpdate: operate == 3,
    row: { ...row },
    api: operate == 2 ? saveSysMenu : updateSysMenu,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.openDrawer(params);
};
</script>
