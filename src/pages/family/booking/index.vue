<template lang="pug">
.content
  .title 新增預約
  van-form(v-if="!submitChecking")
    .form
      Select(v-model="bookingParams.targetRealName" :title="'服務對象真實姓名'" :subtitle="'輸入服務對象真實姓名'" :columns="targetRealName" @click="curSelectKey = 'targetRealName'")
      Select(v-model="bookingParams.hospital" :title="'醫院'" :subtitle="'請選擇醫院'" :columns="hospital" @click="curSelectKey = 'hospital'")
      TextField(v-model="bookingParams.department" :title="'門診'" :subtitle="'輸入門診名稱'")
      TextField(v-model="bookingParams.departmentNumber" :title="'門診號碼'" :subtitle="'輸入門診號碼'")
      TextField(v-model="bookingParams.clinicNumber" :title="'看診號碼'" :subtitle="'輸入看診號碼'")
      DatePicker(v-model="bookingParams.appointmentDate" :title="'預約日期'" :subtitle="'輸入預約日期'")
      TimePicker(v-model="bookingParams.appointmentTime" :title="'預約時間'" :subtitle="'輸入預約時間'")
      Select(v-model="bookingParams.serviceHours" :title="'服務時數'" :subtitle="'服務計費以實際服務時數為主'" :columns="serviceHours" @click="curSelectKey = 'serviceHours'")
      .input-row
        Select(v-model="bookingParams.pickupAddressCity" :title="'接送地址'" :subtitle="'輸入接送地址'" :columns="city" @click="curSelectKey = 'pickupAddressCity'")
        Select(v-model="bookingParams.pickupAddressTown" :columns="town" @click="curSelectKey = 'pickupAddressTown'")
      TextField(v-model="bookingParams.pickupAddress")
      .stepper-btn(@click.prevent="next('02')") 確認預約
  .complete-container(v-else)
    .complete-container__title 預約完成
    .complete-container__content
      //- .row
      //-   .label 預定編號:
      //-   .value {{ bookingParams.orderId }}
      .row
        .label 醫院:
        .value {{ bookingParams.hospital }}
      .row
        .label 科別:
        .value {{ bookingParams.department }}
      .row
        .label 門診號碼:
        .value {{ bookingParams.departmentNumber }}
      .row
        .label 預約號碼:
        .value {{ bookingParams.clinicNumber }}
      .row
        .label 日期:
        .value {{ bookingParams.appointmentDate }}
      .row
        .label 時間:
        .value {{ bookingParams.appointmentTime }}
      .row
        .label 服務時數:
        .value {{ bookingParams.serviceHours }}
      .row
        .label 接送地址:
        .value {{ bookingParams.pickupAddress }}
      //- .row
      //-   .label 預估金額:
      //-   .value {{ bookingParams.estimate }}
      .row
        .back-btn(@click.prevent="submitChecking = false") 返回
        .stepper-btn(@click.prevent="submit") 確認預約
      //- .return-text(@click.prevent="stepperReset()") 返回新增預約資料
  van-back-top(offset="100" bottom="12vh") 
  van-popup(v-model:show="isPickerShow" round position="bottom")
    van-picker(
      :columns="columns"
      cancel-button-text="取消"
      confirm-button-text="確認"
      @cancel="onCancel()"
      @confirm="onConfirm"
    )
  van-popup(v-model:show="isDatePickerShow" round position="bottom")
    van-calendar(
      v-model="currentDate"
      confirm-text="確認"
      title="選擇日期"
      @confirm="onDateConfirm"
      :poppable="false"
      :style="{ height: '500px' }"
      color="#8C9D87"
      :formatter="dateFormatter"
    )
  van-popup(v-model:show="isTimePickerShow" round position="bottom")
    van-time-picker(
      v-model="currentTime"
      cancel-button-text="取消"
      confirm-button-text="確認"
      title="選擇時間"
      :filter="timePickerFilter"
      @cancel="onTimeCancel()"
      @confirm="onTimeConfirm"
    )
</template>

<script lang="ts">
import { defineComponent, ref, computed  } from 'vue'
import { useApp, useSystem } from '@/store';
import { useRouter } from 'vue-router';
import { getTargetList, getBookingList, postBooking, getHospitalList } from '@/api/family/booking';
import { showLoadingToast, showToast } from 'vant';
import { ISysDropDown, IGetBooking, IGetHospital, IGetCliTarget } from '@/Interface';
import Tab from '@/components/tab.vue';
import TextField from '@/components/textField.vue';
import Select from '@/components/select.vue';
import DatePicker from '@/components/datePicker.vue';
import TimePicker from '@/components/timePicker.vue';
import Phone from '@/components/phone.vue';
import Checkbox from '@/components/checkbox.vue';
import CollapseCard from './components/collapseCard.vue';
import complete from '@/assets/image/complete.gif';
import axios from 'axios';

