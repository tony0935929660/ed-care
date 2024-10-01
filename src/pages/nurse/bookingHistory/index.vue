<template lang="pug">
.content
  .title 預約紀錄
  Collapse(:bookingList="bookingHistory")

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApp } from '@/store';
import { getNurseBookingHistory } from '@/api/nurse/bookingHistory';
import { showLoadingToast } from "vant";
import Collapse from "./components/collapseCard.vue";

export default defineComponent({
  components: {
    Collapse,
  },
  setup () {
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const bookingHistory = ref([]) as any;
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getNurseBookingHistory({userLineId: profile._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        bookingHistory.value = [...res];
      })
      loading.close();
    }

    loadData();
    return {
      bookingHistory,
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