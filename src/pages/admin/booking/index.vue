<template lang="pug">
.content
  Tab(:tabs="['進行中預約', '歷史預約']")
    template(#tab-content1) 
      CollapseCard(:bookingList="booking")
    template(#tab-content2) 
      CollapseCard(:bookingList="bookingHistory")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApp } from '@/store';
import { showLoadingToast } from 'vant';
import Tab from '@/components/tab.vue';
import CollapseCard from './components/collapseCard.vue';
import { getAllBooking, getAllBookingHistory } from '@/api/admin/booking';
import { IGetAdminBooking, IGetAdminBookingHistory } from '@/Interface';
import axios from 'axios';

export default defineComponent({
  components: {
    Tab,
    CollapseCard,
  },
  setup () {
    /** Load Data */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const booking = ref<IGetAdminBooking[]>([]);
    const bookingHistory = ref<IGetAdminBookingHistory[]>([]);

    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await axios.all([
        getAllBooking({adminId: profile._CLIENT_PROFILE_KEY}),
        getAllBookingHistory({adminId: profile._CLIENT_PROFILE_KEY}),
      ])
      .then(axios.spread((bookingList: IGetAdminBooking[], bookingHistoryList: any) => {
        booking.value = [...bookingList];
        bookingHistory.value = [...bookingHistoryList];
      }))
      loading.close();
    }
    loadData();
    return {
      booking,
      bookingHistory
    }
  }
})
</script>