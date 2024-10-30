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
    .card-action(v-if="item.doctorOrders && item.doctorOrders != '-1'")
      .alert.warning
        .notice.w-100
          .icon
            img(:src="doctor")
          .text
            b 醫生指示：{{ item.doctorOrders }}
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
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
      { label: '服務時數', key: 'serviceHours' },
      { label: '接送地址', key: 'pickupAddress' },
      { label: '確定陪診員', key: 'confirmationStatus' },
      { label: '預估金額', key: 'estimate' },
    ]);

    return { 
      order,
      detailItems,
      bookingList,
      doctor,
    };
  }
})
</script>

<style>
.text {
  word-break: break-all;
}
</style>