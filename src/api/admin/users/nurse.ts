import request from "@/api/request";
import { IUserId, IPostAdminConfirmNurse } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getAllNurse = (params: IUserId) =>
request(
  {
    url: `/get-all-caregivers?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const postNurseConfirm = (params: IPostAdminConfirmNurse) =>
request(
  {
    url: `/admin-update-attendant`,
    method: 'post',
    data: params
  },
  "APIDATA"
);