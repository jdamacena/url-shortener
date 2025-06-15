<template>
    <div class="login-container">
        <div class="form-container">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <div v-if="authStore.error" class="error">
                    {{ authStore.error }}
                </div>
                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? 'Logging in...' : 'Login' }}
                </button>
            </form>
            <p class="register-link">
                Don't have an account?
                <router-link to="/register">Register</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export default {
    name: 'Login',
    setup() {
        const router = useRouter()
        const authStore = useAuthStore()
        const username = ref('')
        const password = ref('')

        const handleLogin = async () => {
            try {
                await authStore.login(username.value, password.value)
                router.push('/dashboard')
            } catch (error) {
                // Error is handled in the store
            }
        }

        return {
            username,
            password,
            authStore,
            handleLogin
        }
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: 500;
    color: #2c3e50;
}

input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    padding: 0.75rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #3aa876;
}

button:disabled {
    background-color: #a8d5c2;
    cursor: not-allowed;
}

.error {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.register-link {
    text-align: center;
    margin-top: 1rem;
}

.register-link a {
    color: #42b983;
    text-decoration: none;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>
