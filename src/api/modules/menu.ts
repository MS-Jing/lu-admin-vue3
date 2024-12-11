import http from "@/api";
import { Login } from "@/api/interface";

const baseUrl: string = "/sys/sys_menu";

export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(baseUrl + `/list`, {}, { loading: false });
};

export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(baseUrl + `/button/permission`, {}, { loading: false });
};
