import http from "@/api";
import { FieldNamesProps } from "@/components/ProTable/interface";

const baseUrl: string = "/dict";

export const getEnumDictItem = (name: string) => {
  return http.get<FieldNamesProps[]>(baseUrl + `/enum/item`, { name: name });
};

export interface EnumListParams {
  name?: string;
  standard: boolean;
  valueType: string;
}

export interface EnumListResults {
  name: string;
  description: string;
  standard: boolean;
  valueType: string;
}

export const getEnumList = (params: EnumListParams) => {
  return http.get<EnumListResults[]>(baseUrl + `/enum/list`, params);
};
