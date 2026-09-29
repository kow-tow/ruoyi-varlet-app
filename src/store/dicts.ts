import { apiGetDictByName, DictItem, type apiGetDictByNameRes } from '@/apis/dicts'

export type { DictItem } from '@/apis/dicts'

export const useDictsStore = defineStore('dicts', () => {
  const value = reactive<Record<string, DictItem[]>>({})
  const gettingDictFuture: Record<string, Promise<apiGetDictByNameRes>> = {}
  const getDictItemsByName = async (name: string) => {
    if (Object.hasOwn(value, name)) {
      return value[name]
    }
    let future: Promise<apiGetDictByNameRes>
    if (Object.hasOwn(gettingDictFuture, name)) {
      future = gettingDictFuture[name]
    } else {
      future = apiGetDictByName.load({}, { name })
      gettingDictFuture[name] = future
    }
    const res = await future
    if (res.code === 200) {
      value[name] = res.data
      return res.data
    } else {
      delete gettingDictFuture[name]
      return []
    }
  }
  const getDictByName = async (name: string) => {
    if (Object.hasOwn(value, name)) {
      return Object.fromEntries(value[name].map((i) => [i.dictValue, i.dictLabel]))
    }
    let future: Promise<apiGetDictByNameRes>
    if (Object.hasOwn(gettingDictFuture, name)) {
      future = gettingDictFuture[name]
    } else {
      future = apiGetDictByName.load({}, { name })
      gettingDictFuture[name] = future
    }
    const res = await future
    if (res.code === 200) {
      value[name] = res.data
      return Object.fromEntries(res.data.map((i) => [i.dictValue, i.dictLabel]))
    } else {
      delete gettingDictFuture[name]
      return {}
    }
  }
  return {
    value,
    getDictItemsByName,
    getDictByName,
  }
})
