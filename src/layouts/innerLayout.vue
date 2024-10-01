<template lang="pug">
.page
  van-nav-bar.header(@click-left="onClickLeft")
    template(#left)
      van-icon(name="arrow-left" size="24" color="#222222")
    template(#title)
      .title {{ title }}
      .subtitle {{ subtitle }}
  router-view
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router';

export default defineComponent({
  setup () {
    const route = useRoute();
    const length = route.matched.length;
    const title = route.matched[length - 1].meta.breadcrumb_title;
    const subtitle = route.matched[length - 1].meta.breadcrumb_subtitle;
    const onClickLeft = () => history.back();
    return {
      title,
      subtitle,
      onClickLeft,
    }
  }
})
</script>

<style lang="scss" scoped>
.header{
  background-color: transparent;
  border-bottom: 1px solid #E7E7E7;
  .title{
    color: #222;
    font-size: 14px;
    font-weight: 700;
    line-height: 140%; /* 19.6px */
    letter-spacing: 0.56px;
  }
  .subtitle{
    color: rgba(34, 34, 34, 0.36);
    font-size: 11px;
    font-weight: 400;
    line-height: 140%; /* 15.4px */
  }
}
</style>