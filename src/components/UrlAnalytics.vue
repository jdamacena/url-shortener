<template>
    <div class="analytics-container">
        <h2>URL Analytics</h2>
        <div v-if="loading" class="loading">
            Loading analytics...
        </div>
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        <div v-else class="analytics-content">
            <div class="url-info">
                <h3>URL Information</h3>
                <p><strong>Original URL:</strong> <a :href="urlData.longUrl" target="_blank">{{ urlData.longUrl }}</a>
                </p>
                <p><strong>Short URL:</strong> <a :href="shortUrl" target="_blank">{{ shortUrl }}</a></p>
                <p><strong>Created:</strong> {{ formatDate(urlData.createdAt) }}</p>
            </div>

            <div class="stats">
                <h3>Statistics</h3>
                <div class="stat-card">
                    <div class="stat-value">{{ urlData.clicks }}</div>
                    <div class="stat-label">Total Clicks</div>
                </div>
            </div>

            <div v-if="urlData.clickHistory && urlData.clickHistory.length" class="click-history">
                <h3>Click History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Referrer</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(click, index) in urlData.clickHistory" :key="index">
                            <td>{{ formatDate(click.timestamp) }}</td>
                            <td>{{ formatTime(click.timestamp) }}</td>
                            <td>{{ click.referrer || 'Direct' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
    name: 'UrlAnalytics',
    setup() {
        const route = useRoute()
        const urlData = ref(null)
        const loading = ref(true)
        const error = ref(null)

        const shortUrl = computed(() => {
            if (!urlData.value) return ''
            return `${window.location.origin}/${urlData.value.shortId}`
        })

        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`/api/analytics/${route.params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics')
                }
                urlData.value = await response.json()
            } catch (err) {
                error.value = 'Failed to load analytics data'
                console.error(err)
            } finally {
                loading.value = false
            }
        }

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString()
        }

        const formatTime = (date) => {
            return new Date(date).toLocaleTimeString()
        }

        onMounted(() => {
            fetchAnalytics()
        })

        return {
            urlData,
            loading,
            error,
            shortUrl,
            formatDate,
            formatTime
        }
    }
}
</script>

<style scoped>
.analytics-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
}

h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.error {
    color: #dc3545;
    padding: 1rem;
    background-color: #f8d7da;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.url-info {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.url-info p {
    margin: 0.5rem 0;
}

.url-info a {
    color: #42b983;
    text-decoration: none;
    word-break: break-all;
}

.url-info a:hover {
    text-decoration: underline;
}

.stats {
    margin-bottom: 2rem;
}

.stat-card {
    background-color: #42b983;
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    opacity: 0.9;
}

.click-history table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.click-history th,
.click-history td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
}

.click-history th {
    background-color: #f8f9fa;
    font-weight: 600;
}

@media (max-width: 640px) {
    .analytics-container {
        padding: 1rem;
    }

    .click-history {
        overflow-x: auto;
    }
}
</style>
