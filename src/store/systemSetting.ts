/** 應用程式資訊 */
import { defineStore } from 'pinia';

/** Config State */
interface ConfigState {
  _IS_PICKER_SHOW: boolean,
  _PICKER_COLUMNS: Array<string>,
  _IS_PICKER_DATE_SHOW: boolean,
  _IS_PICKER_TIME_SHOW: boolean,
  _IS_DIALOG_SHOW: boolean,
}
export default defineStore(
  'systemSetting', 
  {
      state: (): ConfigState => ({
        _IS_PICKER_SHOW: false,
        _PICKER_COLUMNS: [],
        _IS_PICKER_DATE_SHOW: false,
        _IS_PICKER_TIME_SHOW: false,
        _IS_DIALOG_SHOW: false,
      }),
      getters: {
        GET_IS_PICKER_SHOW: (state): boolean => state._IS_PICKER_SHOW,
        GET_PICKER_COLUMNS: (state): Array<string> => state._PICKER_COLUMNS,
        GET_IS_PICKER_DATE_SHOW: (state): boolean => state._IS_PICKER_DATE_SHOW,
        GET_IS_PICKER_TIME_SHOW: (state): boolean => state._IS_PICKER_TIME_SHOW,
        GET_IS_DIALOG_SHOW: (state): boolean => state._IS_DIALOG_SHOW,
      },
      actions: {
        SET_IS_PICKER_SHOW (data: boolean) {
          this._IS_PICKER_SHOW = data;
        },
        SET_PICKER_COLUMNS (data: Array<string>) {
          this._PICKER_COLUMNS = data;
        },
        SET_IS_PICKER_DATE_SHOW (data: boolean) {
          this._IS_PICKER_DATE_SHOW = data;
        },
        SET_IS_PICKER_TIME_SHOW (data: boolean) {
          this._IS_PICKER_TIME_SHOW = data;
        },
        SET_IS_DIALOG_SHOW (data: boolean) {
          this._IS_DIALOG_SHOW = data;
        },
      },
  }
)