export default defineComponent({
  components: {
    Tab,
    TextField,
    Select,
    DatePicker,
    TimePicker,
    Phone,
    Checkbox,
    CollapseCard,
  },
  setup () {
    const router = useRouter();

    /** Stepper */
    const next = async() => {
      window.scrollTo(0,0);
      if(
        bookingParams.value.targetRealName == '' ||
        bookingParams.value.hospitalId == '' ||
        bookingParams.value.department == '' ||
        bookingParams.value.departmentNumber == '' ||
        bookingParams.value.appointmentDate == '' ||
        bookingParams.value.appointmentTime == '' ||
        bookingParams.value.serviceHours == '' ||
        bookingParams.value.pickupAddress == ''
      ) {
        showToast('尚有欄位未填寫完整');
        return ;
      }
      await onSubmit();
    }

    const stepperReset = () => {
      //- Reset
      bookingParams.value = {
        targetRealName: '',
        hospitalId: '',
        department: '',
        departmentNumber: '',
        appointmentDate: '',
        appointmentTime: '',
        serviceHours: '',
        pickupAddress: '',
        pickupAddressCity: '',
        pickupAddressTown: '',
      };
    }

    /** Data Options */
    const targetRealName = ref<ISysDropDown []>([]);
    const hospital = ref<ISysDropDown []>([]);
    const city = ref([
      { text: '雲林縣', value: '雲林縣' }
    ]);
    const town = ref([
      { text: '斗六市', value: '斗六市' },
      { text: '斗南鎮', value: '斗南鎮' },
      { text: '虎尾鎮', value: '虎尾鎮' }
    ]);

    // Date
    const isDatePickerShow = computed(() => systemStore.GET_IS_PICKER_DATE_SHOW);
    const currentDate = ref([]) as any;
    const onDateConfirm = (value: any) => {
      systemStore.SET_IS_PICKER_DATE_SHOW(false);
      bookingParams.value['appointmentDate'] = value.toLocaleDateString().split('/').join('-');
    }
    const dateFormatter = (day: any) => {
      let week = day.date.getDay();

      let today = new Date();
      let threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 2);

      if(week == 0 || week == 6) {
        day.type = 'disabled';
      }

      if(day.date < threeDaysLater) {
        day.type = 'disabled';
      }
      return day;
    }

    // Time
    const currentTime = ref([]) as any;
    const isTimePickerShow = computed(() => systemStore.GET_IS_PICKER_TIME_SHOW);
    const onTimeCancel = () => {
      systemStore.SET_IS_PICKER_TIME_SHOW(false);
    }
    const onTimeConfirm = ({ selectedOptions }: any) => {
      systemStore.SET_IS_PICKER_TIME_SHOW(false);
      console.log(selectedOptions);
      bookingParams.value['appointmentTime'] = selectedOptions.map((item: ISysDropDown) => item.text).join(':');
    }
    const timePickerFilter = (type: string, options: any) => {
      if (type === 'hour') {
        let midNightList = [0, 1, 2, 3, 4, 5, 6];
        return options.filter((option: any) => !midNightList.includes(Number(option.value)));
      }
      if (type === 'minute') {
        return options.filter((option: any) => Number(option.value) % 15 === 0);
      }
      return options;
    };


    const serviceHours = ref([
      { text: '2小時', value: '2小時' },
      { text: '3小時', value: '3小時' },
      { text: '4小時', value: '4小時' },
      { text: '5小時', value: '5小時' },
    ]);

    /** Data Params */
    const bookingParams = ref({
      targetRealName: '',
      hospitalId: '',
      department: '',
      departmentNumber: '',
      appointmentDate: '',
      appointmentTime: '',
      serviceHours: '',
      pickupAddress: '',
      pickupAddressCity: '',
      pickupAddressTown: '',
    });

    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);
    const columns = computed(() => systemStore.GET_PICKER_COLUMNS);
    const curSelectKey = ref();
    const onCancel = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
    }
    const onConfirm = ({ selectedOptions }: any) => {
      systemStore.SET_IS_PICKER_SHOW(false);
      console.log(selectedOptions[0].text, curSelectKey.value);
      bookingParams.value[curSelectKey.value as keyof Object] = selectedOptions[0].text;
      
      //- 醫院下拉選單
      if(curSelectKey.value == 'hospital'){
        bookingParams.value['hospitalId'] = selectedOptions[0].value;
      }
    };

    /** Booking List Data And Preload DropDown List */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const apiData = ref<IGetBooking[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await axios.all([
        getBookingList({userLineId: profile._CLIENT_PROFILE_KEY}),
        getTargetList({userLineId: profile._CLIENT_PROFILE_KEY}),
        getHospitalList(),
      ])
      .then(axios.spread((bookingList: IGetBooking[], targetList: IGetCliTarget[], hospitalList: any) => {
        apiData.value = [...bookingList.reverse()];
        console.log(targetList)
        targetRealName.value = targetList.map((item: IGetCliTarget) => {
          return {
            text: item.cliTargetRealName,
            value: item.cliId
          }
        });
        hospital.value = hospitalList.map((item: IGetHospital) => {
          return {
            text: item.hospital,
            value: item.hospitalId
          }
        });
      }))
      loading.close();
    }

    /** Submit Member */
    const submitChecking = ref(false);
    const onSubmit = () => {
      bookingParams.value.pickupAddress = bookingParams.value.pickupAddressCity + bookingParams.value.pickupAddressTown + bookingParams.value.pickupAddress;
      submitChecking.value = true;
    };
    const submit = async() => {
      let loading = showLoadingToast({
        message: '載入中...',
        forbidClick: true,
        duration: 0,
      });
      await onSubmit();
      let params = {
        userLineId: profile._CLIENT_PROFILE_KEY as string,
        ...bookingParams.value
      }
      await postBooking(params)
      .then((res: any) => {
        loading.close();
        console.log(res);
        router.back();
      })
      .finally(() => loadData());
    }

    //- 日期預設為今日日期
    let today = new Date().toJSON().split('T')[0];
    currentDate.value = today.split('-');
    loadData();

    return {
      complete,
      targetRealName,
      hospital,
      city,
      town,
      serviceHours,
      bookingParams,
      next,
      stepperReset,

      isPickerShow,
      columns,
      curSelectKey,
      onCancel,
      onConfirm,

      apiData,
      onSubmit,
      submit,
      submitChecking,

      isDatePickerShow,
      currentDate,
      onDateConfirm,
      dateFormatter,

      isTimePickerShow,
      currentTime,
      onTimeCancel,
      onTimeConfirm,
      timePickerFilter,
    };
  }
})
</script>

