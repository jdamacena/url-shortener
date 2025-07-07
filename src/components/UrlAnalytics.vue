<template>
  <div class="max-w-2xl mx-auto mt-10">
    <Breadcrumbs />
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">URL Analytics</h2>
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="!analytics" class="text-center text-gray-500">No analytics found.</div>
    <div v-else>
      <div
        class="bg-white shadow rounded-lg p-6 mb-6 flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="font-bold">Short URL:</span>
            <a :href="`${BACKEND_BASE_URL}/r/${analytics.shortId || analytics.shortUrl}`" target="_blank"
              class="text-blue-700 underline whitespace-nowrap overflow-auto">
              {{ BACKEND_BASE_URL.replace('http://', '').replace('https://', '') }}/r/{{ analytics.shortId ||
                analytics.shortUrl }}
            </a>
            <button @click="copyShortUrl" :class="[
              'px-2 py-1 rounded transition-colors focus:outline-none flex items-center gap-1',
              copied ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800'
            ]" :title="copied ? 'Copied!' : 'Copy link'">
              <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 4H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2V4h6V2" />
              </svg>
              <span v-if="copied">Copied!</span>
              <span v-else>Copy</span>
            </button>
            <button @click="showQrModal = true"
              class="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
              title="Show QR code">
              <i class="fa-solid fa-qrcode mr-1"></i> QR
            </button>
            <button @click="shareLink"
              class="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
              title="Share link">
              <i class="fa-solid fa-share-nodes mr-1"></i> Share
            </button>
          </div>
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="font-bold">Original URL:</span>
            <span v-if="!editingOriginalUrl" class="break-all" id="original-url-link-group">
              {{ analytics.originalUrl }}
              <button v-if="canEdit" @click="editingOriginalUrl = true" id="show-edit-original-url"
                class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
            </span>
            <form v-else @submit.prevent="submitEditOriginalUrl" id="edit-original-url-form"
              class="flex items-center gap-2 w-full max-w-xs">
              <input v-model="editOriginalUrl" type="url" required class="border rounded p-1 flex-1 min-w-0" />
              <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Save</button>
              <button type="button" @click="cancelEdit" id="cancel-edit-original-url"
                class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
            </form>
          </div>
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="font-bold">Clicks:</span> {{ analytics.clickCount }}
          </div>
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="font-bold">Active:</span>
            <span :class="analytics.active ? 'text-green-600' : 'text-red-600'">{{ analytics.active ? 'Yes' : 'No'
              }}</span>
            <button v-if="canEdit" @click="toggleActive" class="ml-2 px-2 py-1 text-xs rounded"
              :class="analytics.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'">
              {{ analytics.active ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
          <div class="mb-2 flex flex-wrap items-center gap-2" v-if="canEdit">
            <span class="font-bold">Expiration:</span>
            <span v-if="!editingExpiration">
              <span v-if="analytics.expiresAt">{{ new Date(analytics.expiresAt).toLocaleString() }}</span>
              <span v-else class="text-green-700">Never Expires</span>
              <span v-if="analytics.expiresAt && new Date(analytics.expiresAt) < new Date()"
                class="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
              <button @click="startEditExpiration"
                class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
            </span>
            <form v-else @submit.prevent="submitEditExpiration" class="flex items-center gap-2 w-full max-w-xs">
              <input v-model="editExpiration" type="datetime-local" class="border rounded p-1 flex-1 min-w-0"
                :min="minDateTime" />
              <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Save</button>
              <button type="button" @click="setNeverExpires"
                class="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Never Expires</button>
              <button type="button" @click="cancelEditExpiration"
                class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
            </form>
          </div>
          <div class="mb-2" v-if="analytics.lastAccessedAt"><span class="font-bold">Last Accessed:</span> {{ new
            Date(analytics.lastAccessedAt).toLocaleString() }}</div>
        </div>
      </div>
      <div class="bg-white shadow rounded-lg p-6 mt-6">
        <AnalyticsCharts v-if="analytics" :analytics="analytics" />
      </div>
      <div class="bg-white shadow rounded-lg p-6 mt-6">
        <h3 class="text-xl font-bold mb-4">Access History</h3>
        <div v-if="!analytics.accessLogs || analytics.accessLogs.length === 0" class="text-gray-500">No access logs yet.
        </div>
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
      <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        @mousedown.self="showQrModal = false">
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative" @mousedown.stop>
          <button @click="showQrModal = false"
            class="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
          <h3 class="text-lg font-semibold mb-4">Scan QR Code</h3>
          <div ref="qrWrapperModal">
            <QrcodeVue v-if="analytics" :value="`${BACKEND_BASE_URL}/r/${analytics.shortId || analytics.shortUrl}`"
              :size="180" class="mb-2" />
          </div>
          <button @click="downloadQrModal"
            class="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center"
            title="Download QR code">
            <i class="fa-solid fa-download mr-2"></i> Download
          </button>
          <div class="text-xs text-gray-500 break-all max-w-xs text-center mt-2">{{
            `${BACKEND_BASE_URL}/r/${analytics.shortId || analytics.shortUrl}` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUrlStore } from '../stores/urlStore'
import { ref, onMounted, computed, watchEffect, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AnalyticsCharts from './AnalyticsCharts.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'UrlAnalytics',
  components: { AnalyticsCharts, Breadcrumbs, QrcodeVue },
  setup() {
    const route = useRoute()
    const urlStore = useUrlStore()
    const analytics = ref(null)
    const loading = ref(true)
    const error = ref('')
    const editingOriginalUrl = ref(false)
    const editOriginalUrl = ref('')
    const authStore = useAuthStore()
    const qrWrapper = ref(null)
    const showQrModal = ref(false)
    const qrWrapperModal = ref(null)

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
        savingOriginalUrl.value = true
        const updated = await urlStore.editOriginalUrl(analytics.value.shortUrl, editOriginalUrl.value)
        analytics.value.originalUrl = updated.originalUrl || editOriginalUrl.value
        editingOriginalUrl.value = false
      } catch (e) {
        error.value = e?.message || 'Failed to update URL'
      } finally {
        savingOriginalUrl.value = false
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
      const link = `${BACKEND_BASE_URL}/r/${analytics.value.shortId || analytics.value.shortUrl}`
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
        savingExpiration.value = true
        const updated = await urlStore.editExpiration(analytics.value.shortUrl, editExpiration.value ? new Date(editExpiration.value).toISOString() : undefined)
        analytics.value.expiresAt = updated.expiresAt || (editExpiration.value ? new Date(editExpiration.value).toISOString() : null)
        editingExpiration.value = false
      } catch (e) {
        error.value = e?.message || 'Failed to update expiration'
      } finally {
        savingExpiration.value = false
      }
    }
    async function setNeverExpires() {
      try {
        savingExpiration.value = true
        const updated = await urlStore.editExpiration(analytics.value.shortUrl, null)
        analytics.value.expiresAt = updated.expiresAt || null
        editingExpiration.value = false
      } catch (e) {
        error.value = e?.message || 'Failed to update expiration'
      } finally {
        savingExpiration.value = false
      }
    }

    async function downloadQr() {
      await nextTick()
      let canvas = qrWrapper.value?.querySelector('canvas')
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'qr-code.png'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
        }, 100)
      } else {
        alert('Could not find QR canvas.')
      }
    }

    async function downloadQrModal() {
      await nextTick()
      let canvas = qrWrapperModal.value?.querySelector('canvas')
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'qr-code.png'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
        }, 100)
      } else {
        alert('Could not find QR canvas.')
      }
    }

    function shareLink() {
      const link = `${BACKEND_BASE_URL}/r/${analytics.value.shortId || analytics.value.shortUrl}`
      if (navigator.share) {
        navigator.share({
          title: 'Short Link',
          text: 'Check out this short link:',
          url: link
        }).catch(() => { })
      } else {
        navigator.clipboard.writeText(link)
        copied.value = true
        setTimeout(() => { copied.value = false }, 1200)
      }
    }

    // Set initial value for edit field when analytics loads
    watchEffect(() => {
      if (analytics.value) {
        editOriginalUrl.value = analytics.value.originalUrl
        editExpiration.value = analytics.value.expiresAt ? new Date(analytics.value.expiresAt).toISOString().slice(0, 16) : ""
      }
    })

    const savingOriginalUrl = ref(false)
    const savingExpiration = ref(false)

    return { analytics, loading, error, editingOriginalUrl, editOriginalUrl, canEdit, cancelEdit, submitEditOriginalUrl, toggleActive, BACKEND_BASE_URL, copied, copyShortUrl, editingExpiration, editExpiration, minDateTime, startEditExpiration, cancelEditExpiration, submitEditExpiration, setNeverExpires, qrWrapper, downloadQr, showQrModal, shareLink, qrWrapperModal, downloadQrModal }
  }
}
</script>