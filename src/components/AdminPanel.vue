<template>
    <div v-if="authStore.user && authStore.user.role === 'system_admin'">
        <div class="max-w-5xl mx-auto mt-10">
            <h2 class="text-3xl font-bold mb-6 text-blue-700 text-center">Admin Panel</h2>
            <div v-if="selectedUser">
                <button @click="selectedUser = null" class="mb-4 text-blue-600 hover:underline">&larr; Back to all
                    users</button>
                <div class="bg-white shadow rounded-lg p-6 mb-6">
                    <h3 class="text-2xl font-semibold mb-2">User Details</h3>
                    <div class="mb-2"><span class="font-semibold">Username:</span> {{ selectedUser.username }}</div>
                    <div class="mb-2"><span class="font-semibold">User ID:</span> <span class="break-all">{{
                            selectedUser._id }}</span></div>
                    <div class="mb-2 flex gap-2">
                        <button @click="deleteUser(selectedUser._id)" class="text-red-600 hover:underline">Delete
                            User</button>
                        <button @click="resetPassword(selectedUser._id)" class="text-blue-600 hover:underline">Reset
                            Password</button>
                    </div>
                </div>
                <div class="bg-white shadow rounded-lg p-6">
                    <h4 class="text-xl font-semibold mb-2">User's URLs</h4>
                    <div v-if="userUrls.length === 0" class="text-gray-500">No URLs for this user.</div>
                    <div v-else class="overflow-x-auto">
                        <table class="w-full bg-white rounded-lg min-w-[900px]">
                            <thead>
                                <tr class="bg-blue-100">
                                    <th class="p-2 text-left min-w-[120px]">Short URL</th>
                                    <th class="p-2 text-left min-w-[300px]">Original URL</th>
                                    <th class="p-2 text-center min-w-[80px]">Clicks</th>
                                    <th class="p-2 text-center min-w-[80px]">Active</th>
                                    <th class="p-2 text-center min-w-[100px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="url in userUrls" :key="url._id">
                                    <td class="p-2 max-w-xs break-all" :title="url.shortUrl || url.shortId">{{
                                        url.shortUrl
                                        || url.shortId }}</td>
                                    <td class="p-2 max-w-md break-all" :title="url.originalUrl">{{ url.originalUrl }}
                                    </td>
                                    <td class="p-2 text-center">{{ url.clickCount }}</td>
                                    <td class="p-2 text-center">{{ url.active ? 'Yes' : 'No' }}</td>
                                    <td class="p-2 text-center">
                                        <button @click="toggleUrlActive(url)"
                                            class="text-blue-600 hover:underline mr-2">{{
                                                url.active ? 'Deactivate' : 'Activate' }}</button>
                                        <button @click="deleteUrl(url._id)"
                                            class="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="loading" class="text-center text-gray-500">Loading...</div>
                <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
                <div v-else>
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                        <input v-model="searchQuery" type="text"
                            placeholder="Search users or URLs... (e.g. user:admin site:google.com status:active)"
                            class="border rounded px-2 py-1 text-sm w-full md:w-96" />
                        <div class="flex flex-wrap gap-2 mt-2 md:mt-0">
                            <span v-for="tag in tagSuggestions" :key="tag.label" @click="appendTag(tag.example)"
                                class="cursor-pointer bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">
                                {{ tag.label }}
                            </span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Users</h3>
                    <!-- Responsive user list: table for md+, cards for mobile -->
                    <div class="flex flex-col gap-4 md:hidden mb-8">
                        <div v-for="user in filteredUsers" :key="user._id"
                            class="bg-white shadow rounded-lg p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition"
                            @click="selectUser(user)">
                            <div><span class="font-semibold">Username:</span> {{ user.username }}</div>
                            <div><span class="font-semibold">User ID:</span> <span class="break-all">{{ user._id
                                    }}</span>
                            </div>
                            <div>
                                <button @click.stop="deleteUser(user._id)"
                                    class="text-red-600 hover:underline">Delete</button>
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
                                <tr v-for="user in filteredUsers" :key="user._id"
                                    class="cursor-pointer hover:bg-blue-50 transition" @click="selectUser(user)">
                                    <td class="p-2 max-w-xs truncate" :title="user.username">{{ user.username }}</td>
                                    <td class="p-2 max-w-xs break-all" :title="user._id">{{ user._id }}</td>
                                    <td class="p-2 text-center">
                                        <button @click.stop="deleteUser(user._id)"
                                            class="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">All URLs</h3>
                    <!-- Responsive URL list: table for md+, cards for mobile -->
                    <div class="flex flex-col gap-4 md:hidden">
                        <div v-for="url in filteredUrls" :key="url._id"
                            class="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                            <div><span class="font-semibold">Short URL:</span> <span class="break-all">{{ url.shortUrl
                                ||
                                    url.shortId }}</span></div>
                            <div><span class="font-semibold">Original URL:</span> <span class="break-all">{{
                                url.originalUrl
                                    }}</span></div>
                            <div><span class="font-semibold">User ID:</span> <span class="break-all">{{ url.userId
                                    }}</span>
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
                                <tr v-for="url in filteredUrls" :key="url._id">
                                    <td class="p-2 max-w-xs break-all" :title="url.shortUrl || url.shortId">{{
                                        url.shortUrl
                                        ||
                                        url.shortId }}</td>
                                    <td class="p-2 max-w-md break-all" :title="url.originalUrl">{{ url.originalUrl }}
                                    </td>
                                    <td class="p-2 max-w-xs break-all" :title="url.userId">{{ url.userId }}</td>
                                    <td class="p-2 text-center">{{ url.clickCount }}</td>
                                    <td class="p-2 text-center">{{ url.active ? 'Yes' : 'No' }}</td>
                                    <td class="p-2 text-center">
                                        <button @click="deleteUrl(url._id)"
                                            class="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="max-w-2xl mx-auto mt-10 text-center text-red-600">
        <h2 class="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function parseTags(query) {
    const tags = {};
    let rest = query;
    // Find all tag:value pairs
    const tagPattern = /([a-z]+):([^\s]+)/gi;
    let match;
    while ((match = tagPattern.exec(query))) {
        tags[match[1].toLowerCase()] = match[2];
        rest = rest.replace(match[0], '');
    }
    return { tags, rest: rest.trim() };
}