<style lang="scss" scoped>
.stepper{
  overflow-x: hidden;
  width: 100%;
  margin: 8px auto 0px;
  .stepper-bar {
    width: calc(100% - 40px);
    height: 68px;
    position: relative;
    padding: 0px 20px;
    ul {
        width: calc(100% - 40px);
        height: 38px;
        position: absolute;
        z-index: 999;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        li {
            position: relative;
            z-index: 2;
            list-style: none;
            color: #aaa;
            transition: all ease 0.2s;
            cursor: pointer;
            &::before {
                width: 32px;
                height: 32px;
                content: attr(data-index);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                background-color: #fff;
                background-image: none;
                border: 3px solid #E4E4E6;
                transition: all ease 0.3s;

                /* content font */
                color: #000000;
                text-align: center;
                font-size: 13px;
                font-weight: 500;
            }
            &.active::before {
                width: 38px;
                height: 38px;
                background-color: #fff;
                background-image: none;
                border: 3px solid #8C9D87;
                /* content font */
                color: #8C9D87;
            }
            &.success::before {
              content: ' ';
              background-color: none;
              background-image: url('../../../assets/image/success.png');
              background-size: cover;
              border: none;
            }
            span {
              width: 100px;
              text-align: center;
              position: absolute;
              top: 48px;
              left: -31px;
              color: #222;
              text-align: center;
              font-size: 13px;
              font-weight: 600;
            }
            &.active span {
              color: #8C9D87;
            }
        }
        #line {
          width: calc(100% - 40px);
          height: 3px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          background-color: #E4E4E6;
          border-radius: 50px;
          transition: all ease 0.75s;
          #line-progress {
              content: " ";
              height: 100%;
              background-color: #8C9D87;
              position: absolute;
              z-index: 2;
              transition: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.25);
          }
        }
    }
  }

  .stepper-container{
    padding: 0;
    margin: 0;
    width: 100%;
    min-height: 200px;
    .step-session {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      display: none;
      animation: FadeInUp 0.7s ease 1 forwards;
      transform: translateX(100px);
      opacity: 0;

      &.active {
        display: block;
        opacity: 1;
      }
    }
  }
}

@keyframes FadeInUp {
    0% {
        transform: translateX(100px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
}

.complete-container{
  width: 300px;
  position: relative;
  margin: 54px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  color: #8C9D87;
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    .label {
      width: 30%;
      white-space: nowrap;
    }
  }
  img {
    width: 250px;
    height: 250px;
  }
  .complete-text  {
    position: absolute;
    bottom: -5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    p {
      margin: 0;
      color: #222;
      font-size: 20px;
      font-weight: 510;
      line-height: 18px;
    }
  }
  .return-text{
    display: flex;
    justify-content: center;
    color: #8C9D87;
    font-size: 16px;
    font-weight: 400;
    text-decoration-line: underline;
    line-height: 18px;
    &:hover{
      cursor: pointer;
      color: #1c7b8a;
    }
  }
}
.form{
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.stepper-btn{
  width: calc(100% - 32px);
  padding: 12px 16px;
  margin-bottom: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: #8C9D87;
  color: #FFF;
  font-size: 14px;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: 0.56px;
}
.back-btn{
  width: calc(100% - 32px);
  padding: 12px 16px;
  margin-bottom: 42px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: #a3a2a7;
  color: #FFF;
  font-size: 14px;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: 0.56px;
}

.input-row{
  display: flex;
  gap: 8px;
}

.title{
  width: 100%;
  padding-top: 28px;
  color: #222;
  font-size: 20px;
  font-weight: 600;
  line-height: 18px;
}
</style>