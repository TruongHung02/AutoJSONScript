import axios from 'axios'
import https from 'https'

const axiosInstance = axios.create({
  timeout: 5000, // Timeout sau 5 giây
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Bỏ qua SSL nếu cần (chỉ dùng khi dev)
  }),
})

export default axiosInstance
