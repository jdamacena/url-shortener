import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        })
        if (!response.ok) {
          throw new Error('Invalid credentials')
        }
        const data = await response.json()
        this.user = data.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        })
        if (!response.ok) {
          throw new Error('Registration failed')
        }
        const data = await response.json()
        this.user = data.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
        this.user = null
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },

    async checkAuth() {
      try {
        const response = await fetch('/api/auth/user')
        if (response.ok) {
          const data = await response.json()
          this.user = data.user
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
  }
})
