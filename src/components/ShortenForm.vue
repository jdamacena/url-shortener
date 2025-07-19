<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="relative">
      <input v-model="url" type="text" name="url" required placeholder="Enter URL (e.g., google.com, www.example.com)"
        :disabled="isLoading"
        class="w-full p-4 border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400" />
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>
    </div>

    <!-- URL validation message -->
    <div v-if="!isValidUrl && url.trim()" class="text-sm text-red-600 flex items-center">
      <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      Please enter a valid URL (e.g., google.com, www.example.com)
    </div>

    <div class="flex items-center">
      <input id="no-expire" type="checkbox" v-model="noExpire" :disabled="isLoading"
        class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50" />
      <label for="no-expire" class="text-gray-700 select-none cursor-pointer text-sm font-medium">Link does not
        expire</label>
    </div>

    <div v-if="!noExpire" class="space-y-3">
      <label for="expiresAt" class="block text-gray-700 text-sm font-medium">Expiration date and time</label>

      <!-- Quick expiration buttons -->
      <div class="flex flex-wrap gap-2">
        <span class="text-xs text-gray-500 self-center mr-2">Quick select:</span>
        <button v-for="option in quickExpirationOptions" :key="option.label" type="button"
          @click="setQuickExpiration(option.hours)"
          class="px-3 py-1 text-xs font-medium rounded-full border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform hover:scale-105 active:scale-95">
          {{ option.label }}
        </button>
      </div>

      <!-- DateTime input with validation -->
      <div class="relative">
        <input v-model="expiresAt" id="expiresAt" type="datetime-local" name="expiresAt" :disabled="isLoading"
          :min="minDateTime"
          class="w-full p-4 border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
      </div>

      <!-- Validation message -->
      <div v-if="!isValidExpiration && expiresAt" class="text-sm text-red-600 flex items-center">
        <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        Expiration date must be in the future
      </div>

      <!-- Helpful hint -->
      <div v-else-if="expiresAt" class="text-sm text-gray-500 flex items-center">
        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Link will expire on {{ new Date(expiresAt).toLocaleString() }}
      </div>
    </div>

    <button type="submit" :disabled="isLoading || !url.trim() || !isValidUrl || !isValidExpiration"
      class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg p-4 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
      <span v-if="isLoading" class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Creating short link...
      </span>
      <span v-else>Shorten URL</span>
    </button>
    <!-- Result Display -->
    <div v-if="result" class="mt-6">
      <!-- Success State -->
      <div v-if="result.shortUrl" class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <div class="flex items-center text-green-800">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-semibold">Short link created successfully!</span>
        </div>

        <div class="bg-white border border-green-200 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <a :href="result.shortUrl" class="text-blue-600 hover:text-blue-800 underline font-medium truncate mr-3"
              target="_blank">
              {{ result.shortUrl }}
            </a>
            <button @click="copyToClipboard" :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transform hover:scale-105 active:scale-95',
              copied ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            ]" :title="copied ? 'Copied!' : 'Copy to clipboard'">
              <svg v-if="copied" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <div v-if="result.expiresAt" class="text-sm text-green-700">
          <span class="font-medium">Expires:</span> {{ new Date(result.expiresAt).toLocaleString() }}
        </div>
      </div>

      <!-- Error State -->
      <div v-if="result.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center text-red-800">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ result.error }}</span>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed } from 'vue'
import { useUrlStore } from '../stores/urlStore'

export default {
  name: 'ShortenForm',
  setup() {
    const urlStore = useUrlStore()
    const url = ref('')
    const expiresAt = ref('')
    const noExpire = ref(true)
    const result = ref(null)
    const isLoading = ref(false)
    const copied = ref(false)

    // Set minimum datetime to current time
    const minDateTime = computed(() => {
      const now = new Date()
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    })

    // Validate expiration date
    const isValidExpiration = computed(() => {
      if (noExpire.value || !expiresAt.value) return true
      const expireDate = new Date(expiresAt.value)
      const now = new Date()
      return expireDate > now
    })

    // Validate and normalize URL
    const isValidUrl = computed(() => {
      if (!url.value.trim()) return true // Empty is valid (required handled by HTML)

      const cleanUrl = url.value.trim()

      // Must contain at least one dot for domain.extension
      if (!cleanUrl.includes('.')) return false

      // More strict pattern requiring proper domain structure
      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*(?:\/[^\s]*)?$/

      return urlPattern.test(cleanUrl)
    })

    function normalizeUrl(inputUrl) {
      let cleanUrl = inputUrl.trim()

      // If it already has a protocol, return as is
      if (cleanUrl.match(/^https?:\/\//i)) {
        return cleanUrl
      }

      // Add https:// if no protocol is present
      if (!cleanUrl.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
        cleanUrl = 'https://' + cleanUrl
      }

      return cleanUrl
    }

    // Quick expiration options
    const quickExpirationOptions = [
      { label: '1 hour', hours: 1 },
      { label: '1 day', hours: 24 },
      { label: '1 week', hours: 24 * 7 },
      { label: '1 month', hours: 24 * 30 }
    ]

    function setQuickExpiration(hours) {
      const future = new Date()
      future.setHours(future.getHours() + hours)
      // Format for datetime-local input
      expiresAt.value = new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    }

    async function onSubmit() {
      if (isLoading.value) return

      // Validate URL format
      if (!isValidUrl.value) {
        result.value = { error: 'Please enter a valid URL.' }
        return
      }

      // Validate expiration date before submitting
      if (!isValidExpiration.value) {
        result.value = { error: 'Expiration date must be in the future.' }
        return
      }

      isLoading.value = true
      result.value = null
      copied.value = false

      try {
        // Normalize the URL before sending
        const normalizedUrl = normalizeUrl(url.value)
        const newUrl = await urlStore.shortenUrl(normalizedUrl, noExpire.value ? null : expiresAt.value)
        await urlStore.fetchUrls()
        let shortUrl = newUrl.shortUrl
        if (!shortUrl && newUrl.shortId) {
          if (!import.meta.env.VITE_SITE_URL) {
            throw new Error('VITE_SITE_URL environment variable is required but not set')
          }
          shortUrl = `${import.meta.env.VITE_SITE_URL}/r/${newUrl.shortId}`
        }
        result.value = { ...newUrl, shortUrl }
        if (result.value.shortUrl) {
          url.value = ''
          expiresAt.value = ''
          noExpire.value = true
        }
      } catch (err) {
        result.value = { error: 'An error occurred. Please try again.' }
      } finally {
        isLoading.value = false
      }
    }

    function copyToClipboard() {
      if (result.value?.shortUrl) {
        navigator.clipboard.writeText(result.value.shortUrl)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      }
    }

    return { url, expiresAt, noExpire, result, onSubmit, isLoading, copied, copyToClipboard, minDateTime, isValidExpiration, isValidUrl, quickExpirationOptions, setQuickExpiration }
  }
}
</script>
