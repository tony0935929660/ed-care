import request from "@/api/request";
import { IUserId, IBookingHistory, IPay } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getBookingHistoryList = (params: IUserId) =>
request(
  {
    url: `/get-history-appointments?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const postBookingEvaluation = (params: IBookingHistory) =>
request(
  {
    url: `/submit-evaluation`,
    method: 'post',
    data: params
  },
  "APIDATA"
);

//- 付款
export const postBookingPay = (params: IPay) =>
request(
  {
    url: `/update-completed-paid`,
    method: 'post',
    data: params
  },
  "APIDATA"
);