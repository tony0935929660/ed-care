<template lang="pug">
.content
  .title 陪診員用戶
  CollapseCard(:nurseList="apiData")
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue';
import { useApp } from '@/store';
import { showLoadingToast } from 'vant';
import { IGetAdminNurse } from '@/Interface';
import { getAllNurse } from '@/api/admin/users/nurse';
import CollapseCard from './components/collapseCard.vue';

export default defineComponent({
  components:{
    CollapseCard,
  },
  setup () {
    /** Booking History List */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const apiData = ref<IGetAdminNurse[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getAllNurse({adminId: profile._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        apiData.value = [...res];
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