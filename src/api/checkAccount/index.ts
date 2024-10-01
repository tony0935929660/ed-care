import request from "@/api/request";
import { IUserId } from "@/Interface";
import { convertToQueryString } from "@/common";

export const getLogin = (params: IUserId) =>
request(
  {
    url: `/login?${convertToQueryString(params)}`,
    method: 'get',
  },
  "LINELOGIN"
);
