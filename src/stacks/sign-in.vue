<script setup lang="ts">
import { Form } from '@varlet/ui'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { apiGetCaptchaImage } from '@/apis/auth'
import { useUserStore } from '@/store/user'
import { decrypt, encrypt } from '@/utils/crypt'

const { pushStack, backStack, route, router } = useAppRouter()
const user = useUserStore()
const form = ref<Form>()
const captchaRef = useTemplateRef('captchaRef')
const isViewPassword = ref(false)
const account = reactive({
  username: '',
  password: '',
  code: '',
  uuid: '',
})
const isRememberMe = ref(false)
function rememberMe() {
  if (isRememberMe.value) {
    Cookies.set('username', account.username, { expires: 30 })
    Cookies.set('password', encrypt(account.password) || '', { expires: 30 })
    Cookies.set('rememberMe', isRememberMe.value ? '1' : '', { expires: 30 })
  } else {
    //if (account.username === Cookies.get('username')) {
    //  resetMemory()
    //}
    resetMemory()
  }
}
/**ONLY EFFECT */
function readMemory() {
  const username = Cookies.get('username')
  if (!username) {
    return
  }
  account.username = username
  account.password = decrypt(Cookies.get('password')) || ''
  isRememberMe.value = Cookies.get('rememberMe') === '1'
}
/**ONLY EFFECT */
function resetMemory() {
  Cookies.remove('username')
  Cookies.remove('password')
  Cookies.remove('rememberMe')
}
const ws = useHeartbeat()
async function submit() {
  const valid = await form.value?.validate()
  if (valid) {
    try {
      const res = await user.login({ ...account, openid: (route.query.openid as string) ?? void 0 })
      ws.init(user.id)
      Snackbar.success(res.msg)
      rememberMe()
      if (user.isDoctor && !user.isSignature) {
        const state = await Dialog({
          message: '仲未设置签名，是否前往',
        })
        if (state === 'confirm') {
          router.push('/home/own-signature')
          return
        }
      }
      backStack(void 0, true)
    } catch (error) {
      console.error(error)
      refreshCaptcha()
    }
  }
}

const captchaSrc = ref('')
const captchaIsShowPreview = ref(false)
async function refreshCaptcha() {
  account.code = ''
  const res = await apiGetCaptchaImage.load()
  if (res.code === 200) {
    account.uuid = res.uuid
    captchaSrc.value = `data:image/gif;base64,${res.img}`
  } else {
    captchaSrc.value = ''
  }
}

async function popupCaptchaActions() {
  captchaRef.value?.blur()
  const action = await ActionSheet({
    title: '看不清？',
    actions: [
      {
        name: '查看验证码大图',
        icon: 'view-outline',
        disabled: captchaSrc.value === '',
      },
      {
        name: '更换一个验证码算式',
        icon: 'refresh',
      },
    ],
  })
  if (action !== 'close') {
    switch (action.icon) {
      case 'view-outline':
        captchaIsShowPreview.value = true
        break
      case 'refresh':
        refreshCaptcha()
        break
      default:
        break
    }
  }
}

onMounted(refreshCaptcha)
onMounted(readMemory)
</script>

<template>
  <router-stack>
    <div class="sign-in flex flex-col items-center justify-center">
      <app-header title="登入"></app-header>
      <var-form ref="form" class="sign-in-form">
        <var-space direction="column" :size="['8vmin', 0]">
          <var-input
            v-model="account.username"
            variant="outlined"
            placeholder="请输入用户名"
            :rules="z.string().min(1, '用户名不能为空')"
          >
            <template #prepend-icon>
              <var-icon class="sign-in-form-input-icon" name="account-circle" />
            </template>
          </var-input>
          <var-input
            v-model="account.password"
            variant="outlined"
            placeholder="请输入密码"
            :rules="z.string().min(1, '密码不能为空')"
            :type="isViewPassword ? 'text' : 'password'"
          >
            <template #prepend-icon>
              <var-icon class="sign-in-form-input-icon" name="lock" />
            </template>
            <template #append-icon>
              <var-icon
                class="sign-in-form-input-icon"
                :name="isViewPassword ? 'view' : 'view-outline'"
                @click="isViewPassword = !isViewPassword"
              />
            </template>
          </var-input>
          <var-input
            ref="captchaRef"
            v-model="account.code"
            variant="outlined"
            placeholder="请输入验证码"
            :rules="z.string().min(1, '验证码不能为空')"
            style="
              --field-decorator-outlined-normal-icon-margin-top: 4px;
              --field-decorator-outlined-normal-icon-margin-bottom: 4px;
              --field-decorator-outlined-normal-padding-right: 4px;
            "
          >
            <template #append-icon>
              <img v-if="captchaSrc" width="128" height="48" :src="captchaSrc" @click="popupCaptchaActions" />
            </template>
          </var-input>
          <var-space class="sign-in-form-text" justify="space-between" align="center">
            <var-checkbox v-model="isRememberMe">记住我</var-checkbox>
            <span v-if="false" @click="pushStack('forgot-password')">忘记密码？</span>
          </var-space>
          <var-button type="primary" block size="large" auto-loading @click="submit">登入</var-button>
          <var-space v-if="false" class="sign-in-form-text" justify="center" @click="pushStack('sign-up')">
            去注册
          </var-space>
        </var-space>
      </var-form>
    </div>
    <var-image-preview v-model:show="captchaIsShowPreview" :images="[captchaSrc]" />
  </router-stack>
</template>

<style lang="less" scoped>
.sign-in {
  padding: calc(80px + var(--app-bar-height)) 0 60px;

  &-form {
    width: 280px;
    margin-top: 50px;

    &-input-icon {
      margin-right: 10px;
      font-size: 24px;
    }

    &-text {
      font-size: 14px;
      color: var(--color-primary);
    }
  }
}
</style>
