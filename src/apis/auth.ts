import { api } from '@/request'

export const apiGetCaptchaImage = api<{
  captchaEnabled: boolean
  code: number
  img: string
  msg: string
  uuid: string
}>('/captchaImage', 'get')

export const apiLogin = api<
  {
    code: number
    msg: string
    token: string
  },
  {
    username: string
    password: string
    code: string
    uuid: string
  }
>('/login', 'post')

export type ApiGetInfoRes = {
  code: number
  msg: string
  permissions: string[]
  roles: string[]
  user: {
    admin: boolean
    avatar: null | string
    createBy: string
    createTime: string
    delFlag: null | '0'
    dept: Record<string, any>
    deptId: number
    email: null | string
    loginDate: null | string
    loginIp: null | string
    nickName: null | string
    params: Record<string, any>
    password: null | string
    phonenumber: null | string
    postIds: null | string
    remark: null | string
    roleId: null | string
    roleIds: null | string
    roles: null | Record<string, any>[]
    sex: null | string
    status: null | string
    updateBy: null | string
    updateTime: null | string
    userId: number
    userName: string
  }
  systemJYJDeptId?: number
  isSignature: boolean
}
export const apiGetInfo = api<ApiGetInfoRes>('/getInfo', 'get')

export const apiLogout = api<{ msg: string; code: number }>('/logout', 'post')
