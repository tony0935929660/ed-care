<template lang="pug"> 
.page
  .outter Line Login Auth Page 
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { convertToQueryString } from '@/common/index';
import { useApp, useUser } from '@/store';
import { getProfile, getToken } from '@/api/lineLogin';
import { getLogin } from '@/api/checkAccount';
import { showLoadingToast } from 'vant';

export default defineComponent({
  setup () {
    const route = useRoute();
    const router = useRouter();
    const appStore = useApp();
    const userStore = useUser();
    const appData = appStore.GET_CLIENT_INFO;
    onMounted(async() => {
      if(route.query.code && route.query.state){
        let loading = showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
        const params = {
          grant_type: 'authorization_code',
          code: route.query.code,
          client_id: appData._CLIENT_ID,
          client_secret: appData._CLIENT_SECRET,
          redirect_uri: window.location.origin + window.location.pathname
        };
        await getToken(params)
        .then(async(res: any) => {
          appStore.SET_CLIENT_ACCESS_TOKEN(res.access_token);
          return await getProfile()
        })
        .then(async(res: any) => {
          appStore.SET_CLIENT_PROFILE(res);
          return await getLogin({userLineId: res.sub})
        })
        .then((res: any) => {
          userStore.SET_USER(res);
          loading.close();
        })
        .finally(() => {
          router.push('/lineAuth/home');
        });
      }
      else{
        const line_auth = 'https://access.line.me/oauth2/v2.1/authorize';
        const auth_params = {
          state: appData._CLIENT_NAME,
          client_id: appData._CLIENT_ID,
          scope: 'profile openid',
          response_type: 'code',
          redirect_uri: window.location.href,
        };
        const paramsString = convertToQueryString(auth_params);
        window.location.href = `${line_auth}?${paramsString}`;
      }
    });
    return {};
  }
})
</script>

<style lang="scss" scoped>
.outter{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>