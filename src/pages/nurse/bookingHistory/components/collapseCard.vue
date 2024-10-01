<template lang="pug">
CollapseCard(
  :list="bookingList" 
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
    .card-action(v-if="item.doctorOrders")
      .alert.warning
        .notice.w-100
          .icon
            img(:src="doctor")
          .text
            b 醫生指示：{{ item.doctorOrders }}
    .card-action
      .alert
        .notice
          .icon
            svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none')
              path(d='M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C12.9993 7.71733 12.9033 7.48 12.712 7.288C12.5207 7.096 12.2833 7 12 7C11.7167 7 11.4793 7.096 11.288 7.288C11.0967 7.48 11.0007 7.71733 11 8C10.9993 8.28267 11.0953 8.52033 11.288 8.713C11.4807 8.90567 11.718 9.00133 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22Z' fill='#8C9D87')
          .text
            b 提醒 : 請協助填寫或更新醫生指示
        .right-btn(@click.stop="onPicker(item)") 填寫

van-popup(v-model:show="isPickerShow" round position="bottom")
  .evaluate-card 
    .header
      .title 填寫醫生指示
      .subtitle 請協助預約者填寫醫生指示
    .evaluate-textField
      .label 
        .text 醫生指示
        .counter {{ doctorOrders.length }}/50
      .input 
        van-field(
          v-model="doctorOrders"
          type="textarea" rows="2"
          autosize
          maxlength="50"
          placeholder="請填寫本次預約醫生指示"
        )
    .actions 
      .msg 按下確認送出，預約者將收到醫生指示！
      .submit-btn(@click.stop="onConfirm()") 確認送出
      .cancel-btn(@click.stop="onCancel()") 取消

</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useApp, useSystem } from '@/store';
import { postNurseBookingDoctorOrder } from "@/api/nurse/bookingHistory";
import { showLoadingToast, showToast } from 'vant';
import { IPostNurseBookingDoctorOrder  } from "@/Interface";
import order from '@/assets/image/order.png';
import doctor from '@/assets/image/doctor.png';
import CollapseCard from "@/components/CollapseCard.vue";
import BookingStatus from '@/components/bookingStatus.vue';

export default defineComponent({
  components: {
    CollapseCard,
    BookingStatus,
  },
  props: ['bookingList'],
  setup (props) {
    const bookingList = computed(() => props.bookingList);
    
    const detailItems = ref([
      { label: '預定編號', key: 'orderId' },
      { label: '醫院', key: 'hospital' },
      { label: '科別', key: 'department' },
      { label: '門診號碼', key: 'departmentNumber' },
      { label: '日期', key: 'appointmentDate' },
      { label: '時間', key: 'appointmentTime' },
      { label: '計程車公司', key: 'carCompanyName' },
      { label: '陪診費用', key: 'attendantFee' },
    ]);

    const curBooking = ref();
    const doctorOrders = ref<string>('');
    const onPicker = (item: any) => {
      systemStore.SET_IS_PICKER_SHOW(true);
      curBooking.value = item;
    }
    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);
    const onCancel = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
    }
    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);
    const onConfirm = async() => {
      if(!doctorOrders.value){
        showToast('尚未填寫');
      }
      else{
        systemStore.SET_IS_PICKER_SHOW(false);
        let loading = showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
        let params:IPostNurseBookingDoctorOrder = {
          userLineId: profile.value._CLIENT_PROFILE_KEY,
          orderId: curBooking.value.orderId,
          doctorOrders: doctorOrders.value
        }
        await postNurseBookingDoctorOrder(params)
        .then(() => {
          showToast('填寫完成');
        })
        .finally(() => {
          history.go(0);
        })
        loading.close();
      }
    }

    return { 
      order,
      doctor,
      detailItems,
      bookingList,
      doctorOrders,

      isPickerShow,
      onCancel,
      onConfirm,
      onPicker,
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