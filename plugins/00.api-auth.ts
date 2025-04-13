import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const token = auth.getToken

  const { $api } = useNuxtApp()

  if ($api && token) {
    $api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
})
