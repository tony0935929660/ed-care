<template lang="pug">
.form-item 
  .label  
    .title {{ title }}
  .input
    slot(name="input" :item="value")
      van-cell-group(inset)
        van-field(
          v-model="value"
          autocomplete="off"
          disabled
          style="background-color: #FBFBFB;"
        )
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
export default defineComponent({
  props: ['title', 'modelValue'],
  setup (props) {
    const { title } = toRefs(props);
    const value = computed({
      get() {
        return props.modelValue
      },
      set() {}
    });
    return {
      title,
      value,
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
    .title{
      color: #222;
      font-size: 14px;
      font-weight: 700;
      line-height: 140%; /* 19.6px */
      letter-spacing: 0.56px;
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