<template>
  <footer class="mt-10 py-6 text-center text-gray-500 text-sm border-t border-blue-100">
    &copy; {{ year }} URL Shortener. All rights reserved.
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
