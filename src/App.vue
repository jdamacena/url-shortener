<template>
    <div id="app">
        <header>
            <nav>
                <router-link to="/">Home</router-link> |
                <router-link to="/dashboard">Dashboard</router-link>
            </nav>
            <h1>URL Shortener</h1>
        </header>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style scoped>
#app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 40px;
}

nav {
    padding: 20px 0;
}

nav a {
    color: #2c3e50;
    text-decoration: none;
    margin: 0 10px;
    padding: 5px;
}

nav a.router-link-active {
    color: #42b983;
    border-bottom: 2px solid #42b983;
}

h1 {
    margin-top: 20px;
    color: #2c3e50;
}

main {
    margin-top: 20px;
}
</style>
