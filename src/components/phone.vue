<template lang="pug">
.form-item 
  .label  
    .title {{ title }}
    .subtitle {{ subtitle }}
    span *
  .input
    .phone-country
      img(:src="TW")
      .phone-country-val +886
    .phone-input
      van-cell-group(inset)
        van-field(
          v-model='value' 
          placeholder='請填寫' 
          type="tel"
          @blur="submit()"
          autocomplete="off"
          :rules="[{ required: true, message: '此欄位為必填欄位' },{ validator: verifyPhone, message: '請輸入有效的手機號碼（格式：09XXXXXXXX）' }]"
          style="background-color: #FBFBFB;"
        )
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import TW from '@/assets/image/TW.png';
export default defineComponent({
  props: ['title', 'subtitle', 'modelValue'],
  setup (props, {emit}) {
    const { title, subtitle } = toRefs(props);
    const value = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val);
      }
    });
    const submit = () => {
      emit('update:modelValue', value.value);
    }
    const verifyPhone = (val: string) => {
      return /^09\d{8}$/.test(val)
    }
    return {
      title,
      subtitle,
      value,
      TW,
      submit,
      verifyPhone
    }
  }
})
</script>

<style lang="scss" scoped>
.form-item{
  display: flex;
  flex-direction: column;
  gap: 5px;
  .label{
    display: flex;
    align-items: center;
    .title{
      color: #222;
      font-size: 14px;
      font-weight: 700;
      line-height: 140%; /* 19.6px */
      letter-spacing: 0.56px;
      margin-right: 5px;
    }
    .subtitle{
      color: rgba(34, 34, 34, 0.66);
      font-size: 14px;
      font-weight: 400;
      line-height: 140%; /* 19.6px */
      margin-right: 5px;
    }
    span {
      color: #8C9D87;
    }
  }
  .input{
    display: flex;
    flex-direction: row;
    gap: 8px;
    .phone-country{
      display: flex;
      width: 73px;
      height: 20px;
      padding: 12px 16px;

      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-radius: 16px;
      border: 1px solid #AFAFAF;
      background: #FFF;
      .phone-country-val{
        color: #222;
        font-size: 14px;
        font-weight: 400;
        line-height: 140%; /* 19.6px */
      }
    }
    .phone-input{
      width: calc(100% - 81px);
      border-radius: 16px;
      border: 1px solid #AFAFAF;
      background: #FBFBFB;
    }
  }
}
</style>