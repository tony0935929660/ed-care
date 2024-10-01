<template lang="pug">
van-collapse.system-collapse(
  v-if="list.length > 0"
  v-model="activeNames"
)
  .card-list
    .card-item(v-for="(item, index) in list")
      van-collapse-item(:name="index" :border="false")
        template(#title)
          slot(name="content" :item="item")
        template(#right-icon)
          slot(name="right" :item="item")
        .detail-list
          .detail
            .detail-item 
              .label 訂單總數
              .value {{ item.attOrdersTotal }}
            .detail-item 
              .label 星級評價
              .value {{ item.attStar }}
                van-icon(name="star" color="#ffcf00" style="margin-left: 4px;")
          .detail-list-title 歷史評價
          .detail-list-item(v-for="(evaluate, index) in item.attEvaluate")
            .icon
              van-icon(name="comment-o" size="20")
            .value {{ evaluate }}
      slot(name="action" :item="item")
van-empty(v-else :image="nodata" description="查無資料")
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import nodata from '@/assets/image/noData.png';
export default defineComponent({
  props: ['list'],
  setup (props) {
    const activeNames = ref([]);
    const { list } = toRefs(props);

    return { 
      activeNames,
      nodata,
      list,
    };
  }
})
</script>