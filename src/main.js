import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import UrlShortener from "./components/UrlShortener.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import UrlAnalytics from "./components/UrlAnalytics.vue";
import NotFound from "./components/NotFound.vue";
import LinkExpired from "./components/LinkExpired.vue";
import Dashboard from "./components/Dashboard.vue";
import AdminPanel from "./components/AdminPanel.vue";
import "./assets/styles/main.css";
import { useAuthStore } from "./stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: UrlShortener },
    { path: "/dashboard", component: Dashboard },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/analytics/:shortUrl", component: UrlAnalytics },
    { path: "/expired", component: LinkExpired },
    {
      path: "/admin",
      name: "Admin",
      component: AdminPanel,
      // You may want to add route guards for admin here
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Auto-fetch user if token exists
const authStore = useAuthStore();
if (authStore.token) {
  authStore.fetchUser();
}

app.mount("#app");
