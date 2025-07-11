<template>
  <nav class="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li>
        <router-link to="/dashboard" class="inline-flex items-center hover:text-blue-700">
          <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-8l2 2m-2-2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z"/></svg>
          Dashboard
        </router-link>
      </li>
      <li v-for="(crumb, idx) in crumbs" :key="idx" class="flex items-center">
        <svg class="w-4 h-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
        <span v-if="crumb.to">
          <router-link :to="crumb.to" class="hover:text-blue-700">{{ crumb.label }}</router-link>
        </span>
        <span v-else class="text-gray-700">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Breadcrumbs',
  setup() {
    const route = useRoute()
    // Map route names/paths to readable labels
    const crumbs = computed(() => {
      const path = route.path
      if (path.startsWith('/analytics/')) {
        const id = route.params.shortUrl
        return [
          { label: 'Analytics', to: '/dashboard' },
          { label: id, to: null }
        ]
      }
      // Add more routes as needed
      return []
    })
    return { crumbs }
  }
}
</script>

<style scoped>
nav[aria-label="Breadcrumb"] {
  user-select: none;
}
</style>
