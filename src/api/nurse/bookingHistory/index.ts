import request from "@/api/request";
import { IUserId, IPostNurseBookingDoctorOrder } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getNurseBookingHistory = (params: IUserId) =>
request(
  {
    url: `/get-caregiver-history-orders?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

//- 更新醫生指示
export const postNurseBookingDoctorOrder = (params: IPostNurseBookingDoctorOrder) =>
request(
  {
    url: `/update-doctor-orders`,
    method: 'post',
    data: params
  },
  "APIDATA"
);
