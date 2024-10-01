<template lang="pug">
CollapseCard(
  :list="memberList" 
  :detailItems="detailItems"
)
  template(#content="{ item }")
    .card-content 
      .card-img 
        img(:src="item.cliGender == '男性'? male: female")
      .card-label 
        .subtitle 服務對象
        .title 
          .name {{ item.cliTargetRealName }}
          .tag(:class="{'female': item.cliGender == '女性'}") {{ item.cliServiceTarget }}
  template(#right="{ item }")
    .right-icon 
      van-icon(name="arrow-down" class="van-icon van-icon-arrow van-cell__right-icon")
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import male from '@/assets/image/male.png';
import female from '@/assets/image/female.png';
import CollapseCard from "@/components/CollapseCard.vue";

export default defineComponent({
  components: {
    CollapseCard,
  },
  props: ['memberList'],
  setup (props) {
    const memberList = computed(() => props.memberList);
    const detailItems = ref([
      { label: '性別', key: 'cliGender' },
      { label: '年紀', key: 'cliAge' },
      { label: '身高', key: 'cliHeight' },
      { label: '體重', key: 'cliWeight' },
      { label: '緊急聯絡人', key: 'cliEmergencyContact' },
      { label: '緊急聯絡人電話', key: 'cliEmergencyPhone' },
      { label: '疾病', key: 'cliDiseaseStatus' },
      { label: '特殊情形', key: 'cliOtherConditions' },
      { label: '行動能力', key: 'cliMobilityAssistances' },
      { label: '服務對象管路對象', key: 'cliPipeStatus' },
      { label: '常用語言', key: 'cliLanguages' },
    ]);
    return { 
      male,
      female,
      detailItems,
      memberList,
    };
  }
})
</script>