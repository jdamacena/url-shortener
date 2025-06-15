<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-blue-50">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
      <h1 class="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow">404</h1>
      <p class="text-lg text-gray-700 mb-6">Sorry, the URL you are looking for was not found or is no longer active.</p>
      <router-link to="/" class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg p-3 w-32 shadow transition">Go Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
