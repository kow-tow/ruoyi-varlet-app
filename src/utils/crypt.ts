import JSEncrypt from 'jsencrypt'
import pri from '@/assets/keys/pri.key?raw'
import pub from '@/assets/keys/pub.key?raw'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(pub) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt: string | undefined) {
  if (!txt) {
    return false
  }
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(pri) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
