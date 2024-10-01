<template lang="pug">
.content
  .form(v-if="isRegister")
    .title 
      .left 會員資料
    ReadOnlyField(v-model="memberInfo.lineName" :title="'姓名'")
    ReadOnlyField(v-model="memberInfo.gender" :title="'性別'")
    ReadOnlyField(v-model="memberInfo.email" :title="'電子信箱'")
    ReadOnlyField(v-model="memberInfo.phone" :title="'電話'")

  van-form(v-else)
    .form
      .title 
        .left 註冊會員
        .right * 為必填欄位
      ReadOnlyField(v-model="memberInfo.lineName" :title="'姓名'")
      Select(v-model="memberInfo.gender" :title="'選擇性別'" :subtitle="'輸入您的性別'" :columns="gender" @click="curSelectKey = 'gender'")
      TextField(v-model="memberInfo.email" :title="'輸入電子信箱'" :subtitle="'輸入您的電子信箱'")
      Phone(v-model="memberInfo.phone" :title="'輸入電話'" :subtitle="'輸入您的電話'")
    .form-btn(@click.prevent="onSubmit()") 完成提交

  van-popup(v-model:show="isPickerShow" round position="bottom")
    van-picker(
      :columns="columns"
      cancel-button-text="取消"
      confirm-button-text="確認"
      @cancel="onCancel()"
      @confirm="onConfirm"
    )
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useApp, useSystem, useUser } from '@/store';
import { IMemberInfo } from '@/Interface';
import { postMemberInfo, getMemberInfo } from '@/api/family/memberInfo';
import { showLoadingToast } from 'vant';
import ReadOnlyField from '@/components/readOnlyField.vue';
import Select from '@/components/select.vue';
import Phone from '@/components/phone.vue';
import TextField from '@/components/textField.vue';

export default defineComponent({
  components: {
    ReadOnlyField,
    Select,
    Phone,
    TextField,
  },
  setup () {
    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);

    const memberInfo = ref<IMemberInfo>({
      userLineId: profile.value._CLIENT_PROFILE_KEY,
      lineName: profile.value._CLIENT_PROFILE_NAME,
      gender: '男性',
      phone: '',
      email: '',
    });

    //- Data Options
    const gender = ref([
      { text: '男性', value: '男性' },
      { text: '女性', value: '女性' },
    ]);

    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);
    const columns = computed(() => systemStore.GET_PICKER_COLUMNS);
    const curSelectKey = ref();
    const onCancel = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
    }
    const onConfirm = ({ selectedOptions }: any) => {
      systemStore.SET_IS_PICKER_SHOW(false);
      console.log(selectedOptions[0].text, curSelectKey.value);
      memberInfo.value[curSelectKey.value as keyof Object] = selectedOptions[0].text;
    };

    /** Submit Member Info */
    const onSubmit = async() => {
      console.log('提交');
      let params = {
        ...memberInfo.value
      }
      await postMemberInfo(params)
      .then((res: any) => {
        console.log(res);
      })
      .finally(() => loadData());
    }

    /** Load Member Info */
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getMemberInfo({userLineId: profile.value._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        console.log(res);
        memberInfo.value = {
          userLineId: profile.value._CLIENT_PROFILE_KEY,
          lineName: res.memLineName,
          gender: res.memGender,
          phone: res.memPhone,
          email: res.memEmail,
        }
      })
      loading.close();
    }

    const userStore = useUser();
    const isRegister = computed(() => userStore.GET_CUR_ACCOUNT?.isRegister);
    if(isRegister.value) loadData();
    
    return {
      isRegister,

      memberInfo,
      gender,

      isPickerShow,
      columns,
      curSelectKey,
      onCancel,
      onConfirm,

      onSubmit,
    }
  }
})
</script>

<style lang="scss" scoped>
.form{
  margin: 16px auto 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  .title{
    width: 100%;
    padding: 12px 0px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .left{
      color: #222;
      font-size: 20px;
      font-weight: 600;
      line-height: 18px; /* 90% */
    }
    .right{
      color: #8C9D87;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px; /* 128.571% */
    }
  }
}
.form-btn{
  width: calc(100% - 32px);
  padding: 12px 16px;
  margin-bottom: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: #8C9D87;
  color: #FFF;
  font-size: 14px;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: 0.56px;
}
</style>