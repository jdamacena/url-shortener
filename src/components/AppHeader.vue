<template>
  <header class="mb-8 py-4 border-b border-blue-100 flex flex-col items-center">
    <nav class="mb-2">
      <router-link to="/" class="mx-2 text-blue-700 font-bold">Home</router-link>
      <router-link v-if="authStore.user" to="/dashboard" class="mx-2 text-blue-700 font-bold">Dashboard</router-link>
    </nav>
    <div v-if="authStore.user" class="text-gray-700 text-sm mt-2">
      Logged in as <span class="font-bold">{{ authStore.user.username }}</span>
      <button @click="logout" class="ml-4 text-red-600 underline">Logout</button>
    </div>
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
