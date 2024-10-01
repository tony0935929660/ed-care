import request from "@/api/request";
import { IUserId } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getAllFamilyMember = (params: IUserId) =>
request(
  {
    url: `/get-all-members?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);
