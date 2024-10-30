// Router
import { useApp, useUser } from '@/store';
import { createRouter, createWebHistory } from 'vue-router';
import { showFailToast } from 'vant';

const homeLayout = () => import('@/layouts/homeLayout.vue');
const innerLayout = () => import('@/layouts/innerLayout.vue');

const routes =  [
  {
    path: "/:catchAll(.*)",
    redirect: "/lineLogin"
  },
  {
    path: "/lineLogin",
    name: "lineLogin",
    meta: {title: "lineLogin",},
    component: () => import("@/pages/lineLogin/index.vue"),
  },
  {
    path: "/lineAuth",
    name: "lineAuth",
    redirect: "/lineAuth/home",
    meta: {title: "lineAuth", requireAuth: true,},
    component: homeLayout,
    children: [
      // 系統入口頁面
      {
        name: "home",
        path: "home",
        meta: {title: 'home', requireAuth: true,},
        component: () => import("@/pages/home/index.vue"),
      },
      // 家庭入口頁面
      {
        name: "family",
        path: "family",
        meta: {title: 'family', requireAuth: true, account: 'member'},
        component: () => import("@/pages/family/index.vue"),
      },
      // 陪診員入口頁面
      {
        name: "nurse",
        path: "nurse",
        meta: {title: 'nurse', requireAuth: true, account: 'caregiver'},
        component: () => import("@/pages/nurse/index.vue"),
      },
      // 計程車入口頁面
      {
        name: "taxi",
        path: "taxi",
        meta: {title: 'taxi', requireAuth: true, account: 'taxi'},
        component: () => import("@/pages/taxi/index.vue"),
      },
      // 管理員入口頁面
      {
        name: "admin",
        path: "admin",
        meta: {title: 'admin', requireAuth: true, account: 'admin'},
        component: () => import("@/pages/admin/index.vue"),
      },
      // 管理員用戶查詢入口頁面
      {
        name: "adminUsers",
        path: "adminUsers",
        meta: {title: 'adminUsers', requireAuth: true, account: 'admin'},
        component: () => import("@/pages/admin/users/index.vue"),
      },
    ]
  },
  {
    path: "/edcareAuth",
    name: "edcareAuth",
    redirect: "/edcareAuth/home",
    meta: {title: "edcareAuth", requireAuth: true},
    component: innerLayout,
    children: [
      // 家庭
      {
        name: "familyMemberInfo",
        path: "familyMemberInfo",
        meta: {
          title: 'familyMemberInfo', 
          requireAuth: true,
          account: 'member',
          breadcrumb_title : '會員資料',
          breadcrumb_subtitle : 'Member Infomation',
        },
        component: () => import("@/pages/family/memberInfo/index.vue"),
      },
      {
        name: "familyMemberCenter",
        path: "familyMemberCenter",
        meta: {
          title: 'familyMemberCenter', 
          requireAuth: true,
          account: 'member',
          breadcrumb_title : '家屬中心',
          breadcrumb_subtitle : 'Family Member Center',
        },
        component: () => import("@/pages/family/memberCenter/index.vue"),
      },
      {
        name: "familyBooking",
        path: "familyBooking",
        meta: {
          title: 'familyBooking', 
          requireAuth: true,
          account: 'member',
          breadcrumb_title : '新增預約',
          breadcrumb_subtitle : 'Appointment Inquiry',
        },
        component: () => import("@/pages/family/booking/index.vue"),
      },
      {
        name: "familyBookingInquiry",
        path: "familyBookingInquiry",
        meta: {
          title: 'familyBookingInquiry', 
          requireAuth: true,
          account: 'member',
          breadcrumb_title : '查詢預約',
          breadcrumb_subtitle : 'Appointment Inquiry',
        },
        component: () => import("@/pages/family/bookingInquiry/index.vue"),
      },
      {
        name: "familyBookingHistory",
        path: "familyBookingHistory",
        meta: {
          title: 'familyBookingHistory', 
          requireAuth: true,
          account: 'member',
          breadcrumb_title : '預約紀錄',
          breadcrumb_subtitle : 'Historical Orders',
        },
        component: () => import("@/pages/family/bookingHistory/index.vue"),
      },
      // 陪診員
      {
        name: "nurseMemberInfo",
        path: "nurseMemberInfo",
        meta: {
          title: 'nurseMemberInfo', 
          requireAuth: true,
          account: 'caregiver',
          breadcrumb_title : '陪診員資料',
          breadcrumb_subtitle : 'Nurse Member Infomation',
        },
        component: () => import("@/pages/nurse/memberInfo/index.vue"),
      },
      {
        name: "nurseBooking",
        path: "nurseBooking",
        meta: {
          title: 'nurseBooking', 
          requireAuth: true,
          account: 'caregiver',
          breadcrumb_title : '預約選擇',
          breadcrumb_subtitle : 'Select empty appointment',
        },
        component: () => import("@/pages/nurse/booking/index.vue"),
      },
      {
        name: "nurseBookingHistory",
        path: "nurseBookingHistory",
        meta: {
          title: 'nurseBookingHistory', 
          requireAuth: true,
          account: 'caregiver',
          breadcrumb_title : '預約紀錄',
          breadcrumb_subtitle : 'Historical Orders',
        },
        component: () => import("@/pages/nurse/bookingHistory/index.vue"),
      },
      // 管理員
      {
        name: "adminFamily",
        path: "adminFamily",
        meta: {
          title: 'adminFamily', 
          requireAuth: true,
          account: 'admin',
          breadcrumb_title : '家庭用戶',
          breadcrumb_subtitle : 'System family users ',
        },
        component: () => import("@/pages/admin/users/family/index.vue"),
      },
      {
        name: "adminNurse",
        path: "adminNurse",
        meta: {
          title: 'adminNurse', 
          requireAuth: true,
          account: 'admin',
          breadcrumb_title : '陪診員用戶',
          breadcrumb_subtitle : 'System nurse users ',
        },
        component: () => import("@/pages/admin/users/nurse/index.vue"),
      },
      {
        name: "adminBooking",
        path: "adminBooking",
        meta: {
          title: 'adminBooking', 
          requireAuth: true,
          account: 'admin',
          breadcrumb_title : '預約查詢',
          breadcrumb_subtitle : 'System orders inquiry ',
        },
        component: () => import("@/pages/admin/booking/index.vue"),
      },
      {
        name: "adminHospital",
        path: "adminHospital",
        meta: {
          title: 'adminHospital', 
          requireAuth: true,
          account: 'admin',
          breadcrumb_title : '醫院查詢',
          breadcrumb_subtitle : 'System hospital inquiry ',
        },
        component: () => import("@/pages/admin/hospital/index.vue"),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
// @ts-ignore
router.beforeEach(async(to,from,next)=>{
  const appStore = useApp();
  const profile = appStore.GET_CLIENT_PROFILE;
  const userStore = useUser();
  const account = userStore.GET_ACCOUNT;
  
  let routeAuth: boolean = false; // 頁面需驗證
  let routeAccount: string = ""; // 頁面需對應帳號權限
  to.matched.forEach((route: any) => {
    routeAuth = route.meta.requireAuth;
    routeAccount = route.meta.account;
  })
  
  //- 需要驗證頁面
  if(routeAuth){
    //- Line尚未驗證及系統驗證
    if((profile == "") || (!profile) || (account?.length == 0)){
      showFailToast('用戶資料失效');
      next({path:"/lineLogin"})
    }
    //- 驗證後
    else{
      if(routeAccount !== undefined) {
        //- 檢查對應帳號是否可使
        let result = account?.findIndex((item: any) => item.accountName === routeAccount);
        if(result !== undefined && result > -1 && account){
          //- 紀錄當前使用帳號
          userStore.SET_CUR_ACCOUNT(account[result]);
          next();
        }
        else{
          showFailToast('權限不足');
          next({path:"/lineAuth/home"})
        }
      }
      else{
        next();
      }
    }
  }
  //- 無需驗證頁面
  else{
    next();
  }
})

export default router;