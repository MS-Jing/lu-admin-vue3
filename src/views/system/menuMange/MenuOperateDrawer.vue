<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="25%" :title="`${drawerProps.title}-菜单`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=":" :rules="rules" :model="operateDataInfo">
      <el-form-item label="类型" prop="menuType">
        <el-radio-group v-model="operateDataInfo.menuType" @change="onChangeMenuType">
          <el-radio-button v-for="option in MenuTypeProps" :key="option.value" :value="option.value" :label="option.label" />
        </el-radio-group>
      </el-form-item>
      <el-space fill>
        <el-alert type="info" show-icon :closable="false">
          <p>
            如果类型是目录, 那么父级只能是目录！<br />
            如果类型是菜单, 父级可以是目录,也可以是菜单(子菜单,隐藏起来的详情页)！<br />
            如果是按钮, 那么父级只能是菜单！
          </p>
          <p>否则会出现 “错误的父级类型!”</p>
        </el-alert>
        <el-form-item label="父级" prop="parentId">
          <el-tree-select
            v-model="operateDataInfo.parentId"
            value-key="id"
            :data="[menuTree]"
            :props="{ label: data => data.meta?.title }"
            check-strictly
            :render-after-expand="false"
            check-on-click-node
            placeholder="请选择父级"
            @current-change="syncModuleName"
          />
        </el-form-item>
      </el-space>
      <el-form-item label="所属模块" prop="moduleName">
        <el-select
          v-model="operateDataInfo.moduleName"
          :disabled="operateDataInfo.parentId != '0'"
          filterable
          placeholder="请选择所属模块"
          clearable
        >
          <el-option
            v-for="option in modulesInfoList"
            :key="option.moduleName"
            :value="option.moduleName"
            :label="option.moduleName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="operateDataInfo.title" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType < 3" label="路由(path)" prop="path">
        <el-input v-model="operateDataInfo.path" placeholder="请输入路由路径" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType < 3" label="名称(name)" prop="name">
        <el-input v-model="operateDataInfo.name" placeholder="请输入路由name" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 2" label="菜单组件" prop="component">
        <el-input v-model="operateDataInfo.component" placeholder="请输入菜单组件" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 2" label="外链地址" prop="link">
        <el-input v-model="operateDataInfo.link" placeholder="路由外链时填写的访问地址" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 1" label="重定向" prop="redirect">
        <el-input v-model="operateDataInfo.redirect" placeholder="非必填,可以重定向到任意路由" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType < 3" label="图标" prop="icon">
        <SelectIcon v-model:icon-value="operateDataInfo.icon" placeholder="请选择图标" />
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 2" label="隐藏" prop="hide">
        <el-switch v-model="operateDataInfo.hide" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <el-space v-if="operateDataInfo.menuType == 2 && operateDataInfo.hide" fill>
        <el-alert type="info" show-icon :closable="false">
          <p>当前路由为详情页时，需要高亮的菜单path</p>
        </el-alert>
        <el-form-item label="活跃菜单" prop="activeMenu">
          <el-input v-model="operateDataInfo.activeMenu" placeholder="请输入活跃菜单" clearable></el-input>
        </el-form-item>
      </el-space>
      <el-form-item v-if="operateDataInfo.menuType == 2" label="充满屏幕" prop="full">
        <el-switch v-model="operateDataInfo.full" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 2" label="依附tab" prop="affix">
        <el-switch v-model="operateDataInfo.affix" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType < 3" label="keepAlive" prop="keepAlive">
        <el-switch v-model="operateDataInfo.keepAlive" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="operateDataInfo.menuType == 3" label="权限" prop="permission">
        <el-input v-model="operateDataInfo.permission" placeholder="请输入按钮权限" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortCode">
        <el-input-number v-model="operateDataInfo.sortCode" />
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
import {
  getSysMenuInfo,
  getSysMenuTree,
  MenuTypeProps,
  SaveSysMenuParam,
  SysMenuInfoResult,
  UpdateSysMenuParam
} from "@/api/modules/menu";
import { ElMessage, FormInstance } from "element-plus";
import { getModulesInfo, ModuleInfo } from "@/api/modules/common";
import SelectIcon from "@/components/SelectIcon/index.vue";

const rules = reactive({
  moduleName: [{ required: true, message: "请填写所属模块" }],
  title: [{ required: true, message: "请填写标题" }],
  parentId: [{ required: true, message: "请选择父级" }],
  menuType: [{ required: true, message: "请选择类型" }]
});

// 可选模块
const modulesInfoList = ref<ModuleInfo[]>([]);
// 构建根目录菜单树，用于选择父菜单
const menuTree = ref<SysMenuInfoResult>({ id: "0", parentId: "0", menuType: 1, meta: { title: "根目录" }, children: [] });
onMounted(async () => {
  let { data } = await getModulesInfo();
  modulesInfoList.value = data;
});

interface DrawerProps {
  title: string;
  isSave: boolean;
  isUpdate: boolean;
  row: Partial<SysMenuInfoResult>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isSave: false,
  isUpdate: false,
  title: "",
  row: {}
});

const operateDataInfo = ref<UpdateSysMenuParam | SaveSysMenuParam>({ menuType: 1, parentId: "0" });

const onChangeMenuType = async value => {
  // 限制 目录只能选目录 菜单只能选目录，按钮只能选菜单
  let opt: number[];
  if (value == 1) {
    opt = [1];
  } else if (value == 2) {
    opt = [1, 2];
  } else if (value == 3) {
    opt = [1, 2];
  } else {
    opt = [1, 2, 3];
  }
  menuTree.value.children = (await getSysMenuTree(opt)).data;
};

const syncModuleName = (value: SysMenuInfoResult) => {
  operateDataInfo.value.moduleName = value.moduleName;
};

const openDrawer = async (params: DrawerProps) => {
  if (params.isUpdate) {
    // 更新信息，先查询
    let { data } = await getSysMenuInfo(params.row.id);
    operateDataInfo.value = {
      ...data,
      icon: data.meta?.icon,
      title: data.meta?.title,
      activeMenu: data.meta?.activeMenu,
      link: data.meta?.link,
      hide: data.meta?.hide,
      full: data.meta?.full,
      affix: data.meta?.affix,
      keepAlive: data.meta?.keepAlive
    };
    await onChangeMenuType(data.menuType);
  } else if (params.isSave) {
    // 新增前的默认值
    operateDataInfo.value = {
      parentId: params.row?.id ? params.row?.id : "0",
      moduleName: params.row?.moduleName ? params.row?.moduleName : "",
      // 菜单下级默认是按钮（可以是子菜单）
      menuType: params.row?.menuType == 2 ? 3 : 1,
      keepAlive: true,
      sortCode: 999
    };
    // 新增默认是目录
    await onChangeMenuType(operateDataInfo.value.menuType);
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
