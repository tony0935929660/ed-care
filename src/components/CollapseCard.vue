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
        .detail 
          .detail-item(v-for="(detail, index) in detailItems")
            slot(:name="detail.key" :item="item[detail.key]")
              .label {{ detail.label }}
              .value {{ item[detail.key]? item[detail.key]: '- -'}}
      slot(name="action" :item="item")
van-empty(v-else :image="nodata" description="查無資料")
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import nodata from '@/assets/image/noData.png';
export default defineComponent({
  props: [
    'list', 
    'detailItems',
  ],
  setup (props) {
    const activeNames = ref([]);
    const { list, detailItems } = toRefs(props);

    return { 
      activeNames,
      nodata,
      list,
      detailItems,
    };
  }
})
</script>