import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 设定一个独一无二的key
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 读取时间戳的方法，在请求拦截器处，要注入token的时候读取
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 存时间戳的方法,登录成功时候存时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
