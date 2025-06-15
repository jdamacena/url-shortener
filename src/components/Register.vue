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
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 shadow transition">Register</button>
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
        router.push('/dashboard')
      } catch (e) {
        error.value = e?.message || 'Registration failed.'
      }
    }

    return { username, password, error, register }
  }
}
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: 500;
    color: #2c3e50;
}

input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    padding: 0.75rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #3aa876;
}

button:disabled {
    background-color: #a8d5c2;
    cursor: not-allowed;
}

.error {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.login-link {
    text-align: center;
    margin-top: 1rem;
}

.login-link a {
    color: #42b983;
    text-decoration: none;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>
