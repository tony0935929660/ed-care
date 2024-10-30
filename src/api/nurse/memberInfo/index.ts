import request from "@/api/request";
import { IUserId, INurseMemberInfo } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getNurseMemberInfo = (params: IUserId) =>
request(
  {
    url: `/caregiver-info?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const postNurseMemberInfo = (params: INurseMemberInfo) =>
request(
  {
    url: `/submit-caregiver`,
    method: 'post',
    data: params
  },
  "APIDATA"
);

//- 個人照片
export const getNurseMemberInfoImg = (params: IUserId) =>
request(
  {
    url: `/get-attendant-photos?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

//- 上傳個人照片
export const postNurseMemberInfoImg = (params: any) =>
request(
  {
    url: `/upload-attendant-photo`,
    method: 'post',
    data: params
  },
  "APIUPLOADFILE"
);