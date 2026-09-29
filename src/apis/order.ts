import { api } from '@/request'

export interface OrderSelect {
  allergiesIds?: string
  allergiesText?: string
  approverAudit?: 1
  approverId?: number
  approverName?: string
  approverRemark?: string
  audit?: 0 | 1 | -9
  auditFlag?: 0
  auditRemark?: string
  code: string // KEY
  createBy?: number
  createDate?: string
  createTime?: string
  deptName?: string
  diagnoseType?: '1'
  diagnoseTypeName?: string
  diagnosisIds?: string
  diagnosisText?: string
  discomfortSymptoms?: string
  dispatcher?: '0'
  doctorId?: number
  doctorName?: string
  endDate?: string
  endTime?: string
  hospitalId?: number
  insuType?: string
  insuTypeName?: string
  iptOtpNo?: string
  isPay?: 1
  isUpload?: string
  mdtrtId?: number
  medType?: string
  medTypeName?: string
  medicalUrl?: string
  number?: number
  openid?: string
  ordinationArea?: string
  ordinationAreaName?: string
  patientAddress?: string
  patientAge?: number
  patientCard?: string
  patientId?: number
  patientName?: string
  patientPhone?: string
  patientPsnno?: string
  patientSex?: '男' | '女'
  payStateMachine?: string
  prescriptionDate?: string
  registerPrice?: number
  remark?: string
  remarks?: string
  reviewer?: string
  shopId: number
  shopIdList?: any
  sprice?: number
  startDate?: string
  startTime?: string
  state?: 0 | 1 | -1 | -2 | -99 | 99
  successDate?: string
  successRemark?: string
  type: '1'
  updateBy?: string
  updateDate?: string
  updateTime?: string
}

export type ApiOrderSelectRes<T> = {
  code: number
  msg?: string
  total: number
  rows: T[]
}
export type ApiOrderSelectReq = {
  pageNum: string
  pageSize: string
  startTime?: string
  endTime?: string
  audit?: 0 | 1 | -9
  state?: 0 | 1 | -1 | -2 | -99 | 99
  code?: string
  doctorName?: string
}

export const apiOrderSelect4PC = api<ApiOrderSelectRes<OrderSelect>, ApiOrderSelectReq>('/doctor/doctor-select', 'get')

export interface OrderSelect4PE extends OrderSelect {
  detailedList: OrderDetailed[]
}

export const apiOrderSelect4PE = api<ApiOrderSelectRes<OrderSelect4PE>, ApiOrderSelectReq>(
  '/doctor/doctor-select-detail',
  'get',
)

export const apiOrderSelect4PED = api<ApiOrderSelectRes<OrderSelect4PE>, ApiOrderSelectReq>(
  '/doctor/doctor-select-detailDesc',
  'get',
)

export type OrderSelectDetail = {
  aiAvatarBase64?: string
  aiDesc?: string
  aiName?: string
  allergiesIds?: string
  allergiesText?: string
  approverAudit?: 1
  approverId?: number
  approverName?: string
  approverRemark?: string
  audit?: 0 | 1 | -9
  auditFlag?: 0
  auditRemark?: string
  chargingCountVoList?: any[]
  chatRecordList?: any
  code?: string
  createBy?: string
  createDate?: string
  createTime?: string
  diagnoseType?: '1'
  diagnoseTypeName?: string
  diagnosisIds?: string
  diagnosisText?: string
  differenceTime?: string
  discomfortSymptoms?: string
  dispatcher?: '0'
  doctorId?: number
  doctorName?: string
  hospitalId?: number
  insuType?: string
  insuTypeName?: string
  iptOtpNo?: string
  isPay?: 1
  mdtrtId?: number
  medType?: string
  medTypeName?: string
  medicalUrl?: string
  number?: number
  openid?: string
  ordinationArea?: string
  ordinationAreaName?: string
  patientAddress?: string
  patientAge?: number
  patientCard?: string
  patientId?: number
  patientName?: string
  patientPhone?: string
  patientPsnno?: string
  patientSex?: '男' | '女'
  payStateMachine?: string
  prescriptionDate?: string
  registerPrice?: number
  remark?: string
  remarks?: string
  reviewer?: string
  shopId?: number
  sprice?: number
  state?: 0 | 1 | -1 | -2 | -99 | 99
  successDate?: string
  successRemark?: string
  type?: string
  updateBy?: string
  updateDate?: string
  updateTime?: string
  doctorEntity: DoctorEntity
  sfDoctorEntity: DoctorEntity
  patientEntity: PatientEntity
  orderDetailedList: OrderDetailed[]
  hospital: Hospital
}

