import { api } from '@/request'

export type Doctor = {
  administrativeDuties?: string
  administrativeDutiesId?: string
  auto?: 1 | 0
  code?: string
  createDate?: string
  deptId?: string
  deptName?: string
  doctorLicenseNumber?: string
  hospitalId?: number
  hospitalStaffCategory?: string
  hospitalStaffCategoryId?: string
  id: number
  idCard?: string
  imgBase64?: string
  imgUrl?: string
  isRecycle?: 0 | 1
  jobTitle?: string
  jobTitleId?: string
  kfNumber?: number
  name?: string
  phone?: string
  physicianLevel?: string
  physicianLevelId?: string
  pinyin?: string
  prescriptionRight?: 0 | 1
  sex?: '男' | '女'
  sfNumber?: 0
  signatureUrl?: string
  updateDate?: string
  userId?: number
}

export const apiDoctorList = api<{
  code: number
  msg: string
  rows: Doctor[]
  total: number
}>('/doctor/query', 'get')

export const apiDoctorSetSignature = api<
  {
    code: number
    msg: string
  },
  {
    file: string
    id: number
  }
>('/doctor/upload-signature', 'postMultipart')

export const apiDoctorSetAvatar = api<
  {
    code: number
    msg: string
    data: {
      imgBase64: string
      imgUrl: string
    }
  },
  {
    avatarfile: File
  }
>('/doctor/avatar', 'postMultipart')

export const apiDepartmentPort = api<
  {
    code: number
    msg: string
    data: { id: number; guojiaName: string }[]
  },
  {
    name: string
    page: number
    size: number
  }
>('/doctor/department-port', 'get')

export const apiDoctorSetInfo = api<
  {
    code: number
    msg: string
  },
  {
    auto: 0 | 1
    dept_id: string
    doctorLicenseNumber: string
    id: number
    idCard: string
    imgBase64?: string
    imgUrl?: string
    job_title_id: string
    name: string
    phone: string
    prescriptionRight: 0 | 1
  }
>('/doctor/update', 'post')

export type DoctorStatistic = {
  anumber: number
  bnumber: number
  cnumber: number
  deptName: string
  dnumber: number
  doctorLicenseNumber: string
  toltalNumber: string
  returnNumber: string
  hospitalId?: string
  hospitalName: string
  id: number
  isRecycle: 1 | 0
  name: string
  onlineTime: '0'
  snumber: number
  userId?: number
  wnumber: number
}

export const apiDoctorStatistics = api<
  {
    code: number
    msg: string
    total: number
    rows: DoctorStatistic[]
  },
  {
    startDate?: string
    endDate?: string
    pageNum: string
    pageSize: string
    keyword: string
    deptName?: string
    isOnline?: -1 | 0 | 1
  }
>('/doctor/query-statistics', 'get')
