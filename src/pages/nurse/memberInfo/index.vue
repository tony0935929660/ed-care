<template lang="pug">
.content
  .form(v-if="isRegister")
    .title 
      .left 會員資料
    .user-img
      van-image(
        round
        width="7rem"
        height="7rem"
        :src="nurseMemberInfoFile.headshot"
      )
    ReadOnlyField(v-model="nurseMemberInfo_get.attrealName" :title="'姓名'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attgender" :title="'性別'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attage" :title="'年紀'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attcontactNumber" :title="'電話'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attAddress" :title="'地址'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attCompany" :title="'公司'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attPaymentAccount" :title="'付款帳戶'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attautobiography" :title="'自我介紹'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attOrdersTotal" :title="'訂單總數'")
    ReadOnlyField(v-model="nurseMemberInfo_get.attStar" :title="'評價'")
      template(#input="{item}")
        div(style="padding: 10px 32px;")
          span(style="color: #939393;") {{ item }}
          van-icon(name="star" color="#ffcf00" style="margin-left: 4px;")
    ReadOnlyField(v-model="nurseMemberInfo_get.attMValue" :title="'認證狀態'")
      template(#input="{item}")
        div(style="padding: 10px 32px;")
          .text-red(v-if="item == '未認證'") {{ item }}
          .text-green(v-else) {{ item }}
    ReadOnlyField(v-model="nurseMemberInfoFile.certificate" :title="'個人證照'")
      template(#input="{item}")
        div(style="padding: 10px 32px;")
          a(v-if="item" :href="item" target="_blank") 
            van-icon(name="description")
            |附件
          .text-red(v-else) 未上傳
    .upload-btn(@click.stop="onOpenDialog()") 更新個人照片及證照

  van-form(v-else)
    .form
      .title 
        .left 註冊會員
        .right * 為必填欄位
      ReadOnlyField(v-model="nurseMemberInfo.realName" :title="'姓名'")
      Select(v-model="nurseMemberInfo.gender" :title="'選擇性別'" :subtitle="'輸入您的性別'" :columns="gender" @click="curSelectKey = 'gender'")
      TextField(v-model="nurseMemberInfo.age" :title="'輸入年紀'" :subtitle="'輸入您的年紀'")
      Phone(v-model="nurseMemberInfo.contactNumber" :title="'輸入聯絡電話'" :subtitle="'輸入您的聯絡電話'")
      TextField(v-model="nurseMemberInfo.rAddress" :title="'輸入聯絡地址'" :subtitle="'輸入您的聯絡地址'")
      TextField(v-model="nurseMemberInfo.aCompany" :title="'輸入隸屬公司'" :subtitle="'輸入您的公司，若沒有則填無'")
      //- TextField(v-model="nurseMemberInfo.aPaymentAccount" :title="'輸入收款帳戶'" :subtitle="'輸入您的收款帳戶'")
      TextArea(v-model="nurseMemberInfo.aautobiography" :title="'填寫自我介紹'" :subtitle="'輸入50字以內的簡介'")
    .form-btn(@click.prevent="onSubmit()") 完成提交

  van-popup(v-model:show="isPickerShow" round position="bottom")
    van-picker(
      :columns="columns"
      cancel-button-text="取消"
      confirm-button-text="確認"
      @cancel="onCancel()"
      @confirm="onConfirm"
    )
  van-popup.dialog(
    v-model:show="isDialogShow" 
    :style="{ width: '90%', height: '80%', padding: '24px 16px 0px' }" round
  )
    .dialog-header
      .title 用戶上傳個人照片及證照
      van-icon(name='cross' color="#000" size="20px" @click.stop="close()")
    .dialog-content
      .form
        ReadOnlyField(:title="'個人照片'")
          template(#input)
            div(style="padding:12px;")
              van-uploader(v-model="uploadFile.headshot" :max-count="1")
        ReadOnlyField(:title="'個人證照'")
          template(#input)
            div(style="padding:12px;")
              van-uploader(v-model="uploadFile.certificate" :max-count="1")
        .upload-btn(@click.stop="onUpload()") 確認上傳
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useApp, useSystem, useUser } from '@/store';
import { INurseMemberInfo, IGetNurseMemberInfo } from '@/Interface';
import { postNurseMemberInfo, getNurseMemberInfo, getNurseMemberInfoImg, postNurseMemberInfoImg } from '@/api/nurse/memberInfo/index';
import { showLoadingToast, showToast, showSuccessToast } from 'vant';
import ReadOnlyField from '@/components/readOnlyField.vue';
import Select from '@/components/select.vue';
import Phone from '@/components/phone.vue';
import TextField from '@/components/textField.vue';
import TextArea from '@/components/textArea.vue';
import axios from 'axios';

export default defineComponent({
  components: {
    ReadOnlyField,
    Select,
    Phone,
    TextField,
    TextArea,
  },
  setup () {
    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);

    //- Post
    const nurseMemberInfo = ref<INurseMemberInfo>({
      userLineId: profile.value._CLIENT_PROFILE_KEY,
      realName: '',
      gender: '',
      age: null,
      contactNumber: '',
      rAddress: '',
      aCompany: '',
      aPaymentAccount: '',
      aautobiography: ''
    });

    //- Get
    const nurseMemberInfo_get = ref<IGetNurseMemberInfo>({
      attrealName: '',
      attgender: '',
      attage: 0,
      attcontactNumber: '',
      attAddress: '',
      attCompany: '',
      attPaymentAccount: '',
      attOrdersTotal: 0,
      attStar: 0,
      attMValue: '',
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
      nurseMemberInfo.value[curSelectKey.value as keyof Object] = selectedOptions[0].text;
    };

    /** Submit Member Info */
    const onSubmit = async() => {
      console.log('提交');
      let params = {
        ...nurseMemberInfo.value
      }
      console.log(params);
      await postNurseMemberInfo(params)
      .then((res: any) => {
        console.log(res);
      })
      .finally(() => loadData());
    }

    const nurseMemberInfoFile = ref({
      certificate: "",
      headshot: "",
    })

    /** Load Member Info */
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await axios.all([
        getNurseMemberInfo({userLineId: profile.value._CLIENT_PROFILE_KEY}),
        getNurseMemberInfoImg({userLineId: profile.value._CLIENT_PROFILE_KEY}),
      ])
      .then(axios.spread((nurseMemberInfo: any, nurseMemberFile: any) => {
        nurseMemberInfo_get.value = nurseMemberInfo;
        nurseMemberInfoFile.value = nurseMemberFile;
      }))
      loading.close();
    }

    //- 文件彈窗
    const isDialogShow = computed(() => systemStore.GET_IS_DIALOG_SHOW);

    const onOpenDialog = () => {
      systemStore.SET_IS_DIALOG_SHOW(true);
    }
    const close = () => {
      systemStore.SET_IS_DIALOG_SHOW(false);
      uploadFile.value = {
        certificate: [],
        headshot: [],
      }
    }
    const uploadFile = ref({
      certificate: [],
      headshot: [],
    })
    const onUpload = async() => {
      if(uploadFile.value.certificate.length == 0 && uploadFile.value.headshot.length == 0){
        showToast('請至少上傳一項文件');
      }
      else{
        const formData = new FormData();
        formData.append('userLineId', profile.value._CLIENT_PROFILE_KEY);
        formData.append('headshot', uploadFile.value.headshot[0]);
        formData.append('certificate', uploadFile.value.certificate[0]);
        let loading = showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
        await postNurseMemberInfoImg(formData)
        .then(() => {
          loading.close();
          showSuccessToast('完成上傳');
        })
        .finally(() => {
          close();
        })
      }
    }

    const userStore = useUser();
    const isRegister = computed(() => userStore.GET_CUR_ACCOUNT?.isRegister);
    if(isRegister.value) loadData();
    
    return {
      isRegister,
      
      nurseMemberInfo,
      nurseMemberInfo_get,
      gender,

      isPickerShow,
      columns,
      curSelectKey,
      onCancel,
      onConfirm,

      onSubmit,

      nurseMemberInfoFile,

      isDialogShow,
      onOpenDialog,
      close,
      uploadFile,
      onUpload,
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
  .user-img{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .upload-btn{
    width: calc(100% - 32px);
    padding: 12px 16px;
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
    &:hover{
      cursor: pointer;
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
  &:hover{
    cursor: pointer;
  }
}
.dialog{
  display: flex;
  flex-direction: column;
  gap: 24px;
  .dialog-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{
      width: 100%;
      color: #222;
      font-size: 20px;
      font-weight: 600;
      line-height: 18px; /* 90% */
    }
  }
}
</style>