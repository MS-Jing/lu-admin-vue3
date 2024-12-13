import http from "@/api";

const baseUrl: string = "/sys/sys_menu";

/**
 * 获取用户所有的菜单
 */
export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(baseUrl + `/list`, {}, { loading: false });
};

export interface ResAuthButtons {
  [key: string]: string[];
}

/**
 * 获取用户所有的按钮权限 ,key为页面路由的name,value为这个页面所有按钮的权限
 */
export const getAuthButtonListApi = () => {
  return http.get<ResAuthButtons>(baseUrl + `/button/permission`, {}, { loading: false });
};

export interface SysMenuInfoResult {
  id?: string;
  parentId?: string;
  menuType?: number;
  path: string;
  name: string;
  component?: string;
  redirect?: string;
  meta: MetaInfoResult;
  sortCode?: number | null;
  moduleName?: string;
  children?: SysMenuInfoResult[];
}

export interface MetaInfoResult {
  icon: string;
  title: string;
  activeMenu?: string;
  link?: string;
  hide: boolean;
  full: boolean;
  affix: boolean;
  keepAlive: boolean;
}

/**
 * 系统菜单树 主要用于总览菜单管理
 */
export const getSysMenuTree = () => {
  return http.get<SysMenuInfoResult[]>(baseUrl + `/tree`, {}, { loading: false });
};
