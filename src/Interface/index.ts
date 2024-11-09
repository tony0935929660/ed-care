//- DEFINE INTERFACE ANF TYPE
export type TYPE_API = 'LINELOGIN' | 'APIDATA' | 'APIUPLOADFILE';
import { Method } from "axios";
export interface IAxiosConfig<T> {
  url: string;
  method: Method;
  data?: any;
  options?: IAxiosOptions<T>;
}
export interface IAxiosOptions<T> {
  hasMock?: boolean;
  mockData?: IApiResult<T>;
}
// @ts-ignore
export interface IApiResult<T> {
  error: '',
  result: any,
  statusText: string
}

export interface IUserId {
  id?: string,
  userLineId?: string,
  adminId?: string,
}

//- 家庭-會員資料
export interface IMemberInfo {
  userLineId: string,
  lineName: string,
  gender: string,
  phone: string,
  email: string,
}

//- 家庭-會員中心
export interface IMember {
  userLineId: string,
  serviceTarget: string,
  targetRealName: string,
  gender: string,
  age: string,
  height: string,
  weight: string,
  emergencyContact: string,
  emergencyPhone: string,
  diseaseStatus: string,
  otherConditions: string,
  mobilityAssistances: string,
  pipeStatus: string,
  languages: string
}

export interface IGetMember {
  cliServiceTarget: string,
  cliTargetRealName: string,
  cliGender: string,
  cliAge: string,
  cliHeight: string,
  cliWeight: string,
  cliEmergencyContact: string,
  cliEmergencyPhone: string,
  cliDiseaseStatus: string,
  cliOtherConditions: string,
  cliMobilityAssistances: string,
  cliPipeStatus: string,
  cliLanguages: string,
}

//- 家庭-預約查詢
export interface IBooking {
  userLineId: string,
  targetRealName: string,
  hospitalId: string,
  department: string,
  departmentNumber: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: string,
  pickupAddress: string,
}

export interface IGetBooking {
  orderId: string,
  targetRealName: string,
  hospital: string,
  department: string,
  departmentNumber: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: string,
  pickupAddress: string,
  confirmationStatus: string,
  estimate: string,
  schedule: string,
}

export interface ICancelBooking {
  userLineId: string,
  orderId: string,
}

export interface ISelectNurse {
  attId: number,
  attName: string,
  attHeadshot: string
}

export interface IPostSelectNurse {
  userLineId: string,
  orderId: string,
  attendantId: string
}

//- 家庭-歷史訂單
export interface IBookingHistory {
  userLineId: string,
  orderId: string,
  attendantScore: number,
  evaluate: string,
}

export interface IGetBookingHistory {
  orderId: string,
  targetRealName: string,
  hospital: string,
  department: string,
  departmentNumber: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: string,
  pickupAddress: string,
  confirmationStatus: string,
  sum: string,
  endDate: string,
  endTime: string,
  doctorOrders: string,
  attendantScore: string,
  evaluate: string,
  schedule: string,
  submitsAppointmentDate: string,
  submitsAppointmentTime: string,
  dateOfEstablishment: string,
  timeOfEstablishment: string,
  startDate: string,
  startTime: string,
}

//- 家庭-付款
export interface IPay{
  orderId: string
}

//- 下拉選單
export interface ISysDropDown {
  text: string,
  value: string
}

export interface IGetHospital {
  hospitalId: string,
  hospital: string
}

export interface IGetCliTarget {
  cliId: string,
  cliTargetRealName: string
}

//- 陪診員-會員資料
export interface INurseMemberInfo {
  userLineId: string,
  realName: string,
  gender: string,
  age: string,
  contactNumber: string,
  rAddress: string,
  aCompany: string,
  aPaymentAccount: string,
  aautobiography: string
}

export interface IGetNurseMemberInfo {
  attrealName: string,
  attgender: string,
  attage: number,
  attcontactNumber: string,
  attAddress: string,
  attCompany: string,
  attPaymentAccount: string,
  attOrdersTotal: number,
  attStar: number,
  attMValue: string,
}

//- 陪診員-空預約
export interface IGetNurseBooking {
  orderId: number,
  targetRealName: string,
  hospital: string,
  department: string,
  departmentNumber: number,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: number,
  pickupAddress: string,
}

//- 陪診員-更新醫生指示
export interface IPostNurseBookingDoctorOrder {
  userLineId: string,
  orderId: string,
  doctorOrders: string,
}

//- 陪診員-接取空預約
export interface IPostNurseBookingEmpty {
  userLineId: string,
  orderId: string
}

//- 管理員-用戶資料
export interface IGetAdminFamilyMember {
  memId: number,
  memLineId: string,
  memLineName: string,
  memGender: string,
  memPhone: string,
  memEmail: string,
  memPoint: number,
  memFamily: Array<IGetMember>
}

export interface IGetAdminNurse {
  attId: number,
  attLineId: string,
  attrealName: string,
  attgender: string,
  attage: number,
  attcontactNumber: string,
  attAddress: string,
  attCompany: string,
  attPaymentAccount: string,
  attTotalPoints: number,
  attOrdersTotal: number,
  attStar: number,
  attMValue: string,
}

//- 管理員-認證陪診員
export interface IPostAdminConfirmNurse{
  adminId: string,
  attendantId: string
}

//- 管理員-預約資料
export interface IGetAdminBooking {
  orderId: number,
  membersId: number,
  targetRealName: string,
  hospital: string,
  department: string,
  departmentNumber: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: number,
  pickupAddress: string,
  matchMakingCaregiver: string,
  confirmationStatus: string,
  carCompanyName: string,
  estimate: number,
  schedule: string,
  submitsAppointmentDate: string,
  submitsAppointmentTime: string,
  dateOfEstablishment: string,
  timeOfEstablishment: string,
  startDate: string,
  startTime: string
}

export interface IGetAdminBookingHistory {
  orderId: number,
  membersId: number,
  targetRealName: string,
  hospital: string,
  department: number,
  departmentNumber: number,
  appointmentDate: string,
  appointmentTime: string,
  serviceHours: number,
  pickupAddress: string,
  preferredCaregiver: string,
  confirmationStatus: string,
  carCompanyName: string,
  estimate: number,
  carMoney: number,
  attendantFee: number,
  mItems: number,
  sum: number,
  endDate: string,
  endTime: string,
  doctorOrders: string,
  schedule: string,
  attendantScore: number,
  evaluate: string,
  submitsAppointmentDate: string,
  submitsAppointmentTime: string,
  dateOfEstablishment: string,
  timeOfEstablishment: string,
  startDate: string,
  startTime: string,
}

//- 管理員-醫院資料
export interface IGetAdminHospital {
  hosId: number,
  hosName: string,
  hosAddress: string
}

