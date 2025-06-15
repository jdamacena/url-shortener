<template>
    <div class="dashboard">
        <h2>Your Shortened URLs</h2>
        <div v-if="urlStore.loading" class="loading">
            <div class="loader"></div>
            Loading...
        </div>
        <div v-else-if="urlStore.error" class="error">
            {{ urlStore.error }}
        </div>
        <div v-else class="url-list">
            <div v-for="(url, index) in urlStore.urls" :key="index" class="url-item">
                <div class="url-details">
                    <a :href="url.shortUrl" target="_blank" class="short-url">{{ url.shortUrl }}</a>
                    <span class="long-url">{{ url.longUrl }}</span>
                </div>
                <button @click="copyToClipboard(url.shortUrl)" class="copy-btn">Copy</button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue'
import { useUrlStore } from '../stores/urlStore'
import { useRouter } from 'vue-router'

export default {
    name: 'Dashboard',
    setup() {
        const urlStore = useUrlStore()
        const router = useRouter()

        onMounted(async () => {
            try {
                await urlStore.fetchUrls()
            } catch (error) {
                console.error('Error fetching URLs:', error)
            }
        })

        const viewAnalytics = (shortId) => {
            router.push(`/analytics/${shortId}`)
        }

        const copyToClipboard = async (url) => {
            try {
                await navigator.clipboard.writeText(url)
                // You could add a toast notification here
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        }

        return {
            urlStore,
            viewAnalytics,
            copyToClipboard
        }
    }
}
</script>

<style scoped>
.dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.loader {
    border: 3px solid #f3f3f3;
    border-radius: 50%;
    border-top: 3px solid #42b983;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error {
    color: #dc3545;
    padding: 20px;
    text-align: center;
    background-color: #f8d7da;
    border-radius: 4px;
    margin-bottom: 20px;
}

.url-list {
    display: grid;
    gap: 20px;
}

.url-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.url-info {
    margin-bottom: 15px;
}

.original-url {
    color: #666;
    font-size: 0.9em;
    word-break: break-all;
}

.short-url {
    color: #42b983;
    font-weight: bold;
    word-break: break-all;
}

.actions {
    display: flex;
    gap: 10px;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;
}

.copy-btn {
    background-color: #42b983;
    color: white;
}

.copy-btn:hover {
    background-color: #3aa876;
}

.analytics-btn {
    background-color: #4a5568;
    color: white;
}

.analytics-btn:hover {
    background-color: #2d3748;
}
</style>
