<template lang="pug">
.content
  .title 查詢預約
  CollapseCard(:bookingList="apiData")
</template>

<script lang="ts">
import { defineComponent, ref, computed  } from 'vue'
import { useApp, useSystem } from '@/store';
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
    /** Stepper */
    const finishedStep = ref(['01']);
    const lineProgressWidth = ref(0);
    const next = async(curStep: string) => {
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
      // let loading = showLoadingToast({
      //   message: '載入中...',
      //   forbidClick: true,
      //   duration: 0,
      // });
      // await onSubmit();
      // loading.close();
      // finishedStep.value.push(curStep);
      // lineProgressWidth.value += 100;
      // console.log(finishedStep.value, lineProgressWidth.value);
    }

    const stepperReset = () => {
      finishedStep.value = ['01'];
      lineProgressWidth.value = 0;

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
    const submitData = ref();
    
    const onSubmit = async() => {
      bookingParams.value.pickupAddress = bookingParams.value.pickupAddressCity + bookingParams.value.pickupAddressTown + bookingParams.value.pickupAddress;
      let params = {
        userLineId: profile._CLIENT_PROFILE_KEY as string,
        ...bookingParams.value
      }
      await postBooking(params)
      .then((res: any) => {
        submitData.value = res;
        console.log(res);
      })
      .finally(() => loadData());
    }

    //- 日期預設為今日日期
    let today = new Date().toJSON().split('T')[0];
    currentDate.value = today.split('-');
    loadData();

    return {
      finishedStep,
      lineProgressWidth,
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
      submitData,

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
    margin: 10px;
    .label {
      width: 30%;
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

.input-row{
  display: flex;
  gap: 8px;
}

.title{
  width: 100%;
  padding: 28px 0;
  color: #222;
  font-size: 20px;
  font-weight: 600;
  line-height: 18px;
}
</style>