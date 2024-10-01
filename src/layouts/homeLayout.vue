<template lang="pug">
.page
  .home-content
    .logo
      .logo-img
        img(:src="logo")
    .hello-msg
      .left 
        .subtitle Hello
          span(v-if="route.name != 'home'") , {{ user._CLIENT_PROFILE_NAME }} !
        .title 歡迎來到 ED care
      .right
        img(:src="hello")
    router-view
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useApp } from '@/store';
import { useRoute } from 'vue-router';
import logo from '@/assets/image/logo.png';
import hello from '@/assets/image/hello.png';
export default defineComponent({
  setup () {
    const route = useRoute();
    const appStore = useApp();
    const user = computed(() => appStore.GET_CLIENT_PROFILE);
    return {
      logo,
      hello,
      user,
      route,
    }
  }
})
</script>

<style lang="scss" scoped>
.logo{
  width: 100%;
  display: flex;
  align-items: center;
  .logo-img {
    margin-top: 9px;
    width: 141px;
    height: 60px; 
    position: relative;
    img{
      width: 141px;
      height: 60px; 
      position: absolute;
      left: -8px;
    }
  } 
}
.hello-msg{
  width: 100%;
  height: 135px;
  margin-top: 17px;
  position: relative;
  .left{
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    .subtitle{
      color: #919FA2;
      font-size: 18px;
      font-weight: 600;
    }
    .title{
      width: 189px;
      color: #8C9D87;
      font-size: 24px;
      font-weight: 600;
    }
  }
  .right{
    position: absolute;
    z-index: 0;
    top: 0px;
    right: 0px;
    height: 135px;
    img{
      height: 135px;
    }
  }
}
</style>