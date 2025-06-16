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
import "./assets/styles/main.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: UrlShortener },
    { path: "/dashboard", component: Dashboard },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/analytics/:shortUrl", component: UrlAnalytics },
    { path: "/expired", component: LinkExpired },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
