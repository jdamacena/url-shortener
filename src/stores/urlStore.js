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
        const response = await fetch(`${API_BASE_URL}/api/url/urls`);
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
          `${API_BASE_URL}/api/analytics/${shortId}`
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
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/url/${shortId}/edit-original`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ originalUrl }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update URL");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
