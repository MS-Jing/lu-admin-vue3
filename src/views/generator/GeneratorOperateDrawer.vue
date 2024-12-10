<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="90%" :title="`${drawerProps.title}-表配置`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="dataInfo"
      :hide-required-asterisk="drawerProps.isView"
      :inline="true"
      class="form-inline"
    >
      <el-form-item label="表名" prop="tableName">
        <el-select
          :disabled="!drawerProps.isSave"
          v-model="dataInfo.tableName"
          filterable
          placeholder="选择表名"
          @change="changeTableName"
          clearable
        >
          <el-option v-for="option in tableNameOptions" :key="option" :value="option" :label="option" />
        </el-select>
      </el-form-item>
      <el-form-item label="表注释" prop="comment">
        <el-input v-model="dataInfo.comment" placeholder="表注释可修改" clearable></el-input>
      </el-form-item>
      <el-form-item label="表前缀" prop="tablePrefix">
        <el-input v-model="dataInfo.tablePrefix" placeholder="表前缀" clearable></el-input>
        <el-switch
          v-model="dataInfo.unprefix"
          size="large"
          class="ml-4"
          inline-prompt
          active-text="去除前缀"
          inactive-text="保留前缀"
        />
      </el-form-item>
      <el-form-item label="实体父类" prop="superClass">
        <el-select v-model="dataInfo.superClass" style="width: 400px" filterable placeholder="选择一个父类" clearable>
          <el-option v-for="option in superClassOptions" :key="option" :value="option" :label="option" />
        </el-select>
      </el-form-item>
      <el-form-item label="模块名" prop="moduleName">
        <el-input v-model="dataInfo.moduleName" placeholder="模块名" clearable></el-input>
      </el-form-item>
      <el-form-item label="包名" prop="packageName">
        <el-input v-model="dataInfo.packageName" placeholder="包名 最终的包名为: 包名+模块名" clearable></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="dataInfo.author" placeholder="作者" clearable></el-input>
      </el-form-item>
      <el-form-item label="分页接口">
        <el-switch v-model="dataInfo.genPage" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="信息接口">
        <el-switch v-model="dataInfo.genInfo" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="新增接口">
        <el-switch v-model="dataInfo.genSave" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="更新接口">
        <el-switch v-model="dataInfo.genUpdate" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="删除接口">
        <el-switch v-model="dataInfo.genDeleted" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="导入接口">
        <el-switch v-model="dataInfo.genImport" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
      <el-form-item label="导出接口">
        <el-switch v-model="dataInfo.genExport" class="ml-2" inline-prompt active-text="生成" inactive-text="不生成" />
      </el-form-item>
    </el-form>
    <!--  列配置  -->
    <ProTable :pagination="false" :tool-button="false" :data="dataInfo.columnConfigList" :columns="columns">
      <template #fieldType="scope">
        <el-select
          :disabled="drawerProps.isView"
          v-model="scope.row.enumDictType"
          filterable
          :placeholder="scope.row.fieldType"
          @focus="focusEnumDictType(scope.row.fieldType)"
          clearable
        >
          <template #header>默认字段类型:{{ scope.row.fieldType }}</template>
          <el-option v-for="option in enumDictTypeOptions" :key="option.name" :value="option.name" :label="option.name" />
        </el-select>
      </template>
      <template #showInList="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInList"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #showInQuery="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInQuery"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #queryType="scope">
        <el-select
          :disabled="drawerProps.isView"
          v-if="scope.row.showInQuery"
          v-model="scope.row.queryType"
          filterable
          placeholder="选择查询类型"
          clearable
        >
          <el-option v-for="option in queryTypeOptions" :key="option.label" :value="option.value" :label="option.label" />
        </el-select>
        <div v-else>--</div>
      </template>
      <template #showInInfo="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInInfo"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #showInSave="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInSave"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #showInUpdate="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInUpdate"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #showInImport="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInImport"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template #showInExport="scope">
        <el-switch
          :disabled="drawerProps.isView"
          v-model="scope.row.showInExport"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
    </ProTable>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, toRef } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import {
  GenPageResult,
  getSuperClassOptions,
  getTableNameOptions,
  loadTableInfo,
  tableConfigInfo,
  TableConfigSaveOrUpdateParams
} from "@/api/modules/generator";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, FieldNamesProps } from "@/components/ProTable/interface";
import { EnumListResults, getEnumDictItem, getEnumList } from "@/api/modules/dict";

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }],
  address: [{ required: true, message: "请填写居住地址" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  isSave: boolean;
  isUpdate: boolean;
  row: Partial<GenPageResult>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isSave: false,
  isUpdate: false,
  title: "",
  row: {}
});

