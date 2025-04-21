// 新增保存：forceInsertNewEntry
window.forceInsertNewEntry = function () {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) return alert("⚠️ 请填写手机号");

  const body = getCurrentFormData();
  if (!body.mainName || !body.phoneNumber) {
    alert("⚠️ 主祈者姓名与手机号必填");
    return;
  }

  body.method = "POST";
  body.admin = localStorage.getItem("admin") || "未登录";
  body.total = window.currentTotalAmount || 0;

  fetch("https://form.gealarm2012.workers.dev/admin-qifu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("✅ 新增成功");
        startNewEntry(); // 清空页面并准备新表单
      } else {
        alert("❌ 新增失败：" + result.message);
      }
    })
    .catch(err => alert("❌ 提交异常：" + err.message));
};
