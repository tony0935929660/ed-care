<template lang="pug">
.button
  .left 
    img(:src="img")
  .right {{ name }}

  .disable-cover(:class="{'d-none': isRegister == undefined? true: isRegister}")
    span 請先註冊資料
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  props: ['img', 'name', 'isRegister'],
  setup (props) {
    const { img, name, isRegister} = toRefs(props);
    return {
      img, 
      name,
      isRegister
    }
  }
})
</script>

<style lang="scss" scoped>
.button{
  position: relative;
  height: 100px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #D4D4D4;
  background: linear-gradient(0deg, rgba(228, 231, 227, 0.90) 0%, rgba(228, 231, 227, 0.90) 100%), #FFF;
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.15);
  &:hover{
    cursor: pointer;
    background: #e9e9e9;
  }
  .left{
    width: 154px;
    display: flex;
    justify-content: center;
  }
  .right{
    display: flex;
    align-items: center;
    color: #6A6A6A;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    line-height: 140%;
  }
  .disable-cover{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #9d9d9d;
    color: #FFF;
    font-size: 24px;
    font-weight: 700;
    line-height: 140%;
    border-radius: 16px;
    opacity: .8;
    &.d-none{
      display: none;
    }
  }
}
</style>