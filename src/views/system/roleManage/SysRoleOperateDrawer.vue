<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="25%" :title="`${drawerProps.title}-菜单管理`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=":" :rules="rules" :model="operateDataInfo">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="operateDataInfo.roleCode" placeholder="请输入角色编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="operateDataInfo.roleName" placeholder="请输入角色名称" clearable></el-input>
      </el-form-item>
      <el-space fill>
        <el-alert type="info" show-icon :closable="false">
          <p>为该角色分配菜单权限，如果目标用户有菜单管理，那么他只能管理自己拥有的菜单</p>
        </el-alert>
        <el-form-item label="菜单权限">
          <el-tree
            ref="menuTreeRef"
            node-key="id"
            :data="menuTree"
            :props="{ label: data => data.meta?.title }"
            :render-after-expand="false"
            highlight-current
            show-checkbox
            check-strictly
            check-on-click-node
            :default-checked-keys="operateDataInfo.menuIdList"
          />
        </el-form-item>
      </el-space>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          v-model="operateDataInfo.remark"
          placeholder="请介绍该角色的使用范围或者用途"
          :rows="2"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getRoleInfo, SysRolePageResult, SysRoleSaveParam, SysRoleUpdateParam } from "@/api/modules/role";
import { ElMessage, FormInstance } from "element-plus";
import { getSysMenuTree, SysMenuInfoResult } from "@/api/modules/menu";
import Tree from "element-plus/es/components/tree/src/tree.vue";

const rules = reactive({
  roleCode: [{ required: true, message: "角色编码为必填哦" }],
  roleName: [{ required: true, message: "请填写角色名称" }]
});

// 当前用户拥有的菜单树，用于分配给新的角色或者修改角色菜单
const menuTree = ref<SysMenuInfoResult[]>([]);
const menuTreeRef = ref<InstanceType<typeof Tree> | null>();
onMounted(async () => {
  let { data } = await getSysMenuTree([1, 2, 3]);
  menuTree.value = data;
});

interface DrawerProps {
  title: string;
  isSave: boolean;
  isUpdate: boolean;
  row: Partial<SysRolePageResult>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  isSave: false,
  isUpdate: false,
  row: {}
});

const operateDataInfo = ref<SysRoleSaveParam | SysRoleUpdateParam>({ roleCode: "", roleName: "", menuIdList: [] });
const openDrawer = async (params: DrawerProps) => {
  if (params.isUpdate) {
    // 更新信息，先查询
    let { data } = await getRoleInfo(params.row.id ? params.row.id : "");
    operateDataInfo.value = { ...data };
  } else if (params.isSave) {
    // 新增前的默认值
    operateDataInfo.value = { roleCode: "", roleName: "", menuIdList: [] };
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 将选择的菜单填充到menuIdList
      let optionMenuIdList = menuTreeRef.value?.getCheckedNodes(false, true).map(o => o.id);
      if (optionMenuIdList) {
        operateDataInfo.value.menuIdList = optionMenuIdList;
      }
      await drawerProps.value.api!(operateDataInfo.value);
      ElMessage.success({ message: `${drawerProps.value.title} 成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  openDrawer
});
</script>

<style scoped lang="scss"></style>
