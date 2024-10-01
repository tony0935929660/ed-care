<template lang="pug">
.status(:style="{'background-color': backgroundColor}") {{ schedule }}
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted } from 'vue'

export default defineComponent({
  props: ['schedule'],
  setup (props) {
    const { schedule } = toRefs(props);

    const backgroundColor = ref<string>('#FFF');
    const statusMethod = () => {
      switch (schedule.value) {
        case '訂單媒合中':
          backgroundColor.value = '#F6F0DC';
          break;
        case '訂單已成立':
          backgroundColor.value = '#E3EBE0';
          break;
        case '訂單進行中':
          backgroundColor.value = '#E1EFF1';
          break;
        case '訂單完成等待醫囑':
          backgroundColor.value = '#F6F0DC';
          break;
        case '訂單完成未付款':
          backgroundColor.value = '#F5E6E4';
          break;
        case '訂單完成已付款':
          backgroundColor.value = '#E3EBE0';
          break;
        case '訂單已取消':
          backgroundColor.value = '#E6E6E6';
          break;
        case '訂單已取消需付款':
          backgroundColor.value = '#F5E6E4';
          break;
      
        default:
          backgroundColor.value = '#FFF';
          break;
      }
    }

    onMounted(() => {
      statusMethod();
    })

    return {
      schedule,
      backgroundColor,
    }
  }
})
</script>

<style lang="scss" scoped>
.status{
  padding: 0px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #1D2B19;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%; /* 19.6px */
}
</style>