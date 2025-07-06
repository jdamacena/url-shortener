import { defineStore } from "pinia";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          this.error = data.error || "Failed to login";
          throw new Error(this.error);
        }
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          throw new Error("Failed to register");
        }
        const data = await response.json();
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const token = this.token || localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        this.user = data.user;
      } catch (error) {
        this.user = null;
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
