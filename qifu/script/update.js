// 更新保存：saveChanges
window.saveChanges = function () {
  const body = getCurrentFormData();

  if (!body.mainName || !body.phoneNumber) {
    alert("⚠️ 主祈者姓名与手机号必填");
    return;
  }

  body.action = "update";
  body.total = window.currentTotalAmount || 0;
  body.admin = localStorage.getItem("admin") || "未登录";

  fetch("https://form.gealarm2012.workers.dev/admin-qifu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.text())
    .then(() => {
      alert("✅ 已更新资料");
    })
    .catch(err => {
      alert("❌ 更新异常：" + err.message);
    });
};
