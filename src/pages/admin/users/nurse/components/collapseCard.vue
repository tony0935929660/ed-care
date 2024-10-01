<template lang="pug">
CollapseCard(
  :list="nurseList" 
  :detailItems="detailItems"
)
  template(#content="{ item }")
    .card-content 
      .card-img
        img(v-if="item.headshot" :src="item.headshot")
        img(v-else :src="item.attgender == '男性'? male: female")
      .card-label 
        .subtitle 用戶名稱
        .title 
          .name {{ item.attrealName }}
  template(#right="{ item }")
    .right-icon 
      van-icon(name="arrow-down" class="van-icon van-icon-arrow van-cell__right-icon")
  template(#attAddress="{ item }")
    .label 地址
    a.value(
      v-if="item"
      :href="'https://www.google.com/maps/search/?api=1&query=' + item" target="_blank"
    ) 
      span {{ item }}
      van-icon(name="location")
    .value(v-else) - -
  template(#attStar="{ item }")
    .label 評價
    .value {{ item }}
      van-icon(name="star" color="#ffcf00" style="margin-left: 4px;")
  template(#attMValue="{ item }")
    .label 是否認證
    .value(:class="{'text-red': item == '未認證', 'text-green': item == '已認證'}") {{ item }}
  template(#certificate="{ item }")
    .label 個人證照
    .value 
      a(v-if="item" :href="item" target="_blank") 
        van-icon(name="description")
        |附件
      .text-red(v-else) 未上傳
  template(#action="{ item }")
    .card-action(v-if="item.attMValue == '未認證'")
      .submit-btn(@click.stop="valid(item.attId)") 認證陪診員
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs } from 'vue';
import { showSuccessToast, showConfirmDialog, showLoadingToast } from "vant";
import { postNurseConfirm } from "@/api/admin/users/nurse";
import { IPostAdminConfirmNurse } from "@/Interface";
import { useApp } from "@/store";
import male from '@/assets/image/male.png';
import female from '@/assets/image/female.png';
import CollapseCard from "@/components/CollapseCard.vue";

export default defineComponent({
  components: {
    CollapseCard,
  },
  props: ['nurseList'],
  setup (props) {
    const { nurseList } = toRefs(props);
    
    const detailItems = ref([
      { label: '性別', key: 'attgender' },
      { label: '年紀', key: 'attage' },
      { label: '電話', key: 'attcontactNumber' },
      { label: '地址', key: 'attAddress' },
      { label: '隸屬公司', key: 'attCompany' },
      { label: '收款帳戶', key: 'attPaymentAccount' },
      { label: '點數', key: 'attTotalPoints' },
      { label: '訂單總數', key: 'attOrdersTotal' },
      { label: '評價', key: 'attStar' },
      { label: '是否認證', key: 'attMValue' },
      { label: '個人證照', key: 'certificate' },
    ]);

    const appStore = useApp();
    const profile = computed(() => appStore.GET_CLIENT_PROFILE);
    const valid = (attId: string) => {
      showConfirmDialog({
        title: '請確定是否要進行認證',
        message: '完成認證後，此陪診員將可以正常使用陪診員帳號功能。',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      })
        .then(async() => {
          let loading = showLoadingToast({
            message: '加载中...',
            forbidClick: true,
            duration: 0,
          });
          let params: IPostAdminConfirmNurse ={
            adminId: profile.value._CLIENT_PROFILE_KEY,
            attendantId: attId
          }
          await postNurseConfirm(params)
          .then(() => {
            loading.close();
          })
          .finally(() => {
            showSuccessToast('完成認證');
            history.go(0);
          })
        })
        .catch(() => {
          //- 取消
        });
    }
    return { 
      male,
      female,
      detailItems,
      nurseList,
      valid,
    };
  }
})
</script>