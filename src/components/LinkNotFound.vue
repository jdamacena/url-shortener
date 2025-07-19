<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
        <div class="bg-white shadow-xl rounded-lg p-10 max-w-md w-full text-center">
            <h1 class="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Link Not Found</h1>
            <p class="text-lg text-gray-700 mb-6">Sorry, we couldn't find what you're looking for.</p>
            <router-link to="/"
                class="inline-block bg-blue-500 hover:bg-red-600 text-white font-bold rounded-lg px-6 py-3 shadow transition">Go
                to Home</router-link>
            <div class="mt-8 text-gray-400 text-xs">Check the link and try again, or create a new short link above.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LinkNotFound'
};
</script>
