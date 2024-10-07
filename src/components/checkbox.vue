<template lang="pug">
.form-item 
  .label  
    .title {{ title }}
    .subtitle {{ subtitle }}
  van-checkbox-group(v-model="checked" shape="square")
    .input
      div(v-for="(item, index) in columns" :key="index" :class="item.text == '其他' ? 'other' : 'checkbox-item'")
        van-checkbox(:name="item.value" icon-size="24px") {{ item.text }}
          template(#icon="props")
            img(class="img-icon" :src="props.checked ? ischecked : unchecked" )
        input(v-if="isOthers && item.text =='其他'" v-model="otherOptions")
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from 'vue';
import ischecked from '@/assets/image/checked.png';
import unchecked from '@/assets/image/unchecked.png';

export default defineComponent({
  props: ['title', 'subtitle', 'columns', 'modelValue', 'isOthers'],
  setup (props, {emit}) {
    const { title, subtitle, columns, isOthers } = toRefs(props);
    const checked = ref(props.modelValue);
    const otherOptions = ref();
    watch(
      () => otherOptions.value,
      (val) => {
        for (const column of columns.value) {
          if (column.text == '其他') {
            column.value = val
          }
        }
      }
    )
    watch(
      () => checked.value,
      (val) => {
        emit('update:modelValue', val);
      }
    )
    return {
      title,
      subtitle,
      columns,
      checked,
      ischecked,
      unchecked,
      isOthers,
      otherOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.form-item{
  display: flex;
  flex-direction: column;
  gap: 24px;
  .label{
    display: flex;
    flex-direction: column;
    .title{
      color: #222;
      font-size: 16px;
      font-weight: 700;
      line-height: 140%; /* 22.4px */
      letter-spacing: 0.64px;
    }
    .subtitle{
      color: #6D6D6D;
      font-size: 14px;
      font-weight: 400;
      line-height: 140%; /* 19.6px */
    }
  }
  .input{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 24px 0px;
    .checkbox-item{
      width: 50%;
      color: #000;
      font-size: 16px;
      font-weight: 400;
      line-height: 140%; /* 22.4px */
      letter-spacing: 0.64px;
    }
  }
  input{
    background: transparent;
    border: none;
    border-bottom: 1px solid #6D6D6D;
    outline: none;
  }
  .other{
    width: 100%;
    color: #000;
    font-size: 16px;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: .64px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
}
</style>