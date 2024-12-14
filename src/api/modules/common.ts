import http from "@/api";

const baseUrl: string = "/common";

export interface ModuleInfo {
  moduleName: string;
}

/**
 * 获取所有模块信息
 */
export const getModulesInfo = () => {
  return http.get<ModuleInfo[]>(baseUrl + `/modules`, {}, { loading: false });
};
