<template lang="pug">
.button-content
  MenuBtn(  
    :img='family' :name="'家庭用戶'"
    @click.prevent="router.push('/edcareAuth/adminFamily')"
  )
  MenuBtn(
    :img='nurse' :name="'陪診員用戶'"
    @click.prevent="router.push('/edcareAuth/adminNurse')"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import family from '@/assets/image/family.png';
import nurse from '@/assets/image/nurse.png';
import MenuBtn from '@/components/menuBtn.vue';

export default defineComponent({
  components:{
    MenuBtn,
  },
  setup () {
    const router = useRouter();
    return {
      family,
      nurse,
      router,
    }
  }
})
</script>
