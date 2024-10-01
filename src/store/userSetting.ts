/** 應用程式資訊 */
import { defineStore } from 'pinia';

/** Config State */
interface ConfigState {
  _ROLE: 0 | 1 | 2,
  _CATEGORY: Array<string>,
  _IS_REGISTER: Array<boolean>, 
  _ACCOUNT?: Array<IAccount>,
  _CUR_ACCOUNT?: IAccount
}
interface IAccount {
  accountName: string,
  isRegister: boolean
}
export default defineStore(
  'userSetting', 
  {
      state: (): ConfigState => ({
        _ROLE: 2,
        _CATEGORY: [],
        _IS_REGISTER: [],
        _ACCOUNT: [],
        _CUR_ACCOUNT: {
          accountName: '',
          isRegister: false
        }
      }),
      getters: {
        GET_USER: (state): ConfigState => {
          return {
            _ROLE: state._ROLE,
            _CATEGORY: state._CATEGORY,
            _IS_REGISTER: state._IS_REGISTER
          }
        },
        GET_ACCOUNT: (state): Array<IAccount> | undefined => state._ACCOUNT,
        GET_CUR_ACCOUNT: (state): IAccount | undefined => state._CUR_ACCOUNT,
      },
      actions: {
        SET_USER (data: any) {
          this._ROLE = data.role;
          this._CATEGORY = data.category;
          this._IS_REGISTER = data.categoryRegister;

          this._ACCOUNT = [];
          for(let i = 0; i < this._CATEGORY.length; i++) {
            this._ACCOUNT?.push({
              accountName: this._CATEGORY[i],
              isRegister: this._IS_REGISTER[i]
            })
          }
        },
        SET_CUR_ACCOUNT (data: any) {
          this._CUR_ACCOUNT = {
            accountName: data.accountName,
            isRegister: data.isRegister
          }
        }
      },
      persist: {
        storage: localStorage,
        paths: [
          '_ACCOUNT'
        ]
      },
  }
)
