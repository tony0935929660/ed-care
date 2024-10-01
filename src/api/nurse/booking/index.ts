import request from "@/api/request";
import { IUserId, IPostNurseBookingEmpty } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getNurseBooking = (params: IUserId) =>
request(
  {
    url: `/get-appointments?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const getNurseBookingConfirmed = (params: IUserId) =>
request(
  {
    url: `/get-confirmed-appointments?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

//- 接取空預約
export const postNurseBookingEmpty = (params: IPostNurseBookingEmpty) =>
request(
  {
    url: `/confirm-appointment`,
    method: 'post',
    data: params
  },
  "APIDATA"
);

//- 預約開始
export const postNurseBookingStart = (params: IPostNurseBookingEmpty) =>
request(
  {
    url: `/start-appointment`,
    method: 'post',
    data: params
  },
  "APIDATA"
);
  
//- 預約結束
export const postNurseBookingEnd = (params: IPostNurseBookingEmpty) =>
request(
  {
    url: `/end-appointment`,
    method: 'post',
    data: params
  },
  "APIDATA"
);