import request from "@/api/request";
import { IUserId, IBooking, ICancelBooking, IPostSelectNurse } from "@/Interface";
import { convertToQueryString } from "@/common";

//- 預約列表
export const getBookingList = (params: IUserId) =>
request(
  {
    url: `/get-user-appointments?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

//- 新增預約
export const postBooking = (params: IBooking) =>
request(
  {
    url: `/submit-appointment`,
    method: 'post',
    data: params
  },
  "APIDATA"
);

//- 取消預約
export const postCancelBooking = (params: ICancelBooking) =>
request(
  {
    url: `/cancel-appointment`,
    method: 'post',
    data: params
  },
  "APIDATA"
);

//- 客戶會員清單 
export const getTargetList = (params: IUserId) =>
request(
  {
    url: `/get-client-name?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

//- 醫院清單
export const getHospitalList = () =>
request(
  {
    url: `/get-hospital-info`,
    method: 'get',
  },
  "APIDATA"
);

//- 選擇陪診員
export const postNurseSelect = (params: IPostSelectNurse) =>
request(
  {
    url: `/update-attendant-id`,
    method: 'post',
    data: params
  },
  "APIDATA"
);