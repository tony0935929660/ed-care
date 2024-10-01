import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
const {
    VITE_APIDATA_HOST , 
    VITE_LINELOGIN_HOST, 
} = import.meta.env;
import { TYPE_API } from '@/Interface/index';
import { useApp } from "@/store";
export function createService(type: TYPE_API){
    // 創建 axios 實例
    const service = axios.create({
        baseURL: (type === 'LINELOGIN')? VITE_LINELOGIN_HOST: VITE_APIDATA_HOST,
        // withCredentials: true, // 跨域是否攜帶 cookie
        timeout: 60000, // 請求超過設置
        headers: {
            "Content-Type": (type === 'APIDATA')? 'application/json': 'application/x-www-form-urlencoded',
            "ngrok-skip-browser-warning": "any"
        }
    });
    const appStore = useApp();
    // // HTTP request 攔截器
    service.interceptors.request.use(
        (config: AxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {

            // Token 設置
            const token = appStore.GET_CLIENT_ACCESS_TOKEN;

            if (token != "") {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                } as AxiosRequestHeaders; 
            }

            return config as InternalAxiosRequestConfig<any>;
        },
        (error: AxiosError<any>) => {
            console.error("Request Error:", error);
            return Promise.reject(error);
        }
    );
    // http Response 攔截器
    service.interceptors.response.use(
        (res: AxiosResponse) => {
            const data = res.data;
            return data;
        },
        (error: AxiosError) => {
            const { response } = error;
            let message = "";
            alert(error);
            if (response) {
                if(response.status >= 400) message = 'API發生錯誤';
            }else if (!window.navigator.onLine) {
                return Promise.reject(new Error('請檢查網路連線'));
            }
            return Promise.reject(message);
        }
    );
    return {service}
}
