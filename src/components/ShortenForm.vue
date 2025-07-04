<template>
  <form @submit.prevent="onSubmit">
    <input v-model="url" type="url" name="url" required placeholder="Paste your long URL here..." class="w-full p-3 border rounded mb-4" />
    <div class="flex items-center mb-4">
      <input id="no-expire" type="checkbox" v-model="noExpire" class="mr-2" />
      <label for="no-expire" class="text-gray-700 select-none">Link does not expire</label>
    </div>
    <div v-if="!noExpire" class="mb-4">
      <label for="expiresAt" class="block text-gray-700 mb-1">Expiration date and time</label>
      <input v-model="expiresAt" id="expiresAt" type="datetime-local" name="expiresAt" class="w-full p-3 border rounded" />
    </div>
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
import { useUrlStore } from '../stores/urlStore'

export default {
  name: 'ShortenForm',
  setup() {
    const urlStore = useUrlStore()
    const url = ref('')
    const expiresAt = ref('')
    const noExpire = ref(true)
    const result = ref(null)

    async function onSubmit() {
      result.value = null
      try {
        await urlStore.shortenUrl(url.value, noExpire.value ? null : expiresAt.value)
        result.value = urlStore.urls[0] // Assume the latest shortened URL is at the top
        if (result.value.shortUrl) {
          url.value = ''
          expiresAt.value = ''
          noExpire.value = true
        }
      } catch (err) {
        result.value = { error: 'An error occurred. Please try again.' }
      }
    }

    return { url, expiresAt, noExpire, result, onSubmit }
  }
}
</script>
