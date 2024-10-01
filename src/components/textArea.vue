<template lang="pug">
.form-item 
  .label  
    .title {{ title }}
    .subtitle {{ subtitle }}
  .input
    van-cell-group(inset)
      van-field(
        v-model='value' 
        placeholder='請填寫'
        @blur="submit()"
        autocomplete="off"
        type="textarea" rows="2"
        autosize
        maxlength="50"
        style="background-color: #FBFBFB;"
      )
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
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
    return {
      title,
      subtitle,
      value,
      submit,
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
  }
  .input{
    border-radius: 16px;
    border: 1px solid #AFAFAF;
    background: #FBFBFB;
  }
}
</style>