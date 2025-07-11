<template>
  <nav class="navbar">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/favicon.ico" class="h-8" alt="Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">URL Shortener</span>
      </router-link>
      <div class="flex items-center gap-2">
        <!-- Username moved back into the menu for all screen sizes -->
        <button @click="toggleMenu" data-collapse-toggle="navbar-default" type="button" class="data-collapse-btn"
          aria-controls="navbar-default" :aria-expanded="menuOpen">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
      <div :class="[menuOpen ? 'block' : 'hidden', 'w-full md:block md:w-auto']" id="navbar-default">
        <ul class="list">
          <li>
            <router-link to="/" class="btn">Home</router-link>
          </li>
          <li>
            <router-link v-if="authStore.user" to="/dashboard" class="btn">Dashboard</router-link>
          </li>
          <li>
            <router-link v-if="!authStore.user" to="/login" class="btn">Login</router-link>
          </li>
          <li v-if="authStore.user">
            <div class="flex items-center gap-2 ml-4">
              <span class="text-gray-900 dark:text-white text-sm">{{ authStore.user.username }}</span>
              <button @click="logout" class="btn w-full text-left md:w-auto md:text-center">Logout</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const menuOpen = ref(false)

    function toggleMenu() {
      menuOpen.value = !menuOpen.value
    }

    // Close menu on route change (for better UX)
    onMounted(() => {
      router.afterEach(() => {
        menuOpen.value = false
      })
    })

    async function logout() {
      await authStore.logout()
      router.push('/')
    }
    return { authStore, logout, menuOpen, toggleMenu }
  }
}
</script>

<style>
@reference "../assets/styles/main.css";

html,
body,
#app {
  width: 100%;
  overflow-x: hidden;
}

.navbar {
  @apply bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600;
}

.data-collapse-btn {
  @apply inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600;
}

.btn {
  @apply block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent;
}

.list {
  @apply font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700;
}
</style>
