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
          </tr>
        </thead>
        <tbody>
          <tr v-for="url in urlStore.urls" :key="url._id" :class="{'bg-gray-50': !url.active}">
            <td class="p-3">
              <a :href="`/${url.shortUrl}`" target="_blank" class="text-blue-700 underline">/{{ url.shortUrl }}</a>
            </td>
            <td class="p-3 truncate max-w-xs" :title="url.originalUrl">{{ url.originalUrl }}</td>
            <td class="p-3 text-center">{{ url.clicks }}</td>
            <td class="p-3 text-center">
              <button @click="toggleActive(url)" :class="url.active ? 'text-green-600' : 'text-red-600'">
                {{ url.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="p-3 text-center">
              <router-link :to="`/analytics/${url.shortUrl}`" class="text-blue-500 underline">View</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="urlStore.error" class="mt-4 text-red-600 text-center">{{ urlStore.error }}</div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useUrlStore } from '../stores/urlStore'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'Dashboard',
  setup() {
    const urlStore = useUrlStore()
    const authStore = useAuthStore()

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

    return { urlStore, authStore, toggleActive }
  }
}
</script>

<style scoped>
.max-w-3xl {
    max-width: 768px;
}

.mt-10 {
    margin-top: 2.5rem;
}

.text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
}

.font-bold {
    font-weight: 700;
}

.text-blue-700 {
    color: #1d4ed8;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.text-center {
    text-align: center;
}

.text-gray-500 {
    color: #6b7280;
}

.w-full {
    width: 100%;
}

.bg-white {
    background-color: #ffffff;
}

.shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
    border-radius: 0.5rem;
}

.bg-blue-100 {
    background-color: #ebf8ff;
}

.p-3 {
    padding: 0.75rem;
}

.text-left {
    text-align: left;
}

.text-center {
    text-align: center;
}

.break-all {
    word-break: break-all;
}

.border-b {
    border-bottom-width: 1px;
}

.text-green-600 {
    color: #16a34a;
}

.text-red-600 {
    color: #dc2626;
}

.mt-4 {
    margin-top: 1rem;
}

.text-red-600 {
    color: #dc2626;
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.max-w-xs {
    max-width: 20rem;
}
</style>
