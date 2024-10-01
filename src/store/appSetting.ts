/** 應用程式資訊 */
import { defineStore } from 'pinia';

/** Config State */
interface ConfigState {
  _CLIENT_NAME: string,
  _CLIENT_ID: string,
  _CLIENT_SECRET: string,
  _CLIENT_ACCESS_TOKEN?: string,
  _CLIENT_PROFILE_NAME?: string,
  _CLIENT_PROFILE_PIC?: string,
  _CLIENT_PROFILE_KEY?: string,
}
export default defineStore(
    'appSetting', 
    {
        state: (): ConfigState => ({
          _CLIENT_NAME: 'EDcare',
          _CLIENT_ID: '2005160542',
          _CLIENT_SECRET: '894d84dee94831230c2ead3a3317f63a',
          _CLIENT_ACCESS_TOKEN: '',
          _CLIENT_PROFILE_NAME: '',
          _CLIENT_PROFILE_PIC: '',
          _CLIENT_PROFILE_KEY: '',
        }),
        getters: {
          GET_CLIENT_NAME: (state): string => state._CLIENT_NAME,
          GET_CLIENT_ID: (state): string => state._CLIENT_ID,
          GET_CLIENT_SECRET: (state): string => state._CLIENT_SECRET,
          GET_CLIENT_INFO:(state): ConfigState => {
            return{
              _CLIENT_NAME: state._CLIENT_NAME,
              _CLIENT_ID: state._CLIENT_ID,
              _CLIENT_SECRET: state._CLIENT_SECRET,
            }
          },
          GET_CLIENT_ACCESS_TOKEN: (state): string | undefined  => state._CLIENT_ACCESS_TOKEN,
          GET_CLIENT_PROFILE: (state): any  => {
            return{
              _CLIENT_PROFILE_NAME: state._CLIENT_PROFILE_NAME,
              _CLIENT_PROFILE_PIC: state._CLIENT_PROFILE_PIC,
              _CLIENT_PROFILE_KEY: state._CLIENT_PROFILE_KEY,
            }
          },
        },
        actions: {
          SET_CLIENT_ACCESS_TOKEN (data: string) {
            this._CLIENT_ACCESS_TOKEN = data;
          },
          SET_CLIENT_PROFILE (data: any) {
            this._CLIENT_PROFILE_NAME = data.name,
            this._CLIENT_PROFILE_PIC = data.picture,
            this._CLIENT_PROFILE_KEY = data.sub
          }
        },
        // Data persistence destination
        persist: {
          storage: localStorage,
          paths: [
            '_CLIENT_ACCESS_TOKEN',
            '_CLIENT_PROFILE_NAME',
            '_CLIENT_PROFILE_PIC',
            '_CLIENT_PROFILE_KEY'
          ]
        },
    }
)
