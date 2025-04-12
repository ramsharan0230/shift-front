import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated && to.path !== '/auth/login') {
    navigateTo('/auth/login');
  }
});