function updateData() {
  const payload = buildPayload();
  payload.action = "update";
  payload.editingPhone = payload.phone;

  fetch("https://form.gealarm2012.workers.dev/admin-chaodu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  clearForm()
  .catch(err => alert("更新失败: " + err));
}
