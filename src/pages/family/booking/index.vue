<template lang="pug">
.content
  Tab(:tabs="['新增預約', '查詢預約']")
    template(#tab-content1) 
      .stepper
        .stepper-bar
          ul
            li.step.step1(
              data-index="01"
              :class=`{
                'active': finishedStep.includes('01'), 
                'success': finishedStep.includes('01') && finishedStep[finishedStep.length - 1] != '01'
              }`
            ) 
              span 填寫資料
            li.step.step2(
              data-index="02" 
              :class=`{
                'active': finishedStep.includes('02'), 
                'success': finishedStep.includes('02') && finishedStep[finishedStep.length - 1] != '02'
              }`
            ) 
              span 填寫完成
            #line
              #line-progress(:style="{ 'width': lineProgressWidth + '%' }")
        .stepper-container
          .step-session(:class="{'active': finishedStep[finishedStep.length - 1] == '01'}")
            van-form
              .form
                Select(v-model="bookingParams.targetRealName" :title="'服務對象真實姓名'" :subtitle="'輸入服務對象真實姓名'" :columns="targetRealName" @click="curSelectKey = 'targetRealName'")
                Select(v-model="bookingParams.hospital" :title="'醫院'" :subtitle="'請選擇醫院'" :columns="hospital" @click="curSelectKey = 'hospital'")
                TextField(v-model="bookingParams.department" :title="'門診'" :subtitle="'輸入門診名稱'")
                TextField(v-model="bookingParams.departmentNumber" :title="'門診號碼'" :subtitle="'輸入門診號碼'")
                DatePicker(v-model="bookingParams.appointmentDate" :title="'預約日期'" :subtitle="'輸入預約日期'")
                TimePicker(v-model="bookingParams.appointmentTime" :title="'預約時間'" :subtitle="'輸入預約時間'")
                Select(v-model="bookingParams.serviceHours" :title="'服務時數'" :subtitle="'選擇服務時數'" :columns="serviceHours" @click="curSelectKey = 'serviceHours'")
                TextField(v-model="bookingParams.pickupAddress" :title="'接送地址'" :subtitle="'輸入接送地址'")
            .stepper-btn(@click.prevent="next('02')") 確認預約
          .step-session(:class="{'active': finishedStep[finishedStep.length - 1] == '02'}")
            .complete-container 
              img(:src="complete")
              .complete-text 
                p 預約完成
                p 立即查看預約資料!
              .return-text(@click.prevent="stepperReset()") 返回新增預約資料
                
    template(#tab-content2) 
      CollapseCard(:bookingList="apiData")
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
      let loading = showLoadingToast({
        message: '載入中...',
        forbidClick: true,
        duration: 0,
      });
      await onSubmit();
      loading.close();
      finishedStep.value.push(curStep);
      lineProgressWidth.value += 100;
      console.log(finishedStep.value, lineProgressWidth.value);
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

    // Date
    const isDatePickerShow = computed(() => systemStore.GET_IS_PICKER_DATE_SHOW);
    const currentDate = ref([]) as any;
    const onDateConfirm = (value: any) => {
      systemStore.SET_IS_PICKER_DATE_SHOW(false);
      bookingParams.value['appointmentDate'] = value.toLocaleDateString().split('/').join('-');
    }
    const dateFormatter = (day: any) => {
      let week = day.date.getDay();
      if(week == 0 || week == 6) {
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
    const onSubmit = async() => {
      let params = {
        userLineId: profile._CLIENT_PROFILE_KEY as string,
        ...bookingParams.value
      }
      await postBooking(params)
      .then((res: any) => {
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
  width: 270px;
  height: 270px;
  position: relative;
  margin: 54px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    position: absolute;
    bottom: -40px;
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
</style>