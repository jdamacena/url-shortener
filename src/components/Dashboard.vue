<template>
  <div class="max-w-3xl mx-auto mt-10">
    <ShortenForm class="py-8" />
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">Your Shortened URLs</h2>
    <div v-if="urlStore.loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="urlStore.urls.length === 0" class="text-center text-gray-500">No URLs found. Start by shortening a
      URL!</div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="w-full bg-white shadow rounded-lg min-w-0">
          <thead class="hidden md:table-header-group">
            <tr class="bg-blue-100">
              <th class="p-3 text-left">Short URL</th>
              <th class="p-3 text-left">Original URL</th>
              <th class="p-3 text-center">Clicks</th>
              <th class="p-3 text-center">Active</th>
              <th class="p-3 text-center">Analytics</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="url in urlStore.urls" :key="url._id"
              :class="{ 'bg-gray-50': !url.active, 'block md:table-row w-full mb-4 md:mb-0 rounded-lg shadow md:shadow-none': true }">
              <td
                class="p-3 flex flex-col md:flex-row items-start md:items-center gap-2 max-w-full md:max-w-none block md:table-cell">
                <span class="font-semibold md:hidden">Short URL:</span>
                <a :href="`${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`" target="_blank"
                  class="text-blue-700 underline whitespace-nowrap">
                  /r/{{ url.shortId || url.shortUrl }}
                </a>
                <button @click="copyLink(url)" :class="[
                  'ml-0 md:ml-2 px-2 py-1 rounded transition-colors focus:outline-none flex items-center gap-1',
                  copiedUrl === url.shortUrl ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800'
                ]" :title="copiedUrl === url.shortUrl ? 'Copied!' : 'Copy link'">
                  <svg v-if="copiedUrl === url.shortUrl" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 4H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2V4h6V2" />
                  </svg>
                  <span v-if="copiedUrl === url.shortUrl">Copied!</span>
                  <span v-else>Copy</span>
                </button>
                <span v-if="url.expiresAt && new Date(url.expiresAt) < new Date()"
                  class="ml-0 md:ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
              </td>
              <td class="p-3 truncate max-w-full md:max-w-xs block md:table-cell" :title="url.originalUrl">
                <span class="font-semibold md:hidden">Original URL:</span>
                {{ url.originalUrl }}
              </td>
              <td class="p-3 text-left md:text-center block md:table-cell">
                <span class="font-semibold md:hidden">Clicks:</span>
                {{ url.clickCount }}
              </td>
              <td class="p-3 text-left md:text-center block md:table-cell">
                <span class="font-semibold md:hidden">Active:</span>
                <button @click="toggleActive(url)"
                  class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                  :class="url.active ? 'bg-green-400' : 'bg-gray-300'" :aria-pressed="url.active"
                  :title="url.active ? 'Deactivate' : 'Activate'">
                  <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="url.active ? 'translate-x-6' : 'translate-x-1'"></span>
                  <span class="sr-only">Toggle Active</span>
                </button>
              </td>
              <td class="p-3 text-left md:text-center block md:table-cell">
                <span class="font-semibold md:hidden">Analytics:</span>
                <router-link :to="`/analytics/${url.shortUrl}`" class="text-blue-500 underline">View</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="urlStore.error" class="mt-4 text-red-600 text-center">{{ urlStore.error }}</div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import ShortenForm from './ShortenForm.vue'
import { useUrlStore } from '../stores/urlStore'
import { useAuthStore } from '../stores/authStore'

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:3000';

export default {
  name: 'Dashboard',
  components: { ShortenForm },
  setup() {
    const urlStore = useUrlStore()
    const authStore = useAuthStore()
    const copiedUrl = ref(null)

    onMounted(() => {
      if (authStore.user) {
        urlStore.fetchUrls()
      }
    })

    // Watch for user becoming available after async fetch
    watch(
      () => authStore.user,
      (user) => {
        if (user) {
          urlStore.fetchUrls()
        }
      },
      { immediate: false }
    )

    async function toggleActive(url) {
      try {
        await urlStore.toggleActive(url)
      } catch (e) {
        // error handled in store
      }
    }

    function copyLink(url) {
      const link = `${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`
      navigator.clipboard.writeText(link)
      copiedUrl.value = url.shortUrl
      setTimeout(() => {
        if (copiedUrl.value === url.shortUrl) copiedUrl.value = null
      }, 1200)
    }

    return { urlStore, authStore, toggleActive, copyLink, copiedUrl, BACKEND_BASE_URL }
  }
}
</script>
