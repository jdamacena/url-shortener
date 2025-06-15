import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import UrlShortener from "./components/UrlShortener.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import UrlAnalytics from "./components/UrlAnalytics.vue";
import NotFound from "./components/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: UrlShortener },
    {
      path: "/dashboard",
      component: () => import("./components/Dashboard.vue"),
    },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/analytics/:shortUrl", component: UrlAnalytics },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
