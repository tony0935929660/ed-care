<template lang="pug">
.card-list(v-if="hospitalList.length > 0")
  .card-item(v-for="(item, index) in hospitalList")
    .card-content 
      .card-img 
        img(:src="hospitalItem")
      .card-label 
        .title 
          .name {{ item.hosName }}
        a.subtitle(:href="'https://www.google.com/maps/search/?api=1&query=' + item.hosAddress" target="_blank")
          span {{ item.hosAddress }}
          van-icon(name="location")
van-empty(v-else :image="nodata" description="查無資料")
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import nodata from '@/assets/image/noData.png';
import hospitalItem from '@/assets/image/hospitalItem.png';

export default defineComponent({
  props: ['hospitalList'],
  setup (props) {
    const hospitalList = computed(() => props.hospitalList);

    return { 
      nodata,
      hospitalItem,
      hospitalList,
    };
  }
})
</script>

<style lang="scss" scoped>
.card-list{
  padding-bottom: 42px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .card-item{
    border-radius: 24px;
    border: 1px solid #AFAFAF;
    background: #FFF;
    padding: 24px 16px;
    .card-content {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      .card-img {
        width: 44px;
        height: 44px;
        img{
          border-radius: 12px;
        }
      }
      .card-label {
        .title{
          .name{
            color: #000;
            font-size: 16px;
            font-weight: 590;
            line-height: 150%;
          }
        }
        .subtitle{
          display: flex;
          gap: 3px;
          span{
            // color: #6D6D6D;
            font-size: 12px;
            font-weight: 400;
            line-height: 140%; /* 16.8px */
          }
        }
      }
    }
  }
}
</style>