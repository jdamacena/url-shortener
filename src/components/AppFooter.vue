<template>
  <footer class="mt-10 py-6 text-center text-gray-500 text-sm px-4">
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
