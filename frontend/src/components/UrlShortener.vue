<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-red shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-10">
      <template v-if="!authStore.user">
        <h1 class="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow">Welcome to URL Shortener</h1>
        <p class="text-lg text-gray-700 mb-6">Easily create and manage short links. Sign up or log in to get started!
        </p>
        <div class="flex justify-center space-x-4 mb-6">
          <router-link to="/login"
            class="bg-blue-500 hover:bg-blue-600 text-white text-center font-bold rounded-lg p-3 w-32 shadow transition">Login</router-link>
          <router-link to="/register"
            class="bg-gray-200 hover:bg-gray-300 text-blue-700 text-center font-bold rounded-lg p-3 w-32 shadow transition">Register</router-link>
        </div>
      </template>
      <template v-else>
        <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-6 drop-shadow">Shorten a URL</h1>
        <ShortenForm />
      </template>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import ShortenForm from './ShortenForm.vue'

export default {
  name: 'UrlShortener',
  components: { ShortenForm },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
