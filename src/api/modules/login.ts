import http from "@/api";

// 该模块的请求前缀
const baseUrl: string = "/sys/auth";

/**
 * @name 登录模块
 */
export interface ReqLoginForm {
  userName: string;
  password: string;
  uuid: string;
  captcha: string;
}
export interface ResLogin {
  isLogin: boolean;
  loginDevice: string;
  loginId: string;
  loginType: string;
  sessionTimeout: string;
  tag: string;
  tokenActiveTimeout: string;
  tokenName: string;
  tokenSessionTimeout: string;
  tokenTimeout: string;
  tokenValue: string;
}

// 用户登录
export const loginApi = (params: ReqLoginForm) => {
  return http.post<ResLogin>(baseUrl + `/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(`/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(`/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(`/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(`/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

export const captchaApi = (uuid: string) => {
  return http.get<any>(baseUrl + `/captcha`, { uuid: uuid }, { loading: true, responseType: "blob" });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(baseUrl + `/logout`);
};
