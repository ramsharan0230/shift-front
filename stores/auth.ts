import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useLocalStorage('jwt_token', ''),
    refreshToken: useLocalStorage('refresh_token', ''),
  }),
  actions: {
    async login(email: string, password: string) {
      const { data } = await $axios.post('/auth/login', { email, password });
      this.token = data.token;
      this.refreshToken = data.refresh_token;
      this.user = data.user;
    },
    async register(name: string, email: string, password: string) {
      await $axios.post('/auth/register', { name, email, password });
    },
    async logout() {
      await $axios.post('/auth/logout');
      this.$reset();
    },
    async refresh() {
      const { data } = await $axios.post('/auth/refresh', {
        refresh_token: this.refreshToken,
      });
      this.token = data.token;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});