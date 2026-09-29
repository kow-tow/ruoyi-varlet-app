import dayjs from 'dayjs'

// 判断当前时间属于哪个时段
export function getTimePeriod() {
  const hour = dayjs().hour() // 获取当前小时（0-23）

  if (hour >= 0 && hour < 6) {
    return '凌晨'
  } else if (hour >= 6 && hour < 12) {
    return '上午'
  } else if (hour >= 12 && hour < 14) {
    return '中午' // 12:00-13:59 视为中午
  } else if (hour >= 14 && hour < 18) {
    return '下午'
  } else {
    return '晚上'
  }
}
