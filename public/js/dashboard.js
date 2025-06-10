document.getElementById('shorten-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const url = form.url.value;
  const resultDiv = document.getElementById('short-url-result');
  resultDiv.textContent = '';
  try {
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ url })
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

document.querySelectorAll('.toggle-active').forEach(btn => {
  btn.addEventListener('click', async function() {
    const id = this.getAttribute('data-id');
    const currentActive = this.getAttribute('data-active') === 'true';
    const res = await fetch(`/url/${id}/toggle-active`, { method: 'POST' });
    if (res.ok) {
      location.reload();
    }
  });
});

document.querySelectorAll('.copy-link-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const link = btn.getAttribute('data-link');
    navigator.clipboard.writeText(link);
    btn.classList.add('text-blue-600');
    btn.title = 'Copied!';
    setTimeout(() => {
      btn.title = 'Copy link';
      btn.classList.remove('text-blue-600');
    }, 1200);
  });
});
