import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "",
    refreshToken: "",
    expiresIn: 0,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post("/auth/login", { email, password });
        const { user, token, refresh_token, expires_in } = response.data;

        this.token = token;
        this.refreshToken = refresh_token;
        this.user = user;
        this.expiresIn = Date.now() + expires_in * 1000;

        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || "Login failed";
        throw new Error(message);
      }
    },

    async logout() {
      const { $api } = useNuxtApp();
      try {
        await $api.post("/auth/logout");
      } catch (error: any) {
        const message = "Logout failed"
        throw new Error(message);
      }finally{
        this.$reset();
        localStorage.removeItem("auth");
        delete $api.defaults.headers.common["Authorization"];
        navigateTo("/auth/login");
      }

      this.$reset();
      localStorage.clear();
      delete $api.defaults.headers.common["Authorization"];
      navigateTo("/auth/login");
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
    getToken: (state) => {
      return state.token;
    },
  },
  persist: {
    key: "auth",
    paths: ["user", "token", "refreshToken", "expiresIn"],
  },
});
