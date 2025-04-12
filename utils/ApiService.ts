import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class ApiService {
  private axios: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axios.get(url, config)
    return res.data
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axios.post(url, data, config)
    return res.data
  }

  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axios.put(url, data, config)
    return res.data
  }

  async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axios.patch(url, data, config)
    return res.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axios.delete(url, config)
    return res.data
  }
}
