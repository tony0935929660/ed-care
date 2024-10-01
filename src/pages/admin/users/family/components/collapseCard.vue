<template lang="pug">
CollapseCard(
  :list="memberList" 
  :detailItems="detailItems"
)
  template(#content="{ item }")
    .card-content 
      .card-img 
        img(:src="item.memGender == '男性'? male: female")
      .card-label 
        .subtitle 用戶名稱
        .title 
          .name {{ item.memLineName }}
  template(#right="{ item }")
    .right-icon 
      van-icon(name="arrow-down" class="van-icon van-icon-arrow van-cell__right-icon")
  template(#action="{ item }")
    .card-action
      .submit-btn(@click.stop="viewFamily(item.memFamily)") 查看用戶家屬

van-popup.dialog(
  v-model:show="isPickerShow" 
  :style="{ width: '90%', height: '80%', padding: '24px 16px 0px' }" round
)
  .dialog-header
    .title 用戶家屬
    van-icon(name='cross' color="#000" size="20px" @click.stop="close()")
  .dialog-content
    CollapseCard(
      :list="curFamily" 
      :detailItems="detailItemsFamily"
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
import { useSystem } from '@/store';
import { IGetMember } from "@/Interface";
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
      { label: '性別', key: 'memGender' },
      { label: '電話', key: 'memPhone' },
      { label: '電子信箱', key: 'memEmail' },
      { label: '累積點數', key: 'memPoint' },
    ]);

    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);

    const viewFamily = (family: IGetMember[]) => {
      curFamily.value = [...family];
      systemStore.SET_IS_PICKER_SHOW(true);
    }
    const close = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
    }

    /** Family */
    const curFamily = ref<IGetMember[]>([]);
    const detailItemsFamily = ref([
      { label: '性別', key: 'cliGender' },
      { label: '年紀', key: 'cliAge' },
      { label: '電話', key: 'cliEmergencyPhone' },
      { label: '語言', key: 'cliLanguages' },
      { label: '身高', key: 'cliHeight' },
      { label: '體重', key: 'cliWeight' },
      { label: '疾病', key: 'cliDiseaseStatus' },
      { label: '其他', key: 'cliOtherConditions' },
    ]);

    
    return { 
      male,
      female,
      detailItems,
      memberList,
      isPickerShow,
      viewFamily,
      close,

      curFamily,
      detailItemsFamily,
    };
  }
})
</script>

<style lang="scss" scoped>
.dialog{
  display: flex;
  flex-direction: column;
  gap: 24px;
  .dialog-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{
      width: 100%;
      color: #222;
      font-size: 20px;
      font-weight: 600;
      line-height: 18px; /* 90% */
    }
  }
}
</style>