const tagSuggestions = [
    { label: 'user:', example: 'user:' },
    { label: 'site:', example: 'site:' },
    { label: 'url:', example: 'url:' },
    { label: 'status:active', example: 'status:active' },
    { label: 'status:inactive', example: 'status:inactive' },
    { label: 'id:', example: 'id:' },
    { label: 'short:', example: 'short:' },
    { label: 'clicks:', example: 'clicks:' },
];

export default {
    name: 'AdminPanel',
    setup() {
        const authStore = useAuthStore()
        const users = ref([])
        const urls = ref([])
        const loading = ref(true)
        const error = ref('')
        const searchQuery = ref('')
        const selectedUser = ref(null)
        const userUrls = computed(() => selectedUser.value ? urls.value.filter(u => u.userId === selectedUser.value._id) : [])

        function appendTag(tag) {
            if (!searchQuery.value.endsWith(' ') && searchQuery.value.length > 0) searchQuery.value += ' ';
            searchQuery.value += tag;
        }

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

        const filteredUsers = computed(() => {
            if (!searchQuery.value.trim()) return users.value
            const { tags, rest } = parseTags(searchQuery.value)
            let filtered = users.value
            if (tags.user) {
                filtered = filtered.filter(u => u.username && u.username.toLowerCase().includes(tags.user.toLowerCase()))
            }
            if (tags.id) {
                filtered = filtered.filter(u => u._id && u._id.toLowerCase().includes(tags.id.toLowerCase()))
            }
            if (rest) {
                const q = rest.toLowerCase()
                filtered = filtered.filter(u =>
                    (u.username && u.username.toLowerCase().includes(q)) ||
                    (u._id && u._id.toLowerCase().includes(q))
                )
            }
            return filtered
        })

        const filteredUrls = computed(() => {
            if (!searchQuery.value.trim()) return urls.value
            const { tags, rest } = parseTags(searchQuery.value)
            let filtered = urls.value
            if (tags.site || tags.url) {
                const val = (tags.site || tags.url).toLowerCase()
                filtered = filtered.filter(u => u.originalUrl && u.originalUrl.toLowerCase().includes(val))
            }
            if (tags.short) {
                filtered = filtered.filter(u => (u.shortUrl && u.shortUrl.toLowerCase().includes(tags.short.toLowerCase())) || (u.shortId && u.shortId.toLowerCase().includes(tags.short.toLowerCase())))
            }
            if (tags.id) {
                filtered = filtered.filter(u => u._id && u._id.toLowerCase().includes(tags.id.toLowerCase()))
            }
            if (tags.user) {
                filtered = filtered.filter(u => u.userId && u.userId.toLowerCase().includes(tags.user.toLowerCase()))
            }
            if (tags.status) {
                const val = tags.status.toLowerCase()
                if (val === 'active') filtered = filtered.filter(u => u.active)
                else if (val === 'inactive') filtered = filtered.filter(u => !u.active)
            }
            if (tags.clicks) {
                filtered = filtered.filter(u => typeof u.clickCount === 'number' && u.clickCount.toString().includes(tags.clicks))
            }
            if (rest) {
                const q = rest.toLowerCase()
                filtered = filtered.filter(u =>
                    (u.shortUrl && u.shortUrl.toLowerCase().includes(q)) ||
                    (u.shortId && u.shortId.toLowerCase().includes(q)) ||
                    (u.originalUrl && u.originalUrl.toLowerCase().includes(q)) ||
                    (u.userId && u.userId.toLowerCase().includes(q)) ||
                    (typeof u.clickCount === 'number' && u.clickCount.toString().includes(q)) ||
                    (u.active ? 'active' : 'inactive').includes(q)
                )
            }
            return filtered
        })

        function selectUser(user) {
            selectedUser.value = user
        }

        async function resetPassword(userId) {
            const newPassword = prompt('Enter a new password for this user:')
            if (!newPassword) return
            try {
                const token = authStore.token || localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/api/admin/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ userId, newPassword }),
                })
                if (!res.ok) throw new Error('Failed to reset password')
                alert('Password reset successfully!')
            } catch (e) {
                error.value = e.message
            }
        }

        async function toggleUrlActive(url) {
            try {
                const token = authStore.token || localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/api/url/${url.shortUrl || url.shortId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ active: !url.active }),
                })
                if (!res.ok) throw new Error('Failed to update URL status')
                await fetchData()
            } catch (e) {
                error.value = e.message
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

        return { users, urls, loading, error, deleteUser, deleteUrl, searchQuery, filteredUsers, filteredUrls, tagSuggestions, appendTag, selectedUser, selectUser, userUrls, resetPassword, toggleUrlActive, authStore }
    },
}
</script>
