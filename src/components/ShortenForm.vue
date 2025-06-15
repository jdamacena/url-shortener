<template>
  <form @submit.prevent="onSubmit">
    <input v-model="url" type="url" name="url" required placeholder="Paste your long URL here..." class="w-full p-3 border rounded mb-4" />
    <input v-model="expiresAt" type="datetime-local" name="expiresAt" class="w-full p-3 border rounded mb-4" />
    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 shadow transition">Shorten</button>
    <div v-if="result" class="mt-4 text-center">
      <span v-if="result.shortUrl" class="font-semibold">Shortened URL:</span>
      <a v-if="result.shortUrl" :href="result.shortUrl" class="text-blue-600 underline" target="_blank">{{ result.shortUrl }}</a>
      <span v-if="result.error" class="text-red-600">{{ result.error }}</span>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ShortenForm',
  setup() {
    const url = ref('')
    const expiresAt = ref('')
    const result = ref(null)

    async function onSubmit() {
      result.value = null
      try {
        const params = new URLSearchParams()
        params.append('url', url.value)
        params.append('expiresAt', expiresAt.value)
        const res = await fetch('/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        })
        const data = await res.json()
        result.value = data
      } catch (err) {
        result.value = { error: 'An error occurred. Please try again.' }
      }
    }

    return { url, expiresAt, result, onSubmit }
  }
}
</script>
