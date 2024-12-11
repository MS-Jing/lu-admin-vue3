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
