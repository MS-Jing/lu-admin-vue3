import { ReqPage, ResPage } from "@/api/interface";
import http from "@/api";

const baseUrl: string = "/sys/sys_role";

export interface RolePageParam extends ReqPage {
  roleName?: string;
}

export interface SysRolePageResult {
  id: string;
  roleCode: string;
  roleName: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

export const getRolePage = (param: RolePageParam) => {
  return http.get<ResPage<SysRolePageResult>>(baseUrl + `/page`, param);
};

export interface SysRoleInfoResult {
  id: string;
  roleCode: string;
  roleName: string;
  menuIdList: string[];
  remark: string;
}

export const getRoleInfo = (id: string) => {
  return http.get<SysRoleInfoResult>(baseUrl + `/info/` + id);
};

export interface SysRoleSaveParam {
  roleCode: string;
  roleName: string;
  menuIdList: string[];
  remark?: string;
}

export const saveRole = (param: SysRoleSaveParam) => {
  return http.post(baseUrl + `/save`, param);
};

export interface SysRoleUpdateParam {
  id: string;
  roleCode: string;
  roleName: string;
  menuIdList: string[];
  remark?: string;
}

export const updateRole = (param: SysRoleUpdateParam) => {
  return http.post(baseUrl + `/update`, param);
};