const dataInfo = ref<TableConfigSaveOrUpdateParams>({
  genPage: false,
  genInfo: false,
  genSave: false,
  genUpdate: false,
  genDeleted: false,
  genImport: false,
  genExport: false
});

// 列的表格
const columns = reactive<ColumnProps[]>([
  {
    prop: "columnName",
    label: "列名"
  },
  {
    prop: "comment",
    label: "列注释",
    width: "150px"
  },
  {
    prop: "columnPk",
    label: "主键列"
  },
  {
    prop: "columnTypeName",
    label: "列类型"
  },
  {
    prop: "fieldName",
    label: "字段名"
  },
  {
    prop: "fieldType",
    label: "字段类型",
    width: "150px"
  },
  {
    prop: "required",
    label: "必填字段"
  },
  {
    prop: "showInList",
    label: "分页",
    isShow: toRef(dataInfo.value, "genPage")
  },
  {
    prop: "showInQuery",
    label: "查询",
    isShow: toRef(dataInfo.value, "genPage")
  },
  {
    prop: "queryType",
    label: "查询类型",
    width: "150px",
    isShow: toRef(dataInfo.value, "genPage")
  },
  {
    prop: "showInInfo",
    label: "信息",
    isShow: toRef(dataInfo.value, "genInfo")
  },
  {
    prop: "showInSave",
    label: "保存",
    isShow: toRef(dataInfo.value, "genSave")
  },
  {
    prop: "showInUpdate",
    label: "更新",
    isShow: toRef(dataInfo.value, "genUpdate")
  },
  {
    prop: "formType",
    label: "表单类型",
    isShow: toRef(dataInfo.value, "genSave")
  },
  {
    prop: "showInImport",
    label: "导入",
    isShow: toRef(dataInfo.value, "genImport")
  },
  {
    prop: "showInExport",
    label: "导出",
    isShow: toRef(dataInfo.value, "genExport")
  }
]);

// 可以下拉选择表名
const tableNameOptions = ref<string[]>([]);
// 下拉选择父类
const superClassOptions = ref<string[]>([]);
// 查询类型
const queryTypeOptions = ref<FieldNamesProps[]>([]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  if (params.row.id) {
    let { data } = await tableConfigInfo(params.row.id);
    dataInfo.value = Object.assign(dataInfo.value, data);
  } else {
    dataInfo.value = Object.assign(dataInfo.value, {
      id: null,
      tableName: null,
      comment: null,
      author: null,
      moduleName: null,
      packageName: null,
      superClass: null,
      tablePrefix: null,
      unprefix: null,
      genPage: false,
      genInfo: false,
      genSave: false,
      genUpdate: false,
      genDeleted: false,
      genImport: false,
      genExport: false,
      columnConfigList: []
    });
    // 新增需要获取可选表名
    let { data } = await getTableNameOptions();
    tableNameOptions.value = data;
  }
  if (!params.isView) {
    let { data } = await getSuperClassOptions();
    superClassOptions.value = data;

    let result = await getEnumDictItem("QueryType");
    queryTypeOptions.value = result.data;
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 改变表触发的事件
const changeTableName = async (tableName: string) => {
  let { data } = await loadTableInfo(tableName);
  dataInfo.value.tablePrefix = data.tablePrefix;
  dataInfo.value.comment = data.comment;
  if (data.tablePrefix && data.tablePrefix !== "") {
    dataInfo.value.unprefix = true;
    dataInfo.value.moduleName = data.tablePrefix;
  }
  // 设置列信息
  dataInfo.value.columnConfigList = [];
  for (let columnInfo of data.columnInfoList) {
    dataInfo.value.columnConfigList.push({
      id: null,
      enumDictType: null,
      ...columnInfo,
      showInList: false,
      showInQuery: false,
      queryType: null,
      showInInfo: false,
      showInSave: false,
      showInUpdate: false,
      formType: null,
      showInImport: false,
      showInExport: false
    });
  }
};

const enumDictTypeOptions = ref<EnumListResults[]>([]);

const focusEnumDictType = async (fieldType: string) => {
  let { data } = await getEnumList({ valueType: fieldType, standard: true });
  enumDictTypeOptions.value = data;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(dataInfo.value);
      ElMessage.success({ message: `${drawerProps.value.title} 成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.form-inline .el-input {
  --el-input-width: 220px;

  width: 220px;
}
.form-inline .el-select {
  --el-select-width: 220px;

  width: 220px;
}
</style>
