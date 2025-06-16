<template>
  <div class="max-w-2xl mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">URL Analytics</h2>
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="!analytics" class="text-center text-gray-500">No analytics found.</div>
    <div v-else>
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="mb-2"><span class="font-bold">Short URL:</span> <a :href="`${BACKEND_BASE_URL}/${analytics.shortUrl}`" target="_blank" class="text-blue-700 underline">{{ BACKEND_BASE_URL.replace('http://', '').replace('https://', '') }}/{{ analytics.shortUrl }}</a></div>
        <div class="mb-2 flex items-center gap-2">
          <span class="font-bold">Original URL:</span>
          <span v-if="!editingOriginalUrl" class="break-all" id="original-url-link-group">
            {{ analytics.originalUrl }}
            <button v-if="canEdit" @click="editingOriginalUrl = true" id="show-edit-original-url" class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
          </span>
          <form v-else @submit.prevent="submitEditOriginalUrl" id="edit-original-url-form" class="flex items-center gap-2">
            <input v-model="editOriginalUrl" type="url" required class="border rounded p-1 w-64" />
            <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Save</button>
            <button type="button" @click="cancelEdit" id="cancel-edit-original-url" class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
          </form>
        </div>
        <div class="mb-2"><span class="font-bold">Clicks:</span> {{ analytics.clickCount }}</div>
        <div class="mb-2 flex items-center gap-2">
          <span class="font-bold">Active:</span>
          <span :class="analytics.active ? 'text-green-600' : 'text-red-600'">{{ analytics.active ? 'Yes' : 'No' }}</span>
          <button v-if="canEdit" @click="toggleActive" class="ml-2 px-2 py-1 text-xs rounded" :class="analytics.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'">
            {{ analytics.active ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
        <div class="mb-2" v-if="analytics.expiresAt"><span class="font-bold">Expires At:</span> {{ new Date(analytics.expiresAt).toLocaleString() }}</div>
        <div class="mb-2" v-if="analytics.lastAccessedAt"><span class="font-bold">Last Accessed:</span> {{ new Date(analytics.lastAccessedAt).toLocaleString() }}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4">Access History</h3>
        <div v-if="!analytics.accessLogs || analytics.accessLogs.length === 0" class="text-gray-500">No access logs yet.</div>
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
            <tr v-for="(log, idx) in analytics.accessLogs" :key="idx">
              <td class="p-2">{{ new Date(log.date).toLocaleString() }}</td>
              <td class="p-2">{{ log.referer || '-' }}</td>
              <td class="p-2">{{ log.userAgent || '-' }}</td>
              <td class="p-2">{{ log.ip || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="analytics.referers && analytics.referers.length > 0" class="bg-white shadow rounded-lg p-6 mt-6">
        <h3 class="text-xl font-bold mb-4">Referrers</h3>
        <ul class="list-disc pl-5">
          <li v-for="(referer, idx) in analytics.referers" :key="idx" class="mb-1">
            {{ referer }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useUrlStore } from '../stores/urlStore'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'UrlAnalytics',
  setup() {
    const route = useRoute()
    const urlStore = useUrlStore()
    const analytics = ref(null)
    const loading = ref(true)
    const error = ref('')
    const editingOriginalUrl = ref(false)
    const editOriginalUrl = ref('')
    const authStore = useAuthStore()

    const canEdit = computed(() => authStore.user)
    const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:3000'

    onMounted(async () => {
      await fetchAnalytics()
    })

    async function fetchAnalytics() {
      loading.value = true
      error.value = ''
      try {
        analytics.value = await urlStore.fetchUrlAnalytics(route.params.shortUrl)
      } catch (e) {
        error.value = e?.message || 'Failed to load analytics.'
      } finally {
        loading.value = false
      }
    }

    function cancelEdit() {
      editingOriginalUrl.value = false
      editOriginalUrl.value = analytics.value.originalUrl
    }

    async function submitEditOriginalUrl() {
      try {
        await urlStore.editOriginalUrl(analytics.value.shortUrl, editOriginalUrl.value)
        editingOriginalUrl.value = false
        await fetchAnalytics()
      } catch (e) {
        error.value = e?.message || 'Failed to update URL'
      }
    }

    async function toggleActive() {
      try {
        await urlStore.toggleActive(analytics.value)
        analytics.value.active = !analytics.value.active // Optimistic update
      } catch (e) {
        error.value = e?.message || 'Failed to toggle active status'
      }
    }

    // Set initial value for edit field when analytics loads
    watchEffect(() => {
      if (analytics.value) {
        editOriginalUrl.value = analytics.value.originalUrl
      }
    })

    return { analytics, loading, error, editingOriginalUrl, editOriginalUrl, canEdit, cancelEdit, submitEditOriginalUrl, toggleActive, BACKEND_BASE_URL }
  }
}
</script>

