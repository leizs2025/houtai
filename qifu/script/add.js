// 新增保存：forceInsertNewEntry
window.forceInsertNewEntry = function () {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) return alert("⚠️ 请填写手机号");

  const body = getCurrentFormData();
  if (!body.mainName || !body.phoneNumber) {
    alert("⚠️ 主祈者姓名与手机号必填");
    return;
  }
      // ✅ 如果有临时编号，用这个编号
    const lastPrintedReceiptNumber = localStorage.getItem("lastPrintedReceiptNumber");
    if (lastPrintedReceiptNumber) {
        body.receiptNumber = lastPrintedReceiptNumber;
        document.getElementById("receiptNumber").value = lastPrintedReceiptNumber;
        console.log("已自动填入已打印的小票编号:", lastPrintedReceiptNumber);
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
        // 新增失败，但后端有明确错误信息
        alert(`❌ 新增失败：${result.message || '未知错误'}`);
      }
    })
    .catch(err => alert("❌ 提交异常：" + err.message));
};
