<template lang="pug">
.button-content
  MenuBtn(
    :img='family' :name="'家庭帳戶'"
    @click.prevent="passAccount('/lineAuth/family')"
  )
  MenuBtn(
    :img='nurse' :name="'陪診員帳戶'"
    @click.prevent="passAccount('/lineAuth/nurse')"
  )
  MenuBtn(
    :img='admin' :name="'管理員帳戶'"
    @click.prevent="passAccount('/lineAuth/admin')"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import family from '@/assets/image/family.png';
import nurse from '@/assets/image/nurse.png';
import admin from '@/assets/image/admin.png';
import MenuBtn from '@/components/menuBtn.vue';

export default defineComponent({
  components:{
    MenuBtn,
  },
  setup () {
    const router = useRouter();
    const passAccount = (path: string) => router.push({ path: path });

    return {
      family,
      nurse,
      admin,
      router,
      passAccount,
    }
  }
})
</script>
