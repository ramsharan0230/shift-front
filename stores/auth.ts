import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
    refreshToken: '',
    expiresIn: 0,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post('/auth/login', { email, password });
        const { user, token, refresh_token, expires_in } = response.data;

        this.token = token;
        this.refreshToken = refresh_token;
        this.user = user;
        this.expiresIn = Date.now() + expires_in * 1000;

        return response.data;

      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async logout($api: any) {
      this.$reset();
      localStorage.clear();
      delete $api.defaults.headers.common['Authorization'];
      },
    },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
  },
  persist: {
    paths: ['user', 'token', 'refreshToken', 'expiresIn']
  },
});
