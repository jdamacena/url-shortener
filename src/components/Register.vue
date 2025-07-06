<template>
  <div class="flex justify-center items-center min-h-screen">
    <form class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" @submit.prevent="register">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Register</h2>
      <div class="mb-4">
        <label class="block mb-2 text-gray-700">Username</label>
        <input v-model="username" type="text" required class="w-full p-3 border rounded" />
      </div>
      <div class="mb-6">
        <label class="block mb-2 text-gray-700">Password</label>
        <input v-model="password" type="password" required class="w-full p-3 border rounded" />
      </div>
      <button type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 shadow transition">Register</button>
      <div v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</div>
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-700 underline">Already have an account? Login</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')

    async function register() {
      error.value = ''
      try {
        await authStore.register(username.value, password.value)
        if (authStore.user && !authStore.error) {
          router.push('/dashboard')
        }
      } catch (e) {
        error.value = authStore.error || e?.message || 'Registration failed.'
      }
    }

    return { username, password, error, register }
  }
}
</script>
