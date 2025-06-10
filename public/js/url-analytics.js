document.addEventListener('DOMContentLoaded', function() {
  const showEditBtn = document.getElementById('show-edit-original-url');
  const editForm = document.getElementById('edit-original-url-form');
  const cancelEditBtn = document.getElementById('cancel-edit-original-url');
  const urlLinkGroup = document.getElementById('original-url-link-group');
  if (showEditBtn && editForm && cancelEditBtn && urlLinkGroup) {
    showEditBtn.addEventListener('click', function() {
      urlLinkGroup.style.display = 'none';
      editForm.style.display = '';
    });
    cancelEditBtn.addEventListener('click', function() {
      editForm.style.display = 'none';
      urlLinkGroup.style.display = '';
    });
  }
  if (editForm) {
    editForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const input = form.originalUrl.value;
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ originalUrl: input })
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert(data.error || 'Failed to update URL');
      }
    });
  }
});
