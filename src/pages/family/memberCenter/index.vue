<template lang="pug">
.content
  Tab(:tabs="['新增家屬', '家屬資料']")
    template(#tab-content1) 
      .stepper
        .stepper-bar
          ul
            li.step.step1(
              data-index="01"
              :class=`{
                'active': finishedStep.includes('01'), 
                'success': finishedStep.includes('01') && finishedStep[finishedStep.length - 1] != '01'
              }`
            ) 
              span 填寫資料
            li.step.step2(
              data-index="02" 
              :class=`{
                'active': finishedStep.includes('02'), 
                'success': finishedStep.includes('02') && finishedStep[finishedStep.length - 1] != '02'
              }`
            )
              span 目前疾病狀況
            li.step.step3(
              data-index="03" 
              :class=`{
                'active': finishedStep.includes('03'), 
                'success': finishedStep.includes('03') && finishedStep[finishedStep.length - 1] != '03'
              }`
            ) 
              span 填寫完成
            #line
              #line-progress(:style="{ 'width': lineProgressWidth + '%' }")
        .stepper-container
          .step-session(:class="{'active': finishedStep[finishedStep.length - 1] == '01'}")
            van-form
              .form
                Select(v-model="memberParams.serviceTarget" :title="'選擇服務對象'" :subtitle="'請選擇需服務對象'" :columns="cliServiceTarget" @click="curSelectKey = 'serviceTarget'")
                TextField(v-model="memberParams.targetRealName" :title="'服務對象真實姓名'" :subtitle="'輸入服務對象真實姓名'")
                Select(v-model="memberParams.gender" :title="'選擇性別'" :subtitle="'輸入服務對象性別'" :columns="cliGender" @click="curSelectKey = 'gender'")
                Select(v-model="memberParams.age" :title="'選擇年紀'" :subtitle="'輸入服務對象年紀'" :columns="cliAge" @click="curSelectKey = 'age'")
                Select(v-model="memberParams.height" :title="'選擇身高'" :subtitle="'輸入服務對象身高'" :columns="cliHeight" @click="curSelectKey = 'height'")
                Select(v-model="memberParams.weight" :title="'選擇體重'" :subtitle="'輸入服務對象體重'" :columns="cliWeight" @click="curSelectKey = 'weight'")
                .input-row
                  Select(v-model="memberParams.emergencyContactType" :title="'緊急聯絡人'" :subtitle="'緊急聯絡人'" :columns="cliEmergencyContact" @click="curSelectKey = 'emergencyContactType'")
                  TextField(v-model="memberParams.emergencyContact")
                Phone(v-model="memberParams.emergencyPhone" :title="'緊急聯絡人電話'" :subtitle="'輸入緊急聯絡人電話'")
            .stepper-btn(@click.prevent="next('02')") 下一步
          .step-session(:class="{'active': finishedStep[finishedStep.length - 1] == '02'}")
            .form
              Checkbox(v-model="memberParams.diseaseStatus" :title="'選擇當事人的目前疾病狀況'" :subtitle="'請至少選一項'" :columns="cliDiseaseStatus" :isOthers="true")
              Checkbox(v-model="memberParams.otherConditions" :title="'是否有以下情形？'" :subtitle="'可複選'" :columns="cliOtherConditions" :isOthers="true")
              //- Checkbox(v-model="memberParams.mobilityAssistances" :title="'長輩行動能力'" :subtitle="'可複選'" :columns=" cliMobilityAssistances")
              //- Checkbox(v-model="memberParams.pipeStatus" :title="'服務對象管路狀況'" :subtitle="'可複選'" :columns="cliPipeStatus")
              Checkbox(v-model="memberParams.languages" :title="'常用語言'" :subtitle="'可複選'" :columns="cliLanguages")
            .stepper-btn(@click.prevent="next('03')") 完成提交
          .step-session(:class="{'active': finishedStep[finishedStep.length - 1] == '03'}")
            .complete-container 
              img(:src="complete")
              .complete-text 
                p 填寫完成
                p 立即查看家屬資料!
              .return-text(@click.prevent="stepperReset()") 返回新增家屬資料
                
    template(#tab-content2)
      CollapseCard(:memberList="apiData")
  van-back-top(offset="100" bottom="12vh") 
  van-popup(v-model:show="isPickerShow" round position="bottom")
    van-picker(
      :columns="columns"
      cancel-button-text="取消"
      confirm-button-text="確認"
      @cancel="onCancel()"
      @confirm="onConfirm"
    )
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed  } from 'vue'
import { useApp, useSystem } from '@/store';
import { getMemberList, postMember } from '@/api/family/memberCenter';
import { showLoadingToast, showToast } from 'vant';
import { IGetMember } from '@/Interface';
import Tab from '@/components/tab.vue';
import TextField from '@/components/textField.vue';
import Select from '@/components/select.vue';
import Phone from '@/components/phone.vue';
import Checkbox from '@/components/checkbox.vue';
import CollapseCard from './components/collapseCard.vue';
import complete from '@/assets/image/complete.gif';

export default defineComponent({
  components: {
    Tab,
    TextField,
    Select,
    Phone,
    Checkbox,
    CollapseCard,
  },
  setup () {
    /** Stepper */
    const finishedStep = ref(['01']);
    const lineProgressWidth = ref(0);
    const next = async(curStep: string) => {
      window.scrollTo(0,0);
      if(curStep == '02') {
        if(
          memberParams.value.targetRealName == '' ||
          memberParams.value.age == '' ||
          memberParams.value.height == '' ||
          memberParams.value.weight == '' ||
          memberParams.value.emergencyContact == '' ||
          memberParams.value.emergencyPhone == '' 
        ) {
          showToast('尚有欄位未填寫完整');
          return ;
        }
      }
      if(curStep == '03') {
        if(
          memberParams.value.diseaseStatus.length == 0 ||
          memberParams.value.otherConditions.length == 0 ||
          // memberParams.value.mobilityAssistances.length == 0 ||
          // memberParams.value.pipeStatus.length == 0 ||
          memberParams.value.languages.length == 0
        ) {
          showToast('尚有選項未勾選');
          return ;
        }
        let loading = showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
        await onSubmit();
        loading.close();
      }
      finishedStep.value.push(curStep);
      lineProgressWidth.value += 50;
      console.log(finishedStep.value, lineProgressWidth.value);
    }

    const stepperReset = () => {
      history.go(0);
    }

    /** Data Options */
    const cliServiceTarget = ref([
      { text: '祖父', value: '祖父' },
      { text: '祖母', value: '祖母' },
      { text: '岳父', value: '岳父' },
      { text: '岳母', value: '岳母' },
      { text: '父親', value: '父親' },
      { text: '母親', value: '母親' },
      { text: '兒子', value: '兒子' },
      { text: '女兒', value: '女兒' },
      { text: '其他', value: '其他' },
    ]);
    const cliGender = ref([
      { text: '男性', value: '男性' },
      { text: '女性', value: '女性' },
    ]);
    const cliDiseaseStatus = ref([
      { text: '高血壓', value: '高血壓' },
      { text: '疥瘡或肺結核', value: '疥瘡或肺結核' },
      { text: '中風', value: '中風' },
      { text: '糖尿病', value: '糖尿病' },
      { text: '肺炎', value: '肺炎' },
      { text: '洗腎', value: '洗腎' },
      { text: '骨折', value: '骨折' },
      { text: '癌症', value: '癌症' },
      { text: '帕金森氏症', value: '帕金森氏症' },
      { text: '傷口', value: '傷口' },
      { text: '手術照顧', value: '手術照顧' },
      { text: '精神疾病', value: '精神疾病' },
      { text: '褥瘡（壓瘡）', value: '褥瘡（壓瘡）' },
      { text: '無', value: '無' },
      { text: '其他', value: '其他' },
    ]);
    const cliOtherConditions = ref([
      { text: '失智', value: '失智' },
      { text: '有攻擊傾向', value: '有攻擊傾向' },
      { text: '有自殘傾向', value: '有自殘傾向' },
      { text: '糖尿病', value: '糖尿病' },
      { text: '情緒低落', value: '情緒低落' },
      { text: '無特殊狀況', value: '無特殊狀況' },
      { text: '其他', value: '其他' },
    ]);
    const cliMobilityAssistances = ref([
      { text: '協助沐浴', value: '協助沐浴' },
      { text: '使用輔具', value: '使用輔具' },
      { text: '協助穿脫衣物', value: '協助穿脫衣物' },
      { text: '協助如廁', value: '協助如廁' },
      { text: '協助進食', value: '協助進食' },
      { text: '協助移位', value: '協助移位' },
    ]);
    const cliPipeStatus = ref([
      { text: '無管路', value: '無管路' },
      { text: '鼻胃管', value: '鼻胃管' },
      { text: '尿管', value: '尿管' },
      { text: '氣切管', value: '氣切管' },
      { text: '氧氣管', value: '氧氣管' },
      { text: '面罩', value: '面罩' },
      { text: '胃造口', value: '胃造口' },
      { text: '腸造口', value: '腸造口' },
      { text: '人工肛門', value: '人工肛門' },
      { text: '引流管', value: '引流管' },
      { text: '其他管路', value: '其他管路' },
    ]);
    const cliLanguages = ref([
      { text: '國語', value: '國語' },
      { text: '台語', value: '台語' },
      { text: '客家語', value: '客家語' },
      { text: '英語', value: '英語' },
      { text: '日語', value: '日語' },
      { text: '其他', value: '其他' },
    ]);
    const cliEmergencyContact = ref([
      { text: '父子', value: '父子' },
      { text: '⽗女', value: '⽗女' },
      { text: '⺟⼦', value: '⺟⼦' },
      { text: '⺟女', value: '⺟女' },
      { text: '其他', value: '其他' },
    ]);
    const cliAge = ref(Array.from({ length: 83 }, (_, i) => ({ text: (i + 18).toString(), value: i + 18 })));
    const cliHeight = ref(Array.from({ length: 71 }, (_, i) => ({ text: (i + 130).toString(), value: i + 130 })));
    const cliWeight = ref(Array.from({ length: 61 }, (_, i) => ({ text: (i + 40).toString(), value: i + 40 })));

    /** Data Params */
    const memberParams = ref({
      serviceTarget: '父親',
      targetRealName: '',
      gender: '男性',
      age: '50',
      height: '150',
      weight: '50',
      emergencyContact: '',
      emergencyPhone: '',
      diseaseStatus: [],
      otherConditions: [],
      mobilityAssistances: [],
      pipeStatus: [],
      languages: []
    });

    watch(
      () => memberParams.value,
      (val) => console.log(val),
      {deep: true}
    )

    /** Select */
    const systemStore = useSystem();
    const isPickerShow = computed(() => systemStore.GET_IS_PICKER_SHOW);
    const columns = computed(() => systemStore.GET_PICKER_COLUMNS);
    const curSelectKey = ref();
    const onCancel = () => {
      systemStore.SET_IS_PICKER_SHOW(false);
    }
    const onConfirm = ({ selectedOptions }: any) => {
      systemStore.SET_IS_PICKER_SHOW(false);
      console.log(selectedOptions[0].text, curSelectKey.value);
      memberParams.value[curSelectKey.value as keyof Object] = selectedOptions[0].text;
    };

    /** Member List Data */
    const appStore = useApp();
    const profile = appStore.GET_CLIENT_PROFILE;
    const apiData = ref<IGetMember[]>([]); 
    const loadData = async() => {
      let loading = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      });
      await getMemberList({userLineId: profile._CLIENT_PROFILE_KEY})
      .then((res: any) => {
        apiData.value = [...res] ;
      })
      loading.close();
    }

    /** Submit Member */
    const onSubmit = async() => {
      let params = {
        userLineId: profile._CLIENT_PROFILE_KEY as string,
        ...memberParams.value,
        diseaseStatus: memberParams.value.diseaseStatus.toString(),
        otherConditions: memberParams.value.otherConditions.toString(),
        mobilityAssistances: memberParams.value.mobilityAssistances.toString(),
        pipeStatus: memberParams.value.pipeStatus.toString(),
        languages: memberParams.value.languages.toString(),
      }
      await postMember(params)
      .then((res: any) => {
        console.log(res);
      })
      .finally(() => loadData());
    }

    loadData();

    return {
      finishedStep,
      lineProgressWidth,
      complete,
      cliServiceTarget,
      cliGender,
      cliDiseaseStatus,
      cliOtherConditions,
      cliMobilityAssistances,
      cliPipeStatus,
      cliLanguages,
      cliAge,
      cliHeight,
      cliWeight,
      cliEmergencyContact,
      memberParams,
      next,
      stepperReset,

      isPickerShow,
      columns,
      curSelectKey,
      onCancel,
      onConfirm,

      apiData,
      onSubmit,
    };
  }
})
</script>

