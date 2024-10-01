import request from "@/api/request";
import { IUserId } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getHospitals = (params: IUserId) =>
request(
  {
    url: `/get-all-hospital?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);
