<template>
    <div class="max-w-5xl mx-auto mt-10">
        <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">Admin Panel</h2>
        <div v-if="loading" class="text-center text-gray-500">Loading...</div>
        <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
        <div v-else>
            <h3 class="text-xl font-semibold mb-2">Users</h3>
            <!-- Responsive user list: table for md+, cards for mobile -->
            <div class="flex flex-col gap-4 md:hidden mb-8">
                <div v-for="user in users" :key="user._id" class="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                    <div><span class="font-semibold">Username:</span> {{ user.username }}</div>
                    <div><span class="font-semibold">User ID:</span> <span class="break-all">{{ user._id }}</span></div>
                    <div>
                        <button @click="deleteUser(user._id)" class="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto mb-8 hidden md:block">
                <table class="w-full bg-white shadow rounded-lg min-w-[600px]">
                    <thead>
                        <tr class="bg-blue-100">
                            <th class="p-2 text-left min-w-[120px]">Username</th>
                            <th class="p-2 text-left min-w-[220px]">User ID</th>
                            <th class="p-2 text-center min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user._id">
                            <td class="p-2 max-w-xs truncate" :title="user.username">{{ user.username }}</td>
                            <td class="p-2 max-w-xs break-all" :title="user._id">{{ user._id }}</td>
                            <td class="p-2 text-center">
                                <button @click="deleteUser(user._id)"
                                    class="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="text-xl font-semibold mb-2">All URLs</h3>
            <!-- Responsive URL list: table for md+, cards for mobile -->
            <div class="flex flex-col gap-4 md:hidden">
                <div v-for="url in urls" :key="url._id" class="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                    <div><span class="font-semibold">Short URL:</span> <span class="break-all">{{ url.shortUrl ||
                            url.shortId }}</span></div>
                    <div><span class="font-semibold">Original URL:</span> <span class="break-all">{{ url.originalUrl
                            }}</span></div>
                    <div><span class="font-semibold">User ID:</span> <span class="break-all">{{ url.userId }}</span>
                    </div>
                    <div><span class="font-semibold">Clicks:</span> {{ url.clickCount }}</div>
                    <div><span class="font-semibold">Active:</span> {{ url.active ? 'Yes' : 'No' }}</div>
                    <div>
                        <button @click="deleteUrl(url._id)" class="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto hidden md:block">
                <table class="w-full bg-white shadow rounded-lg min-w-[900px]">
                    <thead>
                        <tr class="bg-blue-100">
                            <th class="p-2 text-left min-w-[120px]">Short URL</th>
                            <th class="p-2 text-left min-w-[300px]">Original URL</th>
                            <th class="p-2 text-left min-w-[220px]">User ID</th>
                            <th class="p-2 text-center min-w-[80px]">Clicks</th>
                            <th class="p-2 text-center min-w-[80px]">Active</th>
                            <th class="p-2 text-center min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="url in urls" :key="url._id">
                            <td class="p-2 max-w-xs break-all" :title="url.shortUrl || url.shortId">{{ url.shortUrl ||
                                url.shortId }}</td>
                            <td class="p-2 max-w-md break-all" :title="url.originalUrl">{{ url.originalUrl }}</td>
                            <td class="p-2 max-w-xs break-all" :title="url.userId">{{ url.userId }}</td>
                            <td class="p-2 text-center">{{ url.clickCount }}</td>
                            <td class="p-2 text-center">{{ url.active ? 'Yes' : 'No' }}</td>
                            <td class="p-2 text-center">
                                <button @click="deleteUrl(url._id)" class="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default {
    name: 'AdminPanel',
    setup() {
        const authStore = useAuthStore()
        const users = ref([])
        const urls = ref([])
        const loading = ref(true)
        const error = ref('')

        async function fetchData() {
            loading.value = true
            error.value = ''
            try {
                const token = authStore.token || localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/api/admin`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                })
                if (!res.ok) throw new Error('Not authorized or error fetching admin data')
                const data = await res.json()
                users.value = data.users
                urls.value = data.urls
            } catch (e) {
                error.value = e.message
            } finally {
                loading.value = false
            }
        }

        async function deleteUser(userId) {
            if (!confirm('Delete this user and all their URLs?')) return
            try {
                const token = authStore.token || localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/api/admin`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ userId }),
                })
                if (!res.ok) throw new Error('Failed to delete user')
                await fetchData()
            } catch (e) {
                error.value = e.message
            }
        }

        async function deleteUrl(urlId) {
            if (!confirm('Delete this URL?')) return
            try {
                const token = authStore.token || localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/api/admin`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ urlId }),
                })
                if (!res.ok) throw new Error('Failed to delete URL')
                await fetchData()
            } catch (e) {
                error.value = e.message
            }
        }

        onMounted(fetchData)

        return { users, urls, loading, error, deleteUser, deleteUrl }
    },
}
</script>
