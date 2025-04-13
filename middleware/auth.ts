import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware( async (to, from) => {
  const auth = useAuthStore();
  await nextTick()
  if (!auth.isAuthenticated && to.path !== '/auth/login') {
    navigateTo('/auth/login');
  }
});