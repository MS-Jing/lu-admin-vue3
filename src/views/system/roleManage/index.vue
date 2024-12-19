<template>
  <div class="card content-box">
    <div class="table-box">
      <ProTable ref="proTable" title="角色列表" row-key="path" :columns="columns" :request-api="getTableList">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button v-auth="'sys:sys_role:save'" type="primary" :icon="CirclePlus" @click="onSave">新增角色</el-button>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button v-auth="'sys:sys_role:update'" type="primary" link :icon="EditPen" @click="onUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-auth="'sys:sys_role:delete'" type="primary" link :icon="Delete" @click="onDelete(scope.row)">
            删除
          </el-button>
        </template>
      </ProTable>
      <SysRoleOperateDrawer ref="drawerRef"></SysRoleOperateDrawer>
    </div>
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { deleteSysRole, getRolePage, saveRole, SysRolePageResult, updateRole } from "@/api/modules/role";
import { ref } from "vue";
import SysRoleOperateDrawer from "@/views/system/roleManage/SysRoleOperateDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "roleCode", label: "角色编码" },
  { prop: "roleName", label: "角色名称", search: { el: "input", tooltip: "角色名称 支持模糊查询" } },
  { prop: "remark", label: "备注" },
  { prop: "updateTime", label: "更新时间" },
  { prop: "operation", label: "操作", fixed: "right" }
];

const proTable = ref<ProTableInstance>();

const getTableList = param => {
  return getRolePage(param);
};

const drawerRef = ref<InstanceType<typeof SysRoleOperateDrawer> | null>(null);

const onSave = () => {
  drawerRef.value?.openDrawer({
    title: "新增",
    isSave: true,
    isUpdate: false,
    row: {},
    api: saveRole,
    getTableList: proTable.value?.getTableList
  });
};

const onUpdate = (row: Partial<SysRolePageResult> = {}) => {
  drawerRef.value?.openDrawer({
    title: "更新",
    isSave: false,
    isUpdate: true,
    row: { ...row },
    api: updateRole,
    getTableList: proTable.value?.getTableList
  });
};

// 删除信息
const onDelete = async (row: SysRolePageResult) => {
  await useHandleData(deleteSysRole, row.id, `删除【${row.roleName}】`);
  proTable.value?.getTableList();
};
</script>
