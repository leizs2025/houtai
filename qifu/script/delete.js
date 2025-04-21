// 删除整笔：deleteEntry
window.deleteEntry = function () {
  if (!selectedEntry) return alert("⚠️ 请先查询一笔资料再删除！");

  const confirmDelete = confirm(`确定要删除手机号「${selectedEntry.phoneNumber}」的资料吗？此操作不可恢复！`);
  if (!confirmDelete) return;

  fetch("https://form.gealarm2012.workers.dev/admin-qifu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "DELETE",
      phoneNumber: selectedEntry.phoneNumber
    })
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("✅ 删除成功");
        selectedEntry = null;
        document.getElementById("adminForm").classList.add("d-none");
        document.getElementById("resultSelector").innerHTML = "";
        document.getElementById("searchInput").value = "";
      } else {
        alert("❌ 删除失败：" + result.message);
      }
    })
    .catch(err => alert("❌ 删除异常：" + err.message));
};
