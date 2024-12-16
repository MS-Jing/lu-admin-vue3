import http from "@/api";
import { EnumProps } from "@/components/ProTable/interface";

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
  menuType: number;
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  meta?: MetaInfoResult;
  sortCode?: number;
  moduleName?: string;
  children?: SysMenuInfoResult[];

  [key: string]: any;
}

export interface MetaInfoResult {
  icon?: string;
  title?: string;
  activeMenu?: string;
  link?: string;
  hide?: boolean;
  full?: boolean;
  affix?: boolean;
  keepAlive?: boolean;
}

/**
 * 系统菜单树 主要用于总览菜单管理
 */
export const getSysMenuTree = (menuType: number[] = [1, 2, 3]) => {
  return http.get<SysMenuInfoResult[]>(baseUrl + `/tree/` + menuType, {}, { loading: false });
};

export const getSysMenuInfo = (id: string | undefined) => {
  return http.get<SysMenuInfoResult>(baseUrl + `/info/` + id, {}, { loading: false });
};

export const MenuTypeProps: EnumProps[] = [
  {
    value: 1,
    label: "目录",
    tagType: "primary"
  },
  {
    value: 2,
    label: "菜单",
    tagType: "success"
  },
  {
    value: 3,
    label: "按钮",
    tagType: "info"
  }
];

export interface UpdateSysMenuParam {
  id?: string;
  parentId?: string;
  menuType: number;
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  icon?: string;
  title?: string;
  activeMenu?: string;
  link?: string;
  hide?: boolean;
  full?: boolean;
  affix?: boolean;
  keepAlive?: boolean;
  sortCode?: number;
  moduleName?: string;
}

export interface SaveSysMenuParam {
  id?: string;
  parentId?: string;
  menuType: number;
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  icon?: string;
  title?: string;
  activeMenu?: string;
  link?: string;
  hide?: boolean;
  full?: boolean;
  affix?: boolean;
  keepAlive?: boolean;
  sortCode?: number;
  moduleName?: string;
}

export const updateSysMenu = (param: UpdateSysMenuParam) => {
  return http.post(baseUrl + `/update`, param);
};

export const saveSysMenu = (param: SaveSysMenuParam) => {
  return http.post(baseUrl + `/save`, param);
};

export const deleteSysMenu = (id: string) => {
  return http.post(baseUrl + `/delete/` + id);
};
