import { apiGetInfo, apiLogin, apiLogout } from '@/apis/auth'
import { apiDoctorList } from '@/apis/doctor'
import defAva from '@/assets/images/profile.png'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { isEmpty, isHttp } from '@/utils/validate'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const id = ref(NaN)
  const name = ref('')
  const nickName = ref<string | null>(null)
  const avatar = ref('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const isDoctor = computed(() => permissions.value.includes('system:dotocr:list') && roles.value.includes('doctor'))
  const isSignature = ref(true)
  async function login(userInfo: {
    username: string
    password: string
    code: string
    uuid: string
    [k: string]: any
    openid: string | null
  }) {
    const res = await apiLogin.load(userInfo)
    if (res.code === 200) {
      setToken(res.token)
      token.value = res.token
      await getInfo()
    } else {
      throw Error(res.msg)
    }
    return res
  }
  /** WITH EFFECT ACTIVE */
  async function getInfo() {
    const res = await apiGetInfo.load()
    if (res.code !== 200) {
      throw Error(res.msg)
    }
    const user = res.user
    if (res.roles && res.roles.length > 0) {
      roles.value = res.roles
      permissions.value = res.permissions
    } else {
      roles.value = ['ROLE_DEFAULT']
    }
    id.value = user.userId
    name.value = user.userName
    nickName.value = user.nickName
    let _avatar = user.avatar || ''
    if (!isHttp(_avatar)) {
      // _avatar = isEmpty(_avatar) ? defAva : import.meta.env.BASE_URL + _avatar
      if (isEmpty(_avatar)) {
        if (isDoctor.value) {
          const get_doctors_list_res = await apiDoctorList.load()
          if (get_doctors_list_res.code === 200) {
            const row = get_doctors_list_res.rows[0]
            if (get_doctors_list_res.rows.length === 1 && row.userId === id.value) {
              _avatar = row.imgBase64 || defAva
            } else {
              _avatar = defAva
            }
          } else {
            _avatar = defAva
          }
        } else {
          _avatar = defAva
        }
      }
    }
    avatar.value = _avatar
    if (isDoctor.value) {
      isSignature.value = !res.isSignature
    }
    if (window.InjectApi) {
      const fun = 'fun_' + new Date().getTime()
      Reflect.set(window, 'fun', function (result: any) {
        console.log('window.InjectApi.startSocket', result)
      })
      const json = { userId: user.userId }
      const flag = window.InjectApi.startSocket(JSON.stringify(json), fun)
      console.log('window.InjectApi.startSocket', flag)
    }
    return res
  }
  async function logOut() {
    await apiLogout.load()
    id.value = NaN
    name.value = ''
    nickName.value = null
    avatar.value = ''
    token.value = ''
    roles.value = []
    permissions.value = []
    isSignature.value = true
    removeToken()
  }

  return {
    token,
    id,
    name,
    nickName,
    avatar,
    roles,
    permissions,
    isDoctor,
    isSignature,
    login,
    getInfo,
    logOut,
  }
})
