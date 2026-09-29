import { api } from '@/request'

export type DictItem = {
  createBy?: string
  createTime?: string
  cssClass?: string
  default?: boolean
  dictCode: number
  dictLabel: string // LABEL
  dictSort: number
  dictType: string
  dictValue: string // VALUE
  isDefault: 'N' | 'Y'
  listClass?: string
  params: { '@type': 'java.util.HashMap' }
  remark?: string
  status?: '0'
  updateBy?: string
  updateTime?: string
}

export type apiGetDictByNameRes = {
  code: number
  msg?: string
  data: DictItem[]
}
export const apiGetDictByName = api<apiGetDictByNameRes>('/system/dict/data/type/:name', 'get')
