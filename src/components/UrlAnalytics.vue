<template>
  <div class="max-w-2xl mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">URL Analytics</h2>
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="!analytics" class="text-center text-gray-500">No analytics found.</div>
    <div v-else>
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="mb-2"><span class="font-bold">Short URL:</span> <a :href="'/' + analytics.shortUrl" target="_blank" class="text-blue-700 underline">/{{ analytics.shortUrl }}</a></div>
        <div class="mb-2"><span class="font-bold">Original URL:</span> <span class="break-all">{{ analytics.originalUrl }}</span></div>
        <div class="mb-2"><span class="font-bold">Clicks:</span> {{ analytics.clicks }}</div>
        <div class="mb-2"><span class="font-bold">Active:</span> <span :class="analytics.active ? 'text-green-600' : 'text-red-600'">{{ analytics.active ? 'Yes' : 'No' }}</span></div>
        <div class="mb-2" v-if="analytics.expiresAt"><span class="font-bold">Expires At:</span> {{ new Date(analytics.expiresAt).toLocaleString() }}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4">Click History</h3>
        <div v-if="!analytics.clickHistory || analytics.clickHistory.length === 0" class="text-gray-500">No clicks yet.</div>
        <table v-else class="w-full">
          <thead>
            <tr class="bg-blue-100">
              <th class="p-2 text-left">Timestamp</th>
              <th class="p-2 text-left">Referrer</th>
              <th class="p-2 text-left">User Agent</th>
              <th class="p-2 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(click, idx) in analytics.clickHistory" :key="idx">
              <td class="p-2">{{ new Date(click.timestamp).toLocaleString() }}</td>
              <td class="p-2">{{ click.referrer || '-' }}</td>
              <td class="p-2">{{ click.userAgent || '-' }}</td>
              <td class="p-2">{{ click.ip || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'UrlAnalytics',
  setup() {
    const route = useRoute()
    const analytics = ref(null)
    const loading = ref(true)
    const error = ref('')

    onMounted(async () => {
      loading.value = true
      error.value = ''
      try {
        const { data } = await axios.get(`/api/analytics/${route.params.shortUrl}`)
        analytics.value = data
      } catch (e) {
        error.value = e?.response?.data?.error || 'Failed to load analytics.'
      } finally {
        loading.value = false
      }
    })

    return { analytics, loading, error }
  }
}
</script>

