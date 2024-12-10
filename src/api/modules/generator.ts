// 该模块的请求前缀
import { ReqPage, ResPage } from "@/api/interface";
import http from "@/api";

const baseUrl: string = "/generator";

export interface GenPageParams extends ReqPage {
  tableName: string;
}

export interface GenPageResult {
  id: string;
  tableName: string;
  comment: string;
  updateTime: string;
}

export interface TableConfigSaveOrUpdateParams {
  id?: number;
  tableName?: string;
  comment?: string;
  author?: string;
  moduleName?: string;
  packageName?: string;
  superClass?: string;
  tablePrefix?: string;
  unprefix?: boolean;
  genPage: boolean;
  genInfo: boolean;
  genSave: boolean;
  genUpdate: boolean;
  genDeleted: boolean;
  genImport: boolean;
  genExport: boolean;
  columnConfigList?: ColumnConfigSaveOrUpdateParams[];
}

export interface ColumnConfigSaveOrUpdateParams {
  id: number | null;
  columnPk: boolean;
  columnName: string;
  columnTypeName: string;
  columnSize: number;
  columnDigit: number;
  fieldName: string;
  fieldType: string;
  enumDictType: string | null;
  comment: string;
  required: boolean;
  showInList: boolean;
  showInQuery: boolean;
  queryType: number | null;
  showInInfo: boolean;
  showInSave: boolean;
  showInUpdate: boolean;
  formType: number | null;
  showInImport: boolean;
  showInExport: boolean;
}

export interface TableInfo {
  tableName: string;
  tablePrefix: string;
  comment: string;
  columnInfoList: ColumnInfo[];
}

export interface ColumnInfo {
  columnPk: boolean;
  columnName: string;
  columnTypeName: string;
  columnSize: number;
  columnDigit: number;
  fieldName: string;
  fieldType: string;
  comment: string;
  required: boolean;
}

export const getTableConfigList = (params: GenPageParams) => {
  return http.get<ResPage<GenPageResult>>(baseUrl + `/pageQuery`, params);
};

export const tableConfigInfo = (id: string) => {
  return http.get<TableConfigSaveOrUpdateParams>(baseUrl + `/info/` + id);
};

export const saveOrUpdateTableConfig = (params: TableConfigSaveOrUpdateParams) => {
  return http.post(baseUrl + `/saveOrUpdate`, params);
};

export const deleteTableConfig = (params: string[]) => {
  return http.post(baseUrl + `/delete`, params);
};

export const getTableNameOptions = () => {
  return http.get<string[]>(baseUrl + `/enable/table`);
};

export const getSuperClassOptions = () => {
  return http.get<string[]>(baseUrl + `/optional/superClass`);
};

export const loadTableInfo = (tableName: string) => {
  return http.get<TableInfo>(baseUrl + `/load/table`, { tableName: tableName });
};

export interface PreviewResult {
  pathList: string[];
  fileName: string;
  content: string;
}

export const preview = (tableId: string | undefined) => {
  return http.get<PreviewResult[]>(baseUrl + `/preview`, { tableId: tableId });
};

export const generate = (tableId: string | undefined) => {
  return http.get<any>(baseUrl + `/generate`, { tableId: tableId }, { loading: true, responseType: "blob" });
};
