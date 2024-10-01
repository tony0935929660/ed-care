<template lang="pug">
.button-content
  MenuBtn(  
    :img='memberCenter' :name="'用戶查詢'"
    @click.prevent="router.push('/lineAuth/adminUsers')"
  )
  MenuBtn(
    :img='booking' :name="'預約查詢'"
    @click.prevent="router.push('/edcareAuth/adminBooking')"
  )
  MenuBtn(
    :img='hospital' :name="'醫院查詢'"
    @click.prevent="router.push('/edcareAuth/adminHospital')"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import memberCenter from '@/assets/image/member-center.png';
import booking from '@/assets/image/booking.png';
import hospital from "@/assets/image/hospital.png";
import MenuBtn from '@/components/menuBtn.vue';

export default defineComponent({
  components:{
    MenuBtn,
  },
  setup () {
    const router = useRouter();
    return {
      memberCenter,
      booking,
      hospital,
      router,
    }
  }
})
</script>
