import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  if (auth.isAuthenticated && ['/auth/login', '/auth/register'].includes(to.path)) {
    return navigateTo('/board')
  }
});