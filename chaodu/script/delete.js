function deleteEntry() {
  const phone = document.getElementById("phoneNumber")?.value?.trim();
  if (!phone) return alert("请填写手机号");
  if (!confirm(`确认要删除 ${phone} 的数据？此操作无法恢复。`)) return;

  fetch("https://form.gealarm2012.workers.dev/admin-chaodu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", phone })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  clearForm()
  .catch(err => alert("删除失败: " + err));
}
