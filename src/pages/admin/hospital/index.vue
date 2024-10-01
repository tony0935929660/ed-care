<template lang="pug">
.content
  .title 醫院清單
  SingleCard(:hospitalList="apiData")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApp } from '@/store';
import { showLoadingToast } from 'vant';
import { getHospitals } from '@/api/admin/hospital/index';
import { IGetAdminHospital } from '@/Interface';
import SingleCard from './components/singleCard.vue';

export default defineComponent({
  components: {
    SingleCard
  },
  setup () {
    /** Booking History List */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const apiData = ref<IGetAdminHospital[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getHospitals({adminId: profile._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        apiData.value = [...res];
        console.log(res);
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