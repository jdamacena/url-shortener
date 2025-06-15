<template>
  <div class="flex justify-center items-center min-h-screen">
    <form class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" @submit.prevent="login">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
      <div class="mb-4">
        <label class="block mb-2 text-gray-700">Username</label>
        <input v-model="username" type="text" required class="w-full p-3 border rounded" />
      </div>
      <div class="mb-6">
        <label class="block mb-2 text-gray-700">Password</label>
        <input v-model="password" type="password" required class="w-full p-3 border rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 shadow transition">Login</button>
      <div v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</div>
      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-700 underline">Don't have an account? Register</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')

    async function login() {
      error.value = ''
      try {
        await authStore.login(username.value, password.value)
        router.push('/dashboard')
      } catch (e) {
        error.value = e?.message || 'Login failed.'
      }
    }

    return { username, password, error, login }
  }
}
</script>

<style scoped>
.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.items-center {
    align-items: center;
}

.min-h-screen {
    min-height: 100vh;
}

.bg-white {
    background-color: white;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.rounded-lg {
    border-radius: 0.5rem;
}

.p-8 {
    padding: 2rem;
}

.w-full {
    width: 100%;
}

.max-w-md {
    max-width: 28rem;
}

.text-2xl {
    font-size: 1.5rem;
}

.font-bold {
    font-weight: 700;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.text-center {
    text-align: center;
}

.text-blue-700 {
    color: #1d4ed8;
}

.mb-4 {
    margin-bottom: 1rem;
}

.block {
    display: block;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.text-gray-700 {
    color: #374151;
}

.w-full {
    width: 100%;
}

.p-3 {
    padding: 0.75rem;
}

.border {
    border-width: 1px;
}

.rounded {
    border-radius: 0.25rem;
}

.bg-blue-500 {
    background-color: #3b82f6;
}

.hover\:bg-blue-600:hover {
    background-color: #2563eb;
}

.text-white {
    color: white;
}

.font-bold {
    font-weight: 700;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.p-3 {
    padding: 0.75rem;
}

.shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition {
    transition: background-color 0.2s;
}

.mt-4 {
    margin-top: 1rem;
}

.text-red-600 {
    color: #dc2626;
}

.underline {
    text-decoration: underline;
}
</style>
