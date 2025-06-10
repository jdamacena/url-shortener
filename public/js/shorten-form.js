document.addEventListener('DOMContentLoaded', function() {
  const shortenForm = document.getElementById('shorten-form');
  if (shortenForm) {
    shortenForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const url = form.url.value;
      const expiresAt = form.expiresAt.value;
      const resultDiv = document.getElementById('short-url-result');
      resultDiv.textContent = '';
      try {
        const params = new URLSearchParams();
        params.append('url', url);
        params.append('expiresAt', expiresAt); // Always include expiresAt
        const res = await fetch('/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });
        const data = await res.json();
        if (data.shortUrl) {
          resultDiv.innerHTML = `<span class='font-semibold'>Shortened URL:</span> <a href='${data.shortUrl}' class='text-blue-600 underline' target='_blank'>${data.shortUrl}</a>`;
        } else if (data.error) {
          resultDiv.innerHTML = `<span class='text-red-600'>${data.error}</span>`;
        }
      } catch (err) {
        resultDiv.innerHTML = `<span class='text-red-600'>An error occurred. Please try again.</span>`;
      }
    });
  }
});
