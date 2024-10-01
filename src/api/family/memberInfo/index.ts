import request from "@/api/request";
import { IUserId, IMemberInfo } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getMemberInfo = (params: IUserId) =>
request(
  {
    url: `/get-member-info?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const postMemberInfo = (params: IMemberInfo) =>
request(
  {
    url: `/register-customer`,
    method: 'post',
    data: params
  },
  "APIDATA"
);