// https://github.com/varletjs/axle
import { createAxle, requestHeadersInterceptor } from '@varlet/axle'
import { createApi } from '@varlet/axle/api'
import { createUseAxle } from '@varlet/axle/use'
import { getToken } from '@/utils/auth'
import sleep from '@/utils/sleep'

export const axle = createAxle({
  baseURL: import.meta.env.BASE_URL + import.meta.env.VITE_API_BASE,
})

axle.axios.defaults.timeout = 1e4

axle.useRequestInterceptor(
  requestHeadersInterceptor({
    headers: () => ({
      Authorization: 'Bearer ' + getToken(),
    }),
  }),
)

axle.useResponseInterceptor({
  async onFulfilled(response) {
    const { code, msg } = response.data
    if (code !== 200 && msg) {
      // Snackbar.warning({ content: msg, duration: 1e9 })
      Snackbar.warning(msg)
      await sleep(code)
      if ([401, 403].includes(code)) {
        // 未登入
        const snapAppRouter = useAppRouter()
        if (!snapAppRouter.route.path.endsWith('sign-in')) {
          snapAppRouter.pushStack('sign-in')
        }
      }
    }
    return response.data
  },

  onRejected(error) {
    Snackbar.error(error.message)
    return Promise.reject(error)
  },
})

export const useAxle = createUseAxle({
  axle,
  onTransform: (response) => response.data,
})

export const api = createApi(axle, useAxle)
