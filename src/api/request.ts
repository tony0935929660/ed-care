import { useApp } from "@/store";
import { createService } from "./index";
import { TYPE_API, IAxiosConfig, IApiResult } from '@/Interface/index';
const request = async <T>(axiosConfig: IAxiosConfig<T>, type: TYPE_API): Promise<IApiResult<T>> => {
    const {service} = await createService(type);
    return new Promise<IApiResult<T>>((resolve, reject) => {
        service(axiosConfig)
        .then((response: any) => {
            resolve(response);
        })
        .catch(async(error) => {
            const appStore = useApp();
            //- Reset Pinia
            appStore.$reset();
            //- Application clear
            localStorage.clear();
            //- 轉導
            window.location.replace('login');
            reject(error);
        });
    });
};
export default request;

