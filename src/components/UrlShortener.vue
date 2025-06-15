<template>
    <div class="url-shortener">
        <form @submit.prevent="shortenUrl">
            <div class="input-group">
                <input type="url" v-model="longUrl" placeholder="Enter your URL here (e.g., https://example.com)"
                    required pattern="https?://.*" title="Please enter a valid URL starting with http:// or https://">
                <button type="submit" :disabled="urlStore.loading">
                    {{ urlStore.loading ? 'Shortening...' : 'Shorten' }}
                </button>
            </div>
        </form>

        <div v-if="urlStore.error" class="error-message">
            {{ urlStore.error }}
        </div>

        <div v-if="shortUrl" class="result">
            <p>Your shortened URL:</p>
            <div class="short-url">
                <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
                <button @click="copyToClipboard">Copy</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useUrlStore } from '../stores/urlStore'

export default {
    name: 'UrlShortener',
    setup() {
        const urlStore = useUrlStore()
        return { urlStore }
    },
    data() {
        return {
            longUrl: '',
            shortUrl: ''
        }
    },
    methods: {
        async shortenUrl() {
            try {
                this.shortUrl = await this.urlStore.shortenUrl(this.longUrl)
            } catch (error) {
                console.error('Error shortening URL:', error)
            }
        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.shortUrl);
        }
    }
}
</script>

<style scoped>
.url-shortener {
    max-width: 600px;
    margin: 0 auto;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.result {
    margin-top: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.short-url {
    display: flex;
    gap: 10px;
    align-items: center;
}

.error-message {
    color: #dc3545;
    padding: 10px;
    margin: 10px 0;
    background-color: #f8d7da;
    border-radius: 4px;
    text-align: center;
}
</style>
