<template lang="pug">
.tab
  .active-background(
    :class="{ 'underline-animate': animate }"
    :style="underlineStyles"
  )
  .tab-item(
    v-for="(tab, index) in tabs"
    :key="index"
    @click="selectTab(index)"
    :class="{ active: activeTab === index }"
  ) {{ tab }}
.tab-panel
  .tab-panel-item(v-show="activeTab === 0")
    slot(name="tab-content1")
  .tab-panel-item(v-show="activeTab === 1")
    slot(name="tab-content2")
</template>

<script lang="ts">
import { toRefs } from 'vue';
import { computed } from 'vue';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: ['tabs'],
  setup (props) {
    const activeTab = ref(0);
    const animate = ref(false);
    const { tabs } = toRefs(props);

    const underlineStyles = computed(() => {
      // 每個active的寬度
      const activeTabWidth = 100 / tabs.value.length;
      // 偏移量
      const activeTabOffset = activeTabWidth * activeTab.value + "%";
      return {
        width: activeTabWidth + "%",
        left: activeTabOffset,
      };
    });

    // Tab切換
    const selectTab = (index: number) => {
      animate.value = true;
      activeTab.value = index;
      animate.value = false;
    }
    

    return {
      tabs,
      activeTab,
      animate,
      underlineStyles,
      selectTab,
    }
  }
})
</script>

<style scoped>
.tab{
  position: relative;
  width: 100%;
  height: 36px;
  padding: 2px;
  margin: 16px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 65px;
  background: rgba(118, 118, 128, 0.12);
  .tab-item{
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex: 1 0 0;
    padding: 3px 10px;
    
    /* font style */
    color: #000;
    font-size: 13px;
    font-weight: 400;
    line-height: 18px; /* 138.462% */
    &.active{
      color: #000;
      font-size: 13px;
      font-weight: 590;
      line-height: 18px; 
    }
  }
  .active-background {
    position: absolute;
    bottom: 2;
    height: 36px;
    border-radius: 47px;
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    background: #FFF;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.12), 0px 3px 1px 0px rgba(0, 0, 0, 0.04);
    transition: left 0.3s, width 0.3s;
  }
}
.tab-panel{
  width: 100%;
  min-height: 500px;
  .tab-panel-item{
    width: 100%;
    min-height: 500px;
  }
}

.underline-animate {
  animation: underlineAnimation 0.3s linear;
}

@keyframes underlineAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>