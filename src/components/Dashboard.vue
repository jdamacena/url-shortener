<template>
  <div class="max-w-3xl mx-auto mt-10">
    <Breadcrumbs />
    <div v-if="authStore.user && authStore.user.role === 'system_admin'" class="mb-4 text-right">
      <router-link to="/admin"
        class="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-200 transition">Admin
        Panel</router-link>
    </div>
    <ShortenForm class="py-8" />
    <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">Your Shortened URLs</h2>
    <!-- Filter, Sort, and Search Controls -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <input v-model="searchQuery" type="text" placeholder="Search links..."
        class="border rounded px-2 py-1 text-sm w-full md:w-64" />
      <div class="flex gap-2">
        <select v-model="filterStatus" class="border rounded px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <select v-model="sortBy" class="border rounded px-2 py-1 text-sm">
          <option value="createdAt-desc">Newest</option>
          <option value="createdAt-asc">Oldest</option>
          <option value="clicks-desc">Most Clicks</option>
          <option value="clicks-asc">Fewest Clicks</option>
          <option value="active-desc">Active First</option>
          <option value="active-asc">Inactive First</option>
          <option value="shortUrl-asc">Short URL A-Z</option>
          <option value="shortUrl-desc">Short URL Z-A</option>
          <option value="originalUrl-asc">Original URL A-Z</option>
          <option value="originalUrl-desc">Original URL Z-A</option>
        </select>
      </div>
    </div>

    <!-- Loading State with Skeleton -->
    <div v-if="urlStore.loading">
      <!-- Mobile skeleton -->
      <div class="flex flex-col gap-4 md:hidden">
        <div v-for="i in 3" :key="`mobile-skeleton-${i}`" class="bg-white shadow rounded-lg p-4 animate-pulse">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="w-16 h-4 bg-gray-200 rounded"></div>
              <div class="w-24 h-4 bg-blue-200 rounded"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-20 h-4 bg-gray-200 rounded"></div>
              <div class="w-48 h-4 bg-gray-200 rounded flex-1"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-12 h-4 bg-gray-200 rounded"></div>
                <div class="w-8 h-4 bg-gray-200 rounded"></div>
              </div>
              <div class="w-12 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop skeleton -->
      <div class="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-blue-100 p-3">
          <div class="grid grid-cols-4 gap-4">
            <div class="w-20 h-4 bg-blue-200 rounded"></div>
            <div class="w-24 h-4 bg-blue-200 rounded"></div>
            <div class="w-12 h-4 bg-blue-200 rounded mx-auto"></div>
            <div class="w-12 h-4 bg-blue-200 rounded mx-auto"></div>
          </div>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="i in 5" :key="`desktop-skeleton-${i}`" class="p-3 animate-pulse">
            <div class="grid grid-cols-4 gap-4 items-center">
              <div class="flex items-center gap-2">
                <div class="w-16 h-4 bg-blue-200 rounded"></div>
                <div class="flex gap-1">
                  <div class="w-6 h-6 bg-gray-200 rounded"></div>
                  <div class="w-6 h-6 bg-gray-200 rounded"></div>
                  <div class="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="w-full h-4 bg-gray-200 rounded"></div>
              <div class="w-8 h-4 bg-gray-200 rounded mx-auto"></div>
              <div class="w-12 h-6 bg-gray-200 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading text with spinner -->
      <div class="flex items-center justify-center mt-6 text-gray-500">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="font-medium">Loading your URLs...</span>
      </div>
    </div>
    <div v-else-if="urlStore.urls.length === 0" class="text-center text-gray-500">No URLs found. Start by shortening a
      URL!</div>
    <div v-else>
      <div class="overflow-x-auto md:overflow-x-visible">
        <!-- Card layout for mobile, table for md+ -->
        <div class="flex flex-col gap-4 md:hidden">
          <div v-for="url in filteredSortedUrls" :key="url._id"
            class="bg-white shadow rounded-lg p-4 flex flex-col gap-2 transition-colors duration-150 cursor-pointer hover:bg-blue-50 active:bg-blue-100"
            @click="openAnalytics(url)" @keydown.enter.space="openAnalytics(url)" tabindex="0">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="font-semibold">Short URL:</span>
                <a :href="`${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`" target="_blank"
                  class="text-blue-700 underline whitespace-nowrap truncate" @click.stop>
                  /r/{{ url.shortId || url.shortUrl }}
                </a>
              </div>
              <div id="url-actions" class="flex items-center gap-2">
                <button @click.stop="copyLink(url)" :class="[
                  'px-2 py-1 rounded transition-colors focus:outline-none flex items-center gap-1',
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
                <button @click.stop="showQr(url)"
                  class="px-2 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
                  title="Show QR code">
                  <i class="fa-solid fa-qrcode h-4 w-4"></i>
                </button>
                <button @click.stop="shareLink(url)"
                  class="px-2 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
                  title="Share link">
                  <i class="fa-solid fa-share-nodes h-4 w-4"></i>
                </button>
                <span v-if="url.expiresAt && new Date(url.expiresAt) < new Date()"
                  class="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-semibold">Original URL:</span>
              <span class="truncate" :title="url.originalUrl">{{ url.originalUrl }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-semibold">Clicks:</span>
              <span>{{ url.clickCount }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-semibold">Active:</span>
              <button @click.stop="toggleActive(url)"
                class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                :class="url.active ? 'bg-green-400' : 'bg-gray-300'" :aria-pressed="url.active"
                :title="url.active ? 'Deactivate' : 'Activate'">
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                  :class="url.active ? 'translate-x-6' : 'translate-x-1'"></span>
                <span class="sr-only">Toggle Active</span>
              </button>
            </div>
            <!-- Removed analytics link for mobile, now opens on card click -->
          </div>
        </div>
        <table class="w-full bg-white shadow rounded-lg hidden md:table table-fixed">
          <thead class="table-header-group">
            <tr class="bg-blue-100">
              <th class="p-3 text-left w-2/5 cursor-pointer hover:bg-blue-200 transition-colors select-none"
                @click="setSortBy('shortUrl')" :class="{ 'bg-blue-200': sortBy.startsWith('shortUrl') }">
                <div class="flex items-center justify-between">
                  Short URL
                  <span class="text-xs">
                    <i v-if="sortBy === 'shortUrl-asc'" class="fa-solid fa-sort-up"></i>
                    <i v-else-if="sortBy === 'shortUrl-desc'" class="fa-solid fa-sort-down"></i>
                    <i v-else class="fa-solid fa-sort text-gray-400"></i>
                  </span>
                </div>
              </th>
              <th class="p-3 text-left w-2/5 cursor-pointer hover:bg-blue-200 transition-colors select-none"
                @click="setSortBy('originalUrl')" :class="{ 'bg-blue-200': sortBy.startsWith('originalUrl') }">
                <div class="flex items-center justify-between">
                  Original URL
                  <span class="text-xs">
                    <i v-if="sortBy === 'originalUrl-asc'" class="fa-solid fa-sort-up"></i>
                    <i v-else-if="sortBy === 'originalUrl-desc'" class="fa-solid fa-sort-down"></i>
                    <i v-else class="fa-solid fa-sort text-gray-400"></i>
                  </span>
                </div>
              </th>
              <th class="p-3 text-center w-1/10 cursor-pointer hover:bg-blue-200 transition-colors select-none"
                @click="setSortBy('clicks')" :class="{ 'bg-blue-200': sortBy.startsWith('clicks') }">
                <div class="flex items-center justify-center gap-1">
                  Clicks
                  <span class="text-xs">
                    <i v-if="sortBy === 'clicks-asc'" class="fa-solid fa-sort-up"></i>
                    <i v-else-if="sortBy === 'clicks-desc'" class="fa-solid fa-sort-down"></i>
                    <i v-else class="fa-solid fa-sort text-gray-400"></i>
                  </span>
                </div>
              </th>
              <th class="p-3 text-center w-1/10 cursor-pointer hover:bg-blue-200 transition-colors select-none"
                @click="setSortBy('active')" :class="{ 'bg-blue-200': sortBy.startsWith('active') }">
                <div class="flex items-center justify-center gap-1">
                  Active
                  <span class="text-xs">
                    <i v-if="sortBy === 'active-asc'" class="fa-solid fa-sort-up"></i>
                    <i v-else-if="sortBy === 'active-desc'" class="fa-solid fa-sort-down"></i>
                    <i v-else class="fa-solid fa-sort text-gray-400"></i>
                  </span>
                </div>
              </th>
              <!-- Removed Analytics column header -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="url in filteredSortedUrls" :key="url._id"
              :class="[{ 'bg-gray-50': !url.active }, 'transition-colors duration-150 cursor-pointer hover:bg-blue-50 active:bg-blue-100']"
              @click="openAnalytics(url)" @keydown.enter.space="openAnalytics(url)" tabindex="0">
              <td class="p-3 w-2/5">
                <div class="flex items-center gap-2 min-w-0">
                  <a :href="`${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`" target="_blank"
                    class="text-blue-700 underline whitespace-nowrap flex-shrink-0" @click.stop>/r/{{ url.shortId ||
                      url.shortUrl }}</a>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <button @click.stop="copyLink(url)" :class="[
                      'px-1.5 py-1 rounded transition-colors focus:outline-none flex items-center gap-1 text-xs',
                      copiedUrl === url.shortUrl ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800'
                    ]" :title="copiedUrl === url.shortUrl ? 'Copied!' : 'Copy link'">
                      <svg v-if="copiedUrl === url.shortUrl" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 4H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2V4h6V2" />
                      </svg>
                    </button>
                    <button @click.stop="showQr(url)"
                      class="px-1.5 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
                      title="Show QR code">
                      <i class="fa-solid fa-qrcode h-3 w-3"></i>
                    </button>
                    <button @click.stop="shareLink(url)"
                      class="px-1.5 py-1 rounded bg-gray-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold flex items-center"
                      title="Share link">
                      <i class="fa-solid fa-share-nodes h-3 w-3"></i>
                    </button>
                    <span v-if="url.expiresAt && new Date(url.expiresAt) < new Date()"
                      class="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
                  </div>
                </div>
              </td>
              <td class="p-3 w-2/5">
                <div class="truncate" :title="url.originalUrl">{{ url.originalUrl }}</div>
              </td>
              <td class="p-3 text-center w-1/10">{{ url.clickCount }}</td>
              <td class="p-3 text-center w-1/10">
                <button @click.stop="toggleActive(url)"
                  class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                  :class="url.active ? 'bg-green-400' : 'bg-gray-300'" :aria-pressed="url.active"
                  :title="url.active ? 'Deactivate' : 'Activate'">
                  <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="url.active ? 'translate-x-6' : 'translate-x-1'"></span>
                  <span class="sr-only">Toggle Active</span>
                </button>
              </td>
              <!-- Removed Analytics link for desktop, now opens on row click -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="urlStore.error" class="mt-4 text-red-600 text-center">{{ urlStore.error }}</div>

    <!-- QR Code Modal -->
    <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      @mousedown.self="closeQr">
      <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative" @mousedown.stop>
        <button @click="closeQr"
          class="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
        <h3 class="text-lg font-semibold mb-4">Scan QR Code</h3>
        <div ref="qrWrapper">
          <QrcodeVue v-if="qrUrl" :value="qrUrl" :size="180" class="mb-2" />
        </div>
        <button @click="downloadQr"
          class="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center"
          title="Download QR code">
          <i class="fa-solid fa-download mr-2"></i> Download
        </button>
        <div class="text-xs text-gray-500 break-all max-w-xs text-center mt-2">{{ qrUrl }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import ShortenForm from './ShortenForm.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import { useUrlStore } from '../stores/urlStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

if (!import.meta.env.VITE_SITE_URL) {
  throw new Error('VITE_SITE_URL environment variable is required but not set')
}
const BACKEND_BASE_URL = import.meta.env.VITE_SITE_URL;

export default {
  name: 'Dashboard',
  components: { ShortenForm, Breadcrumbs, QrcodeVue },
  setup() {
    const urlStore = useUrlStore()
    const authStore = useAuthStore()
    const copiedUrl = ref(null)
    const router = useRouter()
    const route = useRoute()
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const sortBy = ref('createdAt-desc')
    const qrUrl = ref(null)
    const showQrModal = ref(false)
    const qrCodeRef = ref(null)
    const qrWrapper = ref(null)

    // Initialize from URL query params
    onMounted(() => {
      if (authStore.user) {
        urlStore.fetchUrls()
      }
      const q = route.query.q
      const filter = route.query.filter
      const sort = route.query.sort
      if (typeof q === 'string') searchQuery.value = q
      if (typeof filter === 'string') filterStatus.value = filter
      if (typeof sort === 'string') sortBy.value = sort
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

    // Sync controls to URL
    watch([searchQuery, filterStatus, sortBy], ([q, filter, sort]) => {
      router.replace({
        query: {
          ...route.query,
          q: q || undefined,
          filter: filter !== 'all' ? filter : undefined,
          sort: sort !== 'createdAt-desc' ? sort : undefined
        }
      })
    })

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

    function openAnalytics(url) {
      router.push(`/analytics/${url.shortUrl}`)
    }

    function showQr(url) {
      qrUrl.value = `${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`
      showQrModal.value = true
    }

    function closeQr() {
      showQrModal.value = false
      qrUrl.value = null
    }

    async function downloadQr() {
      if (!qrUrl.value) return
      await nextTick()
      let canvas = qrWrapper.value?.querySelector('canvas')
      console.log('qrWrapper:', qrWrapper.value, 'canvas:', canvas)
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
        alert('Could not find QR canvas. See console for details.')
      }
    }

    function shareLink(url) {
      const link = `${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`
      if (navigator.share) {
        navigator.share({
          title: 'Short Link',
          text: 'Check out this short link:',
          url: link
        }).catch(() => { })
      } else {
        navigator.clipboard.writeText(link)
        copiedUrl.value = url.shortUrl
        setTimeout(() => {
          if (copiedUrl.value === url.shortUrl) copiedUrl.value = null
        }, 1200)
      }
    }

    function setSortBy(field) {
      if (sortBy.value === `${field}-desc`) {
        sortBy.value = `${field}-asc`
      } else if (sortBy.value === `${field}-asc`) {
        sortBy.value = `${field}-desc`
      } else {
        // Default to descending for clicks and ascending for text fields
        sortBy.value = field === 'clicks' ? `${field}-desc` : `${field}-asc`
      }
    }

    const filteredSortedUrls = computed(() => {
      let urls = urlStore.urls.slice()
      if (filterStatus.value === 'active') {
        urls = urls.filter(u => u.active && (!u.expiresAt || new Date(u.expiresAt) > new Date()))
      } else if (filterStatus.value === 'expired') {
        urls = urls.filter(u => u.expiresAt && new Date(u.expiresAt) < new Date())
      }
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        urls = urls.filter(u =>
          (u.originalUrl && u.originalUrl.toLowerCase().includes(q)) ||
          (u.shortUrl && u.shortUrl.toLowerCase().includes(q)) ||
          (u.shortId && u.shortId.toLowerCase().includes(q))
        )
      }
      switch (sortBy.value) {
        case 'createdAt-desc':
          urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        case 'createdAt-asc':
          urls.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
        case 'clicks-desc':
          urls.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)); break;
        case 'clicks-asc':
          urls.sort((a, b) => (a.clickCount || 0) - (b.clickCount || 0)); break;
        case 'active-desc':
          urls.sort((a, b) => (b.active === a.active) ? 0 : b.active ? 1 : -1); break;
        case 'active-asc':
          urls.sort((a, b) => (a.active === b.active) ? 0 : a.active ? 1 : -1); break;
        case 'shortUrl-asc':
          urls.sort((a, b) => (a.shortId || a.shortUrl || '').localeCompare(b.shortId || b.shortUrl || '')); break;
        case 'shortUrl-desc':
          urls.sort((a, b) => (b.shortId || b.shortUrl || '').localeCompare(a.shortId || a.shortUrl || '')); break;
        case 'originalUrl-asc':
          urls.sort((a, b) => (a.originalUrl || '').localeCompare(b.originalUrl || '')); break;
        case 'originalUrl-desc':
          urls.sort((a, b) => (b.originalUrl || '').localeCompare(a.originalUrl || '')); break;
      }
      return urls
    })

    return { urlStore, authStore, toggleActive, copyLink, copiedUrl, BACKEND_BASE_URL, openAnalytics, searchQuery, filterStatus, sortBy, filteredSortedUrls, showQr, closeQr, showQrModal, qrUrl, qrWrapper, downloadQr, shareLink, setSortBy }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
