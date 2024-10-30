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
    //- 已有陪診員排單
    .card-action(v-if="item.matchMakingCaregiver.length > 0 && item.schedule == '訂單媒合中'")
      .both-btn
        .left-btn(@click.prevent="selectNurse(item.orderId, item.matchMakingCaregiver)") 選擇陪診員
        .right-btn(@click.prevent="onCancelBooking(item.orderId)") 取消
    //- 媒合成功後
    .card-action(v-else-if="item.dateOfEstablishment && item.timeOfEstablishment")
      .alert
        .notice
          .icon
            svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none')
              path(d='M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C12.9993 7.71733 12.9033 7.48 12.712 7.288C12.5207 7.096 12.2833 7 12 7C11.7167 7 11.4793 7.096 11.288 7.288C11.0967 7.48 11.0007 7.71733 11 8C10.9993 8.28267 11.0953 8.52033 11.288 8.713C11.4807 8.90567 11.718 9.00133 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22Z' fill='#8C9D87')
          .text
            b 提醒 : {{ item.dateOfEstablishment }}
            br 
            b {{ addOneHour(item.timeOfEstablishment) }} 
            |前可免費取消，
            br 
            |否則將負擔額外費用
        .right-btn(@click.prevent="onCancelBooking(item.orderId)") 取消
    //- 媒合中
    .card-action(v-else)
      .submit-btn(@click.prevent="onCancelBooking(item.orderId)") 取消

van-popup.dialog(
  v-model:show="isDialogShow" 
  :style="{ width: '90%', height: '80%', padding: '24px 16px 0px' }" round
)
  .dialog-header
    .title 選擇陪診員
    van-icon(name='cross' color="#000" size="20px" @click.stop="close()")
  .dialog-content
    CollapseCardList(:list="curBookingNurse")
      template(#content="{ item }")
        .card-content 
          .card-img 
            img(:src="item.attHeadshot")
          .card-label 
            .subtitle 陪診員
            .title 
              .name {{ item.attName }}
      template(#right="{ item }")
        .right-icon 
          van-checkbox(
            v-model="item.isChecked"
            :name="item.attId"
            shape="square" 
            checked-color="#8C9D87"
            @click.stop="nurseOnSelect(item)"
          )
          van-icon(name="arrow-down" class="van-icon van-icon-arrow van-cell__right-icon")
  .dialog-footer 
    .submit-btn(@click.prevent.stop="onSubmitSelect()") 確定
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { showSuccessToast, showFailToast, showConfirmDialog, showLoadingToast } from "vant";
import { ICancelBooking, IPostSelectNurse, ISelectNurse } from '@/Interface';
import { postCancelBooking, postNurseSelect } from '@/api/family/booking';
import { useApp, useSystem } from '@/store';
import order from '@/assets/image/order.png';
import CollapseCard from "@/components/CollapseCard.vue";
import CollapseCardList from "@/components/CollapseCardList.vue";
import BookingStatus from '@/components/bookingStatus.vue';

export default defineComponent({
  components: {
    CollapseCard,
    CollapseCardList,
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
      { label: '服務時數', key: 'serviceHours' },
      { label: '接送地址', key: 'pickupAddress' },
      { label: '確定陪診員', key: 'confirmationStatus' },
      { label: '預估金額', key: 'estimate' },
    ]);

    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);
    const onCancelBooking = async(orderId: string) => {
      showConfirmDialog({
        title: '請確定是否要取消預約',
        message: '預約取消將視當前預約單狀態不同酌收費用，若該單尚未媒合成功可免費取消。',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      })
        .then(async() => {
          let loading = showLoadingToast({
            message: '加载中...',
            forbidClick: true,
            duration: 0,
          });
          let params: ICancelBooking = {
            userLineId: profile.value._CLIENT_PROFILE_KEY,
            orderId: orderId
          };
          await postCancelBooking(params)
          .then(() => {
            loading.close();
          })
          .finally(() => {
            showSuccessToast('完成認證');
            history.go(0);
          })
        })
        .catch(() => {
          //- 取消
        });
    }

    //- 免費取消時間上限
    const addOneHour = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      date.setHours(date.getHours() + 1);

      const newHours = String(date.getHours()).padStart(2, '0');
      const newMinutes = String(date.getMinutes()).padStart(2, '0');
      return `${newHours}:${newMinutes}`;
    }

    /** 選擇陪診員 */
    const systemStore = useSystem();
    const isDialogShow = computed(() => systemStore.GET_IS_DIALOG_SHOW);
    const curBookingNurse = ref([]) as any;
    const curOrderId = ref<string>('');
    const nurseSelected = ref<any>();

    const selectNurse = (orderId: string, nurse: ISelectNurse[]) => {
      curOrderId.value = orderId; 
      curBookingNurse.value = nurse.map(item => ({
        ...item,         
        isChecked: false 
      }));
      systemStore.SET_IS_DIALOG_SHOW(true);
    }
    const close = () => {
      systemStore.SET_IS_DIALOG_SHOW(false);
    }
    const nurseOnSelect = (item: any) => {
      nurseSelected.value = item;
      curBookingNurse.value.map((item: any) => item.isChecked = false);
      item.isChecked = true;
    }

    //- 確定提交
    const onSubmitSelect = () => {
      showConfirmDialog({
        title: '請確定是否提交',
        message: '提交後預約訂單即成立。',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      })
        .then(async() => {
          if(nurseSelected.value && curOrderId.value !== '') {
            console.log(nurseSelected.value);
            let loading = showLoadingToast({
              message: '加载中...',
              forbidClick: true,
              duration: 0,
            });
            let params: IPostSelectNurse = {
              userLineId: profile.value._CLIENT_PROFILE_KEY,
              orderId: curOrderId.value,
              attendantId: nurseSelected.value.attId
            };
            await postNurseSelect(params)
            .then(() => {
              loading.close();
            })
            .finally(() => {
              showSuccessToast('提交成功');
              history.go(0);
            })
          }
          else {
            showFailToast('請選擇陪診員');
          }
        })
        .catch(() => {
          //- 取消
        });
    }
    
    return { 
      order,
      detailItems,
      bookingList,
      onCancelBooking,
      addOneHour,

      isDialogShow,
      curBookingNurse,
      nurseSelected,
      selectNurse,
      close,
      nurseOnSelect,
      onSubmitSelect,
    };
  }
})
</script>

<style lang="scss" scoped>
.dialog{
  display: flex;
  flex-direction: column;
  gap: 24px;
  .dialog-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{
      width: 100%;
      color: #222;
      font-size: 20px;
      font-weight: 600;
      line-height: 18px; /* 90% */
    }
  }
  .dialog-content{
    height: 500px;
    overflow-y: scroll;
  }
  .dialog-footer{
    .submit-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 16px;
      border-radius: 100px;
      border: 1px solid #878787;
      background: #8C9D87;

      color: #FBFBFB;
      font-size: 14px;
      line-height: 140%; /* 19.6px */
      letter-spacing: 0.56px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
</style>