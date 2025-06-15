import { defineStore } from "pinia";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
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
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        const data = await response.json();
        this.user = data.user;
      } catch (error) {
        this.error = error.message;
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
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST" });
        this.user = null;
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    },
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          credentials: "include", // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        this.user = data.user;
      } catch (error) {
        this.user = null; // Clear user if not authenticated
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
