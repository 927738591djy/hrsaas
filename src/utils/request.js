import axios from 'axios'
const service = axios.create()
service.interceptors.request.use()
service.interceptors.response.user()
export default service

