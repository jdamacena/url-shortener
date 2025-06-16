<template>
  <div class="max-w-2xl mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">URL Analytics</h2>
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="!analytics" class="text-center text-gray-500">No analytics found.</div>
    <div v-else>
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="mb-2 flex items-center gap-2">
          <span class="font-bold">Short URL:</span>
          <a :href="`${BACKEND_BASE_URL}/${analytics.shortUrl}`" target="_blank" class="text-blue-700 underline whitespace-nowrap">
            {{ BACKEND_BASE_URL.replace('http://', '').replace('https://', '') }}/{{ analytics.shortUrl }}
          </a>
          <button
            @click="copyShortUrl"
            :class="[
              'ml-2 px-2 py-1 rounded transition-colors focus:outline-none flex items-center gap-1',
              copied ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800'
            ]"
            :title="copied ? 'Copied!' : 'Copy link'"
          >
            <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2V4h6V2" /></svg>
            <span v-if="copied">Copied!</span>
            <span v-else>Copy</span>
          </button>
        </div>
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
        <div class="mb-2 flex items-center gap-2" v-if="canEdit">
          <span class="font-bold">Expiration:</span>
          <span v-if="!editingExpiration">
            <span v-if="analytics.expiresAt">{{ new Date(analytics.expiresAt).toLocaleString() }}</span>
            <span v-else class="text-green-700">Never Expires</span>
            <button @click="startEditExpiration" class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
          </span>
          <form v-else @submit.prevent="submitEditExpiration" class="flex items-center gap-2">
            <input v-model="editExpiration" type="datetime-local" class="border rounded p-1" :min="minDateTime" />
            <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Save</button>
            <button type="button" @click="setNeverExpires" class="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Never Expires</button>
            <button type="button" @click="cancelEditExpiration" class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
          </form>
        </div>
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
      <div class="bg-white shadow rounded-lg p-6 mt-6">
        <AnalyticsCharts v-if="analytics" :analytics="analytics" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUrlStore } from '../stores/urlStore'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AnalyticsCharts from './AnalyticsCharts.vue'

export default {
  name: 'UrlAnalytics',
  components: { AnalyticsCharts },
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
        const updated = await urlStore.toggleActive(analytics.value)
        analytics.value.active = updated.active // update the UI immediately
      } catch (e) {
        error.value = e?.message || 'Failed to toggle active status'
      }
    }

    const copied = ref(false)
    function copyShortUrl() {
      const link = `${BACKEND_BASE_URL}/${analytics.value.shortUrl}`
      navigator.clipboard.writeText(link)
      copied.value = true
      setTimeout(() => { copied.value = false }, 1200)
    }

    const editingExpiration = ref(false)
    const editExpiration = ref("")
    const minDateTime = new Date().toISOString().slice(0, 16)

    function startEditExpiration() {
      editingExpiration.value = true
      editExpiration.value = analytics.value.expiresAt ? new Date(analytics.value.expiresAt).toISOString().slice(0, 16) : ""
    }
    function cancelEditExpiration() {
      editingExpiration.value = false
      editExpiration.value = analytics.value.expiresAt ? new Date(analytics.value.expiresAt).toISOString().slice(0, 16) : ""
    }
    async function submitEditExpiration() {
      try {
        await urlStore.editExpiration(analytics.value.shortUrl, editExpiration.value ? new Date(editExpiration.value).toISOString() : undefined)
        editingExpiration.value = false
        await fetchAnalytics()
      } catch (e) {
        error.value = e?.message || 'Failed to update expiration'
      }
    }
    async function setNeverExpires() {
      try {
        await urlStore.editExpiration(analytics.value.shortUrl, undefined)
        editingExpiration.value = false
        await fetchAnalytics()
      } catch (e) {
        error.value = e?.message || 'Failed to update expiration'
      }
    }

    // Set initial value for edit field when analytics loads
    watchEffect(() => {
      if (analytics.value) {
        editOriginalUrl.value = analytics.value.originalUrl
        editExpiration.value = analytics.value.expiresAt ? new Date(analytics.value.expiresAt).toISOString().slice(0, 16) : ""
      }
    })

    return { analytics, loading, error, editingOriginalUrl, editOriginalUrl, canEdit, cancelEdit, submitEditOriginalUrl, toggleActive, BACKEND_BASE_URL, copied, copyShortUrl, editingExpiration, editExpiration, minDateTime, startEditExpiration, cancelEditExpiration, submitEditExpiration, setNeverExpires }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

