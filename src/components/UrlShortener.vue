<template>
  <div class="bg-red shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-10">
    <template v-if="!authStore.user">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow">Welcome to URL Shortener</h1>
      <p class="text-lg text-gray-700 mb-6">Easily create and manage short links. Sign up or log in to get started!</p>
      <div class="flex justify-center space-x-4 mb-6">
        <router-link to="/login" class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 w-32 shadow transition">Login</router-link>
        <router-link to="/register" class="bg-gray-200 hover:bg-gray-300 text-blue-700 font-bold rounded-lg p-3 w-32 shadow transition">Register</router-link>
      </div>
    </template>
    <template v-else>
      <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-6 drop-shadow">Shorten a URL</h1>
      <form @submit.prevent="shortenUrl">
        <input v-model="longUrl" type="url" required placeholder="Paste your long URL here..." class="w-full p-3 border rounded mb-4" />
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 shadow transition">Shorten</button>
      </form>
      <div v-if="shortUrl" class="mt-4 text-center">
        <p class="text-green-700 font-bold">Short URL:</p>
        <a :href="shortUrl" target="_blank" class="text-blue-700 underline">{{ shortUrl }}</a>
      </div>
      <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useUrlStore } from '../stores/urlStore'

export default {
  name: 'UrlShortener',
  setup() {
    const authStore = useAuthStore()
    const urlStore = useUrlStore()
    const longUrl = ref('')
    const shortUrl = ref('')
    const error = ref('')

    async function shortenUrl() {
      error.value = ''
      shortUrl.value = ''
      try {
        const result = await urlStore.shortenUrl(longUrl.value)
        shortUrl.value = result.shortUrl || result.shortId || ''
      } catch (e) {
        error.value = e?.message || 'Failed to shorten URL.'
      }
    }

    return { authStore, urlStore, longUrl, shortUrl, error, shortenUrl }
  }
}
</script>
