import sleep from '@/utils/sleep'

const webSocket = ref<WebSocket>()
const connectionStatus = ref('未连接')
const pingTimer = ref<number>()
const attempt = ref<number>(0)
const history = reactive<Record<string, { data: number; hasRead?: boolean }>>({
  '11': {
    data: 0,
    hasRead: void 0,
  },
})

export function useHeartbeat() {
  const init = (userId?: number) => {
    if (!userId) {
      return
    }
    if (window.InjectApi) {
      return
    }
    const protocol = {
      'http:': `ws://`,
      'https:': `wss://`,
    }[location.protocol as 'http:' | 'https:']
    const url = `${protocol}${location.host}${import.meta.env.BASE_URL}${import.meta.env.VITE_API_BASE}/ws/getWebSock/${userId}`
    webSocket.value = new WebSocket(url)
    webSocket.value.onopen = () => {
      connectionStatus.value = '已连接'
      pingTimer.value = window.setInterval(() => {
        if (webSocket.value?.readyState === WebSocket.OPEN) {
          webSocket.value.send('ping')
        }
      }, 3e4)
      if (attempt.value === 0) {
        send(
          JSON.stringify({
            type: '001',
          }),
        )
      }
    }
    webSocket.value.onmessage = (event: { data: string }) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === '11') {
          history[11].data = Number.parseInt(data.data)
          history[11].hasRead = false
          Snackbar.warning(`您有${data.data}条处方待审核，请及时处理!`)
        }
      } catch (error) {
        console.warn(`ws: ${event.data}`)
      }
    }
    webSocket.value.onerror = (_event) => {
      connectionStatus.value = '连接失败'
    }

    webSocket.value.onclose = (event) => {
      connectionStatus.value = '未连接'
      clearInterval(pingTimer.value)
      if (event.code === 1006) {
        reconnect(userId)
      }
    }
  }

  async function reconnect(userId: number) {
    const delay = Math.min(3e4, 2 ** attempt.value * 1000)
    attempt.value++
    await sleep(delay)
    init(userId)
  }

  const close = () => {
    if (window.InjectApi) {
      return
    }
    attempt.value = 0
    if (webSocket.value) {
      webSocket.value.close()
      webSocket.value = void 0
    }
  }

  const send = (msg: string) => {
    if (window.InjectApi) {
      console.error('WebSocket has ban in APP')
      return
    }
    if (webSocket.value && webSocket.value.readyState === WebSocket.OPEN) {
      webSocket.value.send(msg)
    } else {
      console.error('WebSocket is not connected')
    }
  }

  return {
    webSocket,
    connectionStatus,
    init,
    close,
    send,
    history,
  }
}