type DoctorEntity = {
  administrativeDuties?: string
  administrativeDutiesId?: number
  auto?: 0
  code?: string
  createDate?: string
  deptId?: string
  deptName?: string
  doctorLicenseNumber?: string
  hospitalId?: number
  hospitalStaffCategory?: string
  hospitalStaffCategoryId?: number
  id?: number
  idCard?: string
  imgBase64?: string
  imgUrl?: string
  isRecycle?: 0
  jobTitle?: string
  jobTitleId?: string
  kfNumber?: number
  name?: string
  phone?: string
  physicianLevel?: string
  physicianLevelId?: number
  pinyin?: string
  prescriptionRight?: 0
  sex?: '男' | '女'
  sfNumber?: number
  signatureUrl?: string
  updateDate?: string
  userId?: number
}

type PatientEntity = {
  address?: string
  age?: number
  allergiesText?: string
  createTime?: string
  id: number
  idCard?: string
  isDefault?: 0
  mobilePhone?: string
  name?: string
  openid?: string
  relationship?: '本人'
  sex?: '男' | '女'
  status?: 1
  updateTime?: string
}

export type OrderDetailed = {
  cfCode?: string
  ckcode?: string
  commoditycode?: string
  creationtime?: string
  dateProduction?: string
  datevalidity?: string
  djcode?: string
  ds?: string
  id: string
  ispc?: string
  itemno?: string
  jldw?: string
  mcjl?: string
  name?: string
  number?: number
  olaceoforigin?: string
  pc?: string
  remarks?: string
  specifications?: string
  sprice?: number
  supplierName?: string
  syts?: string
  unit?: string
  yf?: string
  ypdm?: string
}

type Hospital = {
  address?: string
  apiV3Key?: string
  appId?: string
  appSecret?: string
  cAdmin?: string
  cfNumber?: number
  createBy?: string
  createTime?: string
  deptId?: number
  description?: string
  httpClient?: string
  id: number
  isOpen?: 0
  isPay?: 1
  level?: string
  mchId?: string
  mchSerialNo?: string
  name?: string
  notifyUrl?: string
  phone?: string
  privateKey?: string
  refundsNotifyUrl?: string
  registerPrice?: number
  remark?: string
  serialNo?: string
  uAdmin?: string
  updateBy?: string
  updateTime?: string
  userId?: number
  verifier?: string
}

export const apiOrderSelectDetail = api<
  {
    code: number
    msg?: string
    data: OrderSelectDetail
  },
  { code: string }
>('/order/selectDetail', 'get')

export const apiOrderSelectPrescription = api<
  {
    code: number
    msg: string
  },
  {
    code: string
  }
>('/order/selectPrescription', 'get')

export const apiAudit = api<
  {
    code: number
    msg?: string
    data?: string
  },
  {
    code: string
    // -9审核不通过 1审核通过
    audit: number
    auditRemark: string
  }
>('/doctor/doctor-audit', 'post')

export type PrescriptionRecordEntity = {
  id: string
  code: string
  type: number
  auditName: string
  auditRemark?: string
  auditUserId?: string
  auditUserName?: string
  auditTime: string
}

export const apiPrescriptionRecord = api<
  {
    code: number
    msg: string
    data?: PrescriptionRecordEntity[]
  },
  {
    code: string
  }
>('/order/selectPrescriptionLog', 'get')

export type OrderSelectChatRecord = {
  content: string
  dateTime: string
  minContent?: any
  name: string
  type: 'doctor' | 'patient'
}

export const apiOrderSelectChatRecords = api<
  {
    code: number
    msg: string
    data: OrderSelectChatRecord[]
  },
  {
    code: string
  }
>('/order/selectChatRecord', 'get')
