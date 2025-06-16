import { defineStore } from "pinia";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useUrlStore = defineStore("url", {
  state: () => ({
    urls: [],
    loading: false,
    error: null,
    currentUrl: null,
  }),
  actions: {
    async shortenUrl(longUrl, expiresAt) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ url: longUrl, expiresAt }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error shortening URL");
        }

        // Use the short URL from the API response
        this.currentUrl = data;
        this.urls.unshift(data);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUrls() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/url/urls`, {
          credentials: "include", // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error("Failed to fetch URLs");
        }
        const data = await response.json();
        this.urls = data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUrlAnalytics(shortId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/analytics/${shortId}`,
          {
            credentials: "include", // Ensure cookies/session are sent
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch URL analytics");
        }
        const data = await response.json();
        this.currentUrl = data;
        return data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async editOriginalUrl(shortId, originalUrl) {
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/url/${shortId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ originalUrl }),
        });
        if (!response.ok) {
          throw new Error("Failed to update URL");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async toggleActive(url) {
      this.error = null;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/url/${url.shortUrl}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ active: !url.active }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to toggle active status");
        }
        const data = await response.json();
        url.active = data.active;
        return data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async editExpiration(shortId, expiresAt) {
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/api/url/${shortId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ expiresAt }),
        });
        if (!response.ok) {
          throw new Error("Failed to update expiration");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
