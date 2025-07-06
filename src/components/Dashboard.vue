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
        </select>
      </div>
    </div>

    <div v-if="urlStore.loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="urlStore.urls.length === 0" class="text-center text-gray-500">No URLs found. Start by shortening a
      URL!</div>
    <div v-else>
      <div class="overflow-x-auto">
        <!-- Card layout for mobile, table for md+ -->
        <div class="flex flex-col gap-4 md:hidden">
          <div v-for="url in filteredSortedUrls" :key="url._id"
            class="bg-white shadow rounded-lg p-4 flex flex-col gap-2 transition-colors duration-150 cursor-pointer hover:bg-blue-50 active:bg-blue-100"
            @click="openAnalytics(url)" @keydown.enter.space="openAnalytics(url)" tabindex="0">
            <div class="flex items-center gap-2">
              <span class="font-semibold">Short URL:</span>
              <a :href="`${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`" target="_blank"
                class="text-blue-700 underline whitespace-nowrap" @click.stop>
                /r/{{ url.shortId || url.shortUrl }}
              </a>
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
              <span v-if="url.expiresAt && new Date(url.expiresAt) < new Date()"
                class="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
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
        <table class="w-full bg-white shadow rounded-lg min-w-0 hidden md:table">
          <thead class="table-header-group">
            <tr class="bg-blue-100">
              <th class="p-3 text-left">Short URL</th>
              <th class="p-3 text-left">Original URL</th>
              <th class="p-3 text-center">Clicks</th>
              <th class="p-3 text-center">Active</th>
              <!-- Removed Analytics column header -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="url in filteredSortedUrls" :key="url._id"
              :class="[{ 'bg-gray-50': !url.active }, 'transition-colors duration-150 cursor-pointer hover:bg-blue-50 active:bg-blue-100']"
              @click="openAnalytics(url)" @keydown.enter.space="openAnalytics(url)" tabindex="0">
              <td class="p-3 flex items-center gap-2 max-w-full md:max-w-none">
                <a :href="`${BACKEND_BASE_URL}/r/${url.shortId || url.shortUrl}`" target="_blank"
                  class="text-blue-700 underline whitespace-nowrap" @click.stop>/r/{{ url.shortId || url.shortUrl }}</a>
                <button @click.stop="copyLink(url)" :class="[
                  'ml-2 px-2 py-1 rounded transition-colors focus:outline-none flex items-center gap-1',
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
                  class="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Expired</span>
              </td>
              <td class="p-3 truncate max-w-full md:max-w-xs" :title="url.originalUrl">{{ url.originalUrl }}</td>
              <td class="p-3 text-center">{{ url.clickCount }}</td>
              <td class="p-3 text-center">
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
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import ShortenForm from './ShortenForm.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import { useUrlStore } from '../stores/urlStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter, useRoute } from 'vue-router'

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:3000';

export default {
  name: 'Dashboard',
  components: { ShortenForm, Breadcrumbs },
  setup() {
    const urlStore = useUrlStore()
    const authStore = useAuthStore()
    const copiedUrl = ref(null)
    const router = useRouter()
    const route = useRoute()
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const sortBy = ref('createdAt-desc')

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

    const filteredSortedUrls = computed(() => {
      let urls = urlStore.urls.slice()
      // Filter
      if (filterStatus.value === 'active') {
        urls = urls.filter(u => u.active && (!u.expiresAt || new Date(u.expiresAt) > new Date()))
      } else if (filterStatus.value === 'expired') {
        urls = urls.filter(u => u.expiresAt && new Date(u.expiresAt) < new Date())
      }
      // Search
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        urls = urls.filter(u =>
          (u.originalUrl && u.originalUrl.toLowerCase().includes(q)) ||
          (u.shortUrl && u.shortUrl.toLowerCase().includes(q)) ||
          (u.shortId && u.shortId.toLowerCase().includes(q))
        )
      }
      // Sort
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
      }
      return urls
    })

    return { urlStore, authStore, toggleActive, copyLink, copiedUrl, BACKEND_BASE_URL, openAnalytics, searchQuery, filterStatus, sortBy, filteredSortedUrls }
  }
}
</script>
