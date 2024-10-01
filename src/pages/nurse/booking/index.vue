<template lang="pug">
.content
  Tab(:tabs="['選擇空預約', '已確認預約']")
    template(#tab-content1)
      CollapseEmpty(:bookingList="bookingEmpty")
    template(#tab-content2) 
      CollapseConfirmed(:bookingList="bookingConfirmed")

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApp } from '@/store';
import Tab from '@/components/tab.vue';
import CollapseEmpty from "./components/collapseCard_bookingEmpty.vue";
import CollapseConfirmed from "./components/collapseCard_bookingConfirmed.vue";
import { showLoadingToast } from "vant";
import { getNurseBooking, getNurseBookingConfirmed } from '@/api/nurse/booking';
import { IGetNurseBooking } from '@/Interface';
import axios from 'axios';

export default defineComponent({
  components: {
    Tab,
    CollapseEmpty,
    CollapseConfirmed,
  },
  setup () {
    /** Booking List Data */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const bookingEmpty = ref<IGetNurseBooking[]>([]); 
    const bookingConfirmed = ref<IGetNurseBooking[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await axios.all([
        getNurseBooking({userLineId: profile._CLIENT_PROFILE_KEY}),
        getNurseBookingConfirmed({userLineId: profile._CLIENT_PROFILE_KEY}),
      ])
      .then(axios.spread((bookingList: IGetNurseBooking[], bookingConfirmedList: any) => {
        bookingEmpty.value = [...bookingList.reverse()];
        bookingConfirmed.value = [...bookingConfirmedList.reverse()];
      }))
      loading.close();
    }

    loadData();
    
    return {
      bookingEmpty,
      bookingConfirmed,
    };
  }
})
</script>