<template>
  <header class="bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg py-3 px-6 flex items-center justify-between w-full sticky top-0 z-30">
    <!-- Branding -->
    <router-link to="/" class="flex items-center gap-3 select-none">
      <img src="/favicon.ico" alt="Logo" class="w-8 h-8" />
      <span class="text-white text-2xl font-extrabold tracking-tight drop-shadow">URL Shortener</span>
    </router-link>
    <!-- Navigation -->
    <nav class="flex items-center gap-4">
      <router-link to="/" class="text-white/90 hover:text-white font-semibold px-3 py-2 rounded transition-colors">Home</router-link>
      <router-link v-if="authStore.user" to="/dashboard" class="text-white/90 hover:text-white font-semibold px-3 py-2 rounded transition-colors">Dashboard</router-link>
      <router-link v-if="!authStore.user" to="/login" class="text-white/90 hover:text-white font-semibold px-3 py-2 rounded transition-colors">Login</router-link>
      <router-link v-if="!authStore.user" to="/register" class="text-white/90 hover:text-white font-semibold px-3 py-2 rounded transition-colors">Register</router-link>
      <div v-if="authStore.user" class="flex items-center gap-2 ml-4">
        <span class="text-white/80 text-sm">{{ authStore.user.username }}</span>
        <button @click="logout" class="text-white/80 hover:text-red-200 font-semibold underline px-2 py-1 rounded transition-colors">Logout</button>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore()
    function logout() {
      authStore.logout()
    }
    return { authStore, logout }
  }
}
</script>
