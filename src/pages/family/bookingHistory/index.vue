<template lang="pug">
.content
  .title 預約紀錄
  CollapseCard(:historyList="apiData")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApp } from '@/store';
import { showLoadingToast } from 'vant';
import { getBookingHistoryList } from '@/api/family/bookingHistory';
import { IGetBookingHistory } from '@/Interface';
import CollapseCard from './components/collapseCard.vue';

export default defineComponent({
  components: {
    CollapseCard
  },
  setup () {
    /** Booking History List */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const apiData = ref<IGetBookingHistory[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getBookingHistoryList({userLineId: profile._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        apiData.value = [...res.reverse()];
      })
      loading.close();
    }

    loadData();

    return {
      apiData,
    }
  }
})
</script>

<style lang="scss" scoped>
.title{
  width: 100%;
  padding: 28px 0px;
  color: #222;
  font-size: 20px;
  font-weight: 600;
  line-height: 18px; /* 90% */
}
</style>