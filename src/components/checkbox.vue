<template lang="pug">
.form-item 
  .label  
    .title {{ title }}
    .subtitle {{ subtitle }}
  van-checkbox-group(v-model="checked" shape="square")
    .input
      .checkbox-item(v-for="(item, index) in columns" :key="index")
        van-checkbox(:name="item.value" icon-size="24px") {{ item.text }} 
          template(#icon="props")
            img(class="img-icon" :src="props.checked ? ischecked : unchecked" )
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from 'vue';
import ischecked from '@/assets/image/checked.png';
import unchecked from '@/assets/image/unchecked.png';

export default defineComponent({
  props: ['title', 'subtitle', 'columns', 'modelValue'],
  setup (props, {emit}) {
    const { title, subtitle, columns } = toRefs(props);
    const checked = ref(props.modelValue);
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
}
</style>