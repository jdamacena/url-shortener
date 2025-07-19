<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="bg-white shadow-xl rounded-lg p-10 max-w-md w-full text-center">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Link Inactive or Expired</h1>
      <p class="text-lg text-gray-700 mb-6">Sorry, this link is no longer available.</p>
      <router-link to="/" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-6 py-3 shadow transition">Go to Home</router-link>
      <div class="mt-8 text-gray-400 text-xs">If you believe this is a mistake, please contact the link owner or create a new short link.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkExpired'
}
</script>
