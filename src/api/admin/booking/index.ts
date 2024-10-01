import request from "@/api/request";
import { IUserId } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getAllBooking = (params: IUserId) =>
request(
  {
    url: `/get-all-orders?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);

export const getAllBookingHistory = (params: IUserId) =>
request(
  {
    url: `/get-all-history?${convertToQueryString(params)}`,
    method: 'get',
  },
  "APIDATA"
);
