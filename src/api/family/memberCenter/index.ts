import request from "@/api/request";
import { IUserId, IMember } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getMemberList = (params: IUserId) =>
request(
  {
    url: `/records?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const postMember = (params: IMember) =>
request(
  {
    url: `/submit-disease-status`,
    method: 'post',
    data: params
  },
  "APIDATA"
);