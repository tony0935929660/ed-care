<template lang="pug">
.form-item 
  .label(v-if="title")
    .title {{ title }}
    .subtitle {{ subtitle }}
    span *
  .input
    van-cell-group(inset)
      van-field(
        v-model="value"
        is-link
        readonly
        placeholder="請選擇"
        @click="openPicker()"
        style="background-color: #FBFBFB;"
      )
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
import { useSystem } from '@/store';
export default defineComponent({
  props: ['title', 'subtitle', 'columns', 'modelValue'],
  setup (props) {
    const systemStore = useSystem();
    const { title, subtitle, columns} = toRefs(props);
    const value = computed(() => props.modelValue);
    const openPicker = () => {
      systemStore.SET_IS_PICKER_SHOW(true);
      systemStore.SET_PICKER_COLUMNS(columns.value);
    }

    return {
      title,
      subtitle,
      value,
      openPicker,
    }
  }
})
</script>

<style lang="scss" scoped>
.form-item{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
    border-radius: 16px;
    border: 1px solid #AFAFAF;
    background: #FBFBFB;
  }
}
.form-item .optional-mark {
  width: 1em; /* Fixed width for the span to maintain spacing */
}
</style>