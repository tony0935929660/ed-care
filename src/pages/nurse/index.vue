<template lang="pug">
.button-content
  MenuBtn(  
    :img='memberInfo' :name="'陪診員資料'"
    @click.prevent="router.push({path: '/edcareAuth/nurseMemberInfo'})"
  )
  MenuBtn(
    :img='booking' :name="'預約選擇'" :isRegister="isRegister"
    @click.prevent="checkRegister('/edcareAuth/nurseBooking')"
  )
  MenuBtn(
    :img='history' :name="'預約紀錄'" :isRegister="isRegister"
    @click.prevent="checkRegister('/edcareAuth/nurseBookingHistory')"
  )
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { showToast } from 'vant';
import { useUser } from '@/store';
import { useRouter } from 'vue-router';
import memberInfo from '@/assets/image/member-info.png';
import booking from '@/assets/image/booking.png';
import history from '@/assets/image/history.png';
import MenuBtn from '@/components/menuBtn.vue';

export default defineComponent({
  components:{
    MenuBtn,
  },
  setup () {
    const router = useRouter();
    const userStore = useUser();
    const isRegister = computed(() => userStore.GET_CUR_ACCOUNT?.isRegister);

    const checkRegister = (path: string) => {
      if(isRegister.value) {
        router.push(path);
      }
      else{
        showToast('請先註冊會員資料');
      }
    }
    return {
      memberInfo,
      booking,
      history,
      router,
      isRegister,
      checkRegister,
    }
  }
})
</script>
