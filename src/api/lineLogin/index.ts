import request from "@/api/request";

export const getToken = (params: any) =>
request(
  {
    url: `/token`,
    method: 'post',
    data: params
  },
  "LINELOGIN"
);

export const getProfile = () =>
request(
  {
    url: `/userinfo`,
    method: 'get',
  },
  "LINELOGIN"
);