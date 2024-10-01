<template lang="pug">
CollapseCard(
  :list="historyList" 
  :detailItems="detailItems"
)
  template(#content="{ item }")
    .card-content 
      .card-img 
        img(:src="order")
      .card-label 
        .subtitle 預約者姓名
        .title 
          .name {{ item.targetRealName }}
  template(#right="{ item }")
    .right-icon 
      BookingStatus(:schedule="item.schedule")
      van-icon(name="arrow-down" class="van-icon van-icon-arrow van-cell__right-icon")
  template(#pickupAddress="{ item }")
    .label 接送地址
    a.value(
      v-if="item"
      :href="'https://www.google.com/maps/search/?api=1&query=' + item" target="_blank"
    ) 
      span {{ item }}
      van-icon(name="location")
    .value(v-else) - -
  template(#action="{ item }")
    .card-action(v-if="item.doctorOrders !== '-1'")
      .alert.warning
        .notice.w-100
          .icon
            img(:src="doctor")
          .text
            b 醫生指示： 
            span {{ item.doctorOrders }}
    .card-action(v-if="item.schedule == '訂單完成已付款' && (item.attendantScore < 0 || item.attendantScore == '') ")
      .alert
        .notice
          .icon
            svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none')
              path(d='M21.9646 10.7671L17.7459 14.4074L19.0312 19.8515C19.1021 20.147 19.0838 20.4569 18.9787 20.7421C18.8736 21.0272 18.6863 21.2748 18.4405 21.4536C18.1947 21.6324 17.9015 21.7343 17.5978 21.7465C17.2941 21.7587 16.9936 21.6806 16.7343 21.5221L11.9999 18.6083L7.26275 21.5221C7.00347 21.6797 6.70335 21.757 6.4002 21.7444C6.09704 21.7318 5.8044 21.6297 5.55913 21.4511C5.31386 21.2725 5.12692 21.0253 5.02185 20.7406C4.91679 20.456 4.89829 20.1466 4.96869 19.8515L6.25869 14.4074L2.03994 10.7671C1.81053 10.5688 1.64462 10.3074 1.56293 10.0154C1.48123 9.72336 1.48737 9.41376 1.58058 9.12522C1.67379 8.83669 1.84994 8.58201 2.08703 8.39299C2.32412 8.20397 2.61164 8.08899 2.91369 8.06241L8.44494 7.61616L10.5787 2.45241C10.6942 2.17099 10.8908 1.93027 11.1434 1.76085C11.3961 1.59143 11.6934 1.50098 11.9976 1.50098C12.3018 1.50098 12.5991 1.59143 12.8518 1.76085C13.1044 1.93027 13.301 2.17099 13.4165 2.45241L15.5493 7.61616L21.0806 8.06241C21.3832 8.088 21.6716 8.20234 21.9095 8.3911C22.1475 8.57986 22.3244 8.83464 22.4182 9.12352C22.512 9.41241 22.5185 9.72254 22.4368 10.0151C22.3551 10.3076 22.1889 10.5695 21.959 10.768L21.9646 10.7671Z' fill='#F4C78C')
          .text
            |您寶貴的意見
            br 
            |是我們進步的動力！
        .right-btn(@click.prevent.stop="onPicker(item)") 評價
    .card-action(v-if="item.schedule == '訂單完成未付款' || item.schedule == '訂單已取消需付款'")
      .alert
        .notice.w-100
          .icon
            svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none')
              path(d='M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C12.9993 7.71733 12.9033 7.48 12.712 7.288C12.5207 7.096 12.2833 7 12 7C11.7167 7 11.4793 7.096 11.288 7.288C11.0967 7.48 11.0007 7.71733 11 8C10.9993 8.28267 11.0953 8.52033 11.288 8.713C11.4807 8.90567 11.718 9.00133 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22Z' fill='#8C9D87')
          .text
            b 提醒：預約已結束，
            br
            b 請前往付款 {{ item.sum }}元
        .right-btn(@click.prevent.stop="onPay(item.orderId)") 付款

van-popup(v-model:show="isPickerShow" round position="bottom")
  .evaluate-card 
    .header
      .title 是否滿意這次的預約呢?
      .subtitle 留下你的評價並讓我們知道您的想法
    .attendantScore
      van-rate(
        v-model="evaluateData.attendantScore"
        :size="40"
        color="#F4C78C"
        void-icon="star"
        void-color="#eee"
      )
    .evaluate-textField
      .label 
        .text 其他評論
        .counter {{ evaluateData.evaluate.length }}/50
      .input 
        van-field(
          v-model="evaluateData.evaluate"
          type="textarea" rows="2"
          autosize
          maxlength="50"
          placeholder="請填寫本次預約的評價"
        )
    .actions 
      .msg 按下確認送出，讓我們更有進步的動力！
      .submit-btn(@click.stop="onConfirm()") 確認送出
      .cancel-btn(@click.stop="onCancel()") 取消

</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { ICancelBooking, IBookingHistory, IGetBookingHistory } from '@/Interface';
import { postCancelBooking } from '@/api/family/booking';
import { postBookingEvaluation, postBookingPay } from '@/api/family/bookingHistory';
import { useApp, useSystem } from '@/store';
import { showLoadingToast, showToast, showConfirmDialog } from 'vant';
import order from '@/assets/image/order.png';
import doctor from '@/assets/image/doctor.png';
import CollapseCard from "@/components/CollapseCard.vue";
import BookingStatus from '@/components/bookingStatus.vue';

export default defineComponent({
  components: {
    CollapseCard,
    BookingStatus,
  },
  props: ['historyList'],
  setup (props) {
    const historyList = computed(() => props.historyList);
    /** Card Data */
    const detailItems = ref([
      { label: '預定編號', key: 'orderId' },
      { label: '醫院', key: 'hospital' },
      { label: '科別', key: 'department' },
      { label: '門診號碼', key: 'departmentNumber' },
      { label: '日期', key: 'appointmentDate' },
      { label: '時間', key: 'appointmentTime' },
      { label: '服務時數', key: 'serviceHours' },
      { label: '接送地址', key: 'pickupAddress' },
      { label: '確定陪診員', key: 'confirmationStatus' },
      { label: '預估金額', key: 'sum' },
    ]);

    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);
    /** Cancel */
    const onCancelBooking = async(orderId: string) => {
      let params: ICancelBooking = {
        userLineId: profile.value._CLIENT_PROFILE_KEY,
        orderId: orderId
      };
      await postCancelBooking(params)
      .then((res: any) => {
        console.log(res);
      })
      .finally(() => history.go(0));
    }
    
    /** Open Evaluate Panel */
    const onPicker = (order: IGetBookingHistory) => {
      systemStore.SET_IS_PICKER_SHOW(true);
      evaluateData.value.orderId = order.orderId;
    }

    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);
    const onCancel = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
      evaluateData.value.orderId = '';
      evaluateData.value.attendantScore = 0;
      evaluateData.value.evaluate = '';
    }
    const onConfirm = async() => {
      if(evaluateData.value.attendantScore < 1){
        showToast('尚未評分');
      }
      else{
        systemStore.SET_IS_PICKER_SHOW(false);
        let loading = showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
        await postBookingEvaluation(evaluateData.value)
        .then(() => {
          showToast('已收到您的評價，感謝您！');
        })
        .finally(() => {
          history.go(0);
        })
        loading.close();
      }
    };

    /** Evaluate Params */
    const evaluateData = ref<IBookingHistory>({
      userLineId: profile.value._CLIENT_PROFILE_KEY,
      orderId: '',
      attendantScore: 0,
      evaluate: '',
    });

    //- 付款
    const onPay = async(orderId: string) => {
      showConfirmDialog({
        title: '請確定是否前往付款',
        message: '提醒：即將跳轉頁面至付款畫面。',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      })
        .then(async() => {
          let loading = showLoadingToast({
            message: '加载中...',
            forbidClick: true,
            duration: 0,
          });
          await postBookingPay({orderId: orderId})
          .then(() => {
            showToast('付款成功！');
          })
          .finally(() => {
            history.go(0);
          })
          loading.close();
        })
        .catch(() => {
          //- 取消
        });
    }

    return { 
      order,
      doctor,
      detailItems,
      historyList,
      onCancelBooking,
      onPicker,

      isPickerShow,
      onCancel,
      onConfirm,

      evaluateData,

      onPay,
    };
  }
})
</script>

<style lang="scss" scoped>
.evaluate-card{
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .header{
    text-align: center;
    .title{
      color: #222;
      font-size: 18px;
      font-weight: 700;
      line-height: 140%; /* 25.2px */
      margin-bottom: 9px;
    }
    .subtitle{
      color: #6D6D6D;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 160%; /* 22.4px */
    }
  }
  .attendantScore{
    display: flex;
    justify-content: center;
  }
  .evaluate-textField{
    width: 100%;
    .label{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      .text{
        color: #222;
        font-size: 12px;
        font-weight: 700;
        line-height: 160%; /* 19.2px */
      }
      .counter{
        color: #6D6D6D;
        font-size: 12px;
        font-weight: 400;
        line-height: 160%; /* 19.2px */
      }
    }
    .input{
      height: 100px;
      border-radius: 4px;
      border: 1px solid #E4E4E6;
      background: #FFF;
    }
  }
  .actions{
    display: flex;
    flex-direction: column;
    gap: 8px;
    .msg{
      color: #222;
      font-size: 12px;
      font-weight: 400;
      line-height: 160%; /* 19.2px */
    }
    .submit-btn{
      height: 24px;
      padding: 12px 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      background: #8C9D87;
      color: #FFF;
      font-size: 14px;
      font-weight: 700;
      line-height: 160%; /* 22.4px */
    }
    .cancel-btn{
      display: flex;
      height: 24px;
      padding: 12px 24px;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>