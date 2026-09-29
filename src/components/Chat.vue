<script setup lang="ts">
import { type OrderSelectChatRecord } from '@/apis/order'

// import { fetchA, refetchA } from "./api"
// import dayjs from "dayjs"

// const input = ref('')

const modelValue = defineModel<OrderSelectChatRecord[]>('modelValue', { default: () => [] })

/*let $this
onMounted(() => {
  // setitem(historicalChatRecords, [], JSON.parse(sessionStorage.getItem('historicalChatRecords') || '[]'))
  updateTime()
  // sendQInit()
  $this = getCurrentInstance()
})*/

/*onUnmounted(() => {
  updateLastTime()
  sessionStorage.setItem('historicalChatRecords', JSON.stringify(historicalChatRecords))
})*/

/*watch(historicalChatRecords, () => {
  if ($this.refs.historicalChatRecordsDom?.length) {
    nextTick(() => {
      $this.refs.historicalChatRecordsDom.at(-1).scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    })
  }
})*/

/*const updateTime = () => {
  historicalChatRecords.push({
    type: 'tim',
    content: dayjs().format('HH:mm')
  })
}*/
/*const updateLastTime = () => {
  if (historicalChatRecords.at(-1).type === 'tim') {
    historicalChatRecords.pop()
  }
}*/

/*const sendQInit = async () => {
  if (historicalChatRecords.filter(chat => chat.type !== 'tim').length) return
  const { data } = await fetchA()
  historicalChatRecords.push({
    type: 'A',
    aType: data.type,
    subTitle: data.subTitle || '',
    title: data.title,
    problemList: data.problemList
  })
}*/

/*const sendQ = async () => {
  if (input.value) {
    historicalChatRecords.push({
      type: 'Q',
      content: input.value
    })
    const { data } = await fetchA(input.value)
    historicalChatRecords.push({
      type: 'A',
      aType: data.type,
      subTitle: data.subTitle || '',
      title: data.title,
      answer: data.answer || '',
      problemList: (data.type > 1) ? data.problemList : data.serviceList.map(app => ({ serviceId: app.id, serviceName: app.serviceName }))
    })
  }
  input.value = ''
}*/

/*const reSendQ = async (answer) => {
  historicalChatRecords.push({
    type: 'Q',
    content: answer.title
  })
  const { data } = await refetchA(answer.id)
  const serviceNames = data.serviceName.split(",")
  const serviceIds = data.serviceId.split(",")
  historicalChatRecords.push({
    type: 'A',
    aType: 1,
    title: data.title,
    answer: data.answer || '',
    problemList: serviceIds.map((v, i) => ({ serviceId: v, serviceName: serviceNames[i] || `${t('W1374') ?? '未命名'}${data.tags}` }))
  })
}*/
</script>
<template>
  <section class="bot_chat">
    <div class="body">
      <div v-for="(chat, index) of modelValue" :key="index" ref="historicalChatRecordsDom" :class="chat.type">
        <!--span>{{ chat.content }}</span-->
        <div v-if="chat.type === 'doctor'" class="avatar"></div>
        <div v-if="chat.type === 'doctor'" class="chat">
          <p>{{ chat.content }}</p>
          <!--div v-html="chat.content"></div-->
          <!--details open="open">
            <summary>{{ chat.aType === 1 ? ('W1490') : chat.subTitle }}</summary>
            <ol>
              <li v-for="answer of chat.problemList" :key="answer.id">
                <span v-if="chat.aType > 1" @click="reSendQ(answer)">{{ answer.title }}</span>
                <span v-else @click="router.push(answer.serviceId)">{{ answer.serviceName }}</span>
              </li>
            </ol>
          </details-->
        </div>
        <div v-if="chat.type === 'patient'" class="chat">{{ chat.content }}</div>
      </div>
    </div>
    <!--footer>
      <div>
        <input :placeholder="'想知道什么可以问小爱，小爱都知道呢'" v-model="input" @keyup.enter="sendQ" />
        <var-button type="primary" @click="sendQ">
          <var-icon name="window-close" />
        </var-button>
      </div>
    </footer-->
  </section>
</template>

<style lang="less" scoped>
section {
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
}

.chat {
  word-break: break-all;
  text-align: left;
}

.body {
  flex: auto;
  height: 0;
  overflow-y: auto;
  padding: 4px;

  & > div {
    margin-bottom: 24px;
  }

  & > .doctor {
    color: var(--color-text);
    font-size: 14px;
    text-align: center;
    margin-bottom: 8px;
  }

  & > .patient {
    display: flex;
    justify-content: flex-end;
  }

  & > .patient > .chat {
    width: 234px;
    background: var(--color-primary);
    box-shadow: 0px 18px 16px -12px hsla(var(--hsl-primary), 0.1);
    border-radius: 12px;
    color: var(--color-on-primary);
    box-sizing: border-box;
    padding: 12px;
  }

  & > .doctor {
    display: flex;
  }

  & > .doctor > .avatar {
    width: 32px;
    margin-right: 8px;
    height: 32px;
    background: url('@/assets/images/profile.png') no-repeat;
    background-size: 100% 100%;
    filter: drop-shadow(0 4px 8px hsla(var(--hsl-primary), 0.1));
  }

  & > .doctor > .chat {
    background-color: hsla(var(--hsl-primary), 0.3);
    border-radius: 12px;
    font-size: 14px;
    flex: 1;
    padding: 12px;
  }

  /*& > .doctor > .chat p {
      padding-bottom: 12px;
      border-bottom: 1px solid #e6ecf1;
    }

    & > .doctor > .chat summary {
      padding: 12px 0 8px 0;
      font-weight: 500;
      color: var(--color-primary);
      list-style: none;

      &::-webkit-details-marker {
        display: none;
      }
    }

    & > .doctor > .chat ol {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0;
      margin: 0;
    }

    & > .doctor > .chat li {
      list-style-type: decimal;
      display: list-item;
      margin: 0 16px;
    }*/
}

footer {
  background-color: #fff;
  height: 72px;
  padding: 4px;
  box-sizing: border-box;

  div {
    background-color: hsla(var(--hsl-primary), 0.1);
    border-radius: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    input {
      background-color: hsla(var(--hsl-primary), 0.3);
      font-size: 14px;
      height: 16px;
      width: 0;
      flex: 1;
      border: none;
      margin: 0 12px;
    }

    button {
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--color-primary);
      box-shadow: 0 4px 16px 1px rgba(3, 72, 168, 0.32);
      margin: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
