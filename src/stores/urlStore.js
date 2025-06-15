import { defineStore } from "pinia";

export const useUrlStore = defineStore("url", {
  state: () => ({
    urls: [],
    loading: false,
    error: null,
    currentUrl: null,
  }),
  actions: {
    async shortenUrl(longUrl) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: longUrl }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error shortening URL");
        }

        // Use the short URL from the API response
        const shortUrl =
          data.shortUrl || `${window.location.origin}/${data.shortId}`;

        // Add to local state
        this.urls.unshift({
          originalUrl: longUrl,
          shortUrl,
          clicks: 0,
          createdAt: new Date(),
          active: true,
        });

        return shortUrl;
      } catch (error) {
        this.error = error.message || "Error shortening URL";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUrls() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/urls");
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
        const response = await fetch(`/api/analytics/${shortId}`);
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
  },
});
