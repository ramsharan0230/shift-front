import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
    refreshToken: '',
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post('/auth/login', { email, password });
        const { user, token, refresh_token, expires_in } = response.data;
        const expiryTime = Date.now() + expires_in * 1000;

        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token_expiry', expiryTime.toString());

        this.token = token;
        this.refreshToken = refresh_token;
        this.user = user;

        return response.data;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async logout($api: any) {
        this.user = null;
        this.token = '';
        this.refreshToken = '';

        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiry');
        $api.defaults.headers.common['Authorization'] = '';
      },
    },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
  },
  persist: true,
});
