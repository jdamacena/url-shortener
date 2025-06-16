<template>
  <div class="max-w-3xl mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">Your Shortened URLs</h2>
    <div v-if="urlStore.loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="urlStore.urls.length === 0" class="text-center text-gray-500">No URLs found. Start by shortening a URL!</div>
    <div v-else>
      <table class="w-full bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-blue-100">
            <th class="p-3 text-left">Short URL</th>
            <th class="p-3 text-left">Original URL</th>
            <th class="p-3 text-center">Clicks</th>
            <th class="p-3 text-center">Active</th>
            <th class="p-3 text-center">Analytics</th>
            <th class="p-3 text-center">Copy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="url in urlStore.urls" :key="url._id" :class="{'bg-gray-50': !url.active}">
            <td class="p-3">
              <a :href="`${BACKEND_BASE_URL}/${url.shortUrl}`" target="_blank" class="text-blue-700 underline">{{ BACKEND_BASE_URL.replace('http://', '').replace('https://', '') }}/{{ url.shortUrl }}</a>
            </td>
            <td class="p-3 truncate max-w-xs" :title="url.originalUrl">{{ url.originalUrl }}</td>
            <td class="p-3 text-center">{{ url.clickCount }}</td>
            <td class="p-3 text-center">
              <button @click="toggleActive(url)" :class="url.active ? 'text-green-600' : 'text-red-600'">
                {{ url.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="p-3 text-center">
              <router-link :to="`/analytics/${url.shortUrl}`" class="text-blue-500 underline">View</router-link>
            </td>
            <td class="p-3 text-center">
              <button
                @click="copyLink(url)"
                :class="copiedUrl === url.shortUrl ? 'text-blue-600' : ''"
                :title="copiedUrl === url.shortUrl ? 'Copied!' : 'Copy link'"
                class="copy-link-btn underline"
              >Copy</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="urlStore.error" class="mt-4 text-red-600 text-center">{{ urlStore.error }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUrlStore } from '../stores/urlStore'
import { useAuthStore } from '../stores/authStore'

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:3000';

export default {
  name: 'Dashboard',
  setup() {
    const urlStore = useUrlStore()
    const authStore = useAuthStore()
    const copiedUrl = ref(null)

    onMounted(() => {
      if (authStore.user) {
        urlStore.fetchUrls()
      }
    })

    async function toggleActive(url) {
      try {
        await urlStore.toggleActive(url)
      } catch (e) {
        // error handled in store
      }
    }

    function copyLink(url) {
      const link = `${BACKEND_BASE_URL}/${url.shortUrl}`
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
