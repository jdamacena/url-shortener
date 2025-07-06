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
        <div class="relative">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required
            class="w-full p-3 border rounded pr-10" />
          <button type="button" @click="showPassword = !showPassword" tabindex="-1"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.687A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="mb-6">
        <label class="block mb-2 text-gray-700">Confirm Password</label>
        <div class="relative">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required
            class="w-full p-3 border rounded pr-10" />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none">
            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.687A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
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
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const error = ref('')

    async function register() {
      error.value = ''
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.'
        return
      }
      try {
        await authStore.register(username.value, password.value)
        if (authStore.user && !authStore.error) {
          router.push('/dashboard')
        }
      } catch (e) {
        error.value = authStore.error || e?.message || 'Registration failed.'
      }
    }

    return { username, password, confirmPassword, showPassword, showConfirmPassword, error, register }
  }
}
</script>
