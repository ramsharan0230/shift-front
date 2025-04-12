import axios from 'axios'
import ApiService from '../utils/ApiService'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.baseURL,
    headers: {
      Accept: 'application/json'
    },
    withCredentials: true
  })

  axiosInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem('token') 
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  })

  const api = new ApiService(axiosInstance)

  return {
    provide: {
      axios: axiosInstance,
      api
    }
  }
})
