// 更新保存：saveChanges
window.saveChanges = function () {
  const body = getCurrentFormData();

  if (!body.mainName || !body.phoneNumber) {
    alert("⚠️ 主祈者姓名与手机号必填");
    return;
  }

  body.method = "PUT"; // ✅ 一定要是 PUT（与你后端一致）
  body.total = window.currentTotalAmount || 0;
  body.admin = localStorage.getItem("admin") || "未登录";

  fetch("https://form.gealarm2012.workers.dev/admin-qifu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("✅ 已更新资料");
      } else {
        alert(`❌ 更新失败：${result.message || '未知错误'}`);
      }
    })
    .catch(err => {
      alert("❌ 更新异常：" + err.message);
    });
};