<style lang="scss" scoped>
.stepper{
  overflow-x: hidden;
  width: 100%;
  margin: 8px auto 0px;
  .stepper-bar {
    width: calc(100% - 40px);
    height: 68px;
    position: relative;
    padding: 0px 20px;
    ul {
        width: calc(100% - 40px);
        height: 38px;
        position: absolute;
        z-index: 999;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        li {
            position: relative;
            z-index: 2;
            list-style: none;
            color: #aaa;
            transition: all ease 0.2s;
            cursor: pointer;
            &::before {
                width: 32px;
                height: 32px;
                content: attr(data-index);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                background-color: #fff;
                background-image: none;
                border: 3px solid #E4E4E6;
                transition: all ease 0.3s;

                /* content font */
                color: #000000;
                text-align: center;
                font-size: 13px;
                font-weight: 500;
            }
            &.active::before {
                width: 38px;
                height: 38px;
                background-color: #fff;
                background-image: none;
                border: 3px solid #8C9D87;
                /* content font */
                color: #8C9D87;
            }
            &.success::before {
              content: ' ';
              background-color: none;
              background-image: url('../../../assets/image/success.png');
              background-size: cover;
              border: none;
            }
            span {
              width: 100px;
              text-align: center;
              position: absolute;
              top: 48px;
              left: -31px;
              color: #222;
              text-align: center;
              font-size: 13px;
              font-weight: 600;
            }
            &.active span {
              color: #8C9D87;
            }
        }
        #line {
          width: calc(100% - 40px);
          height: 3px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          background-color: #E4E4E6;
          border-radius: 50px;
          transition: all ease 0.75s;
          #line-progress {
              content: " ";
              height: 100%;
              background-color: #8C9D87;
              position: absolute;
              z-index: 2;
              transition: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.25);
          }
        }
    }
  }

  .stepper-container{
    padding: 0;
    margin: 0;
    width: 100%;
    min-height: 200px;
    .step-session {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      display: none;
      animation: FadeInUp 0.7s ease 1 forwards;
      transform: translateX(100px);
      opacity: 0;

      &.active {
        display: block;
        opacity: 1;
      }
    }
  }
}

@keyframes FadeInUp {
    0% {
        transform: translateX(100px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
}

.complete-container{
  width: 270px;
  height: 270px;
  position: relative;
  margin: 54px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 200px;
    height: 200px;
  }
  .complete-text  {
    position: absolute;
    bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    p {
      margin: 0;
      color: #222;
      font-size: 20px;
      font-weight: 510;
      line-height: 18px;
    }
  }
  .return-text{
    position: absolute;
    bottom: -32px;
    color: #8C9D87;
    font-size: 16px;
    font-weight: 400;
    text-decoration-line: underline;
    line-height: 18px;
    &:hover{
      cursor: pointer;
      color: rgb(21, 92, 103);
    }
  }
}
.form{
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.stepper-btn{
  width: calc(100% - 32px);
  padding: 12px 16px;
  margin-bottom: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: #8C9D87;
  color: #FFF;
  font-size: 14px;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  letter-spacing: 0.56px;
}
.input-row{
  display: flex;
  gap: 8px;
}
</style>