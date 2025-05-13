// 金额明细表格生成器
window.generateDonationTable = function (prayersData, sponsorAmount = 0) {
  let token = 0, fire = 0, pg3 = 0, pg6 = 0;

  prayersData.forEach(p => {
    token += +p.token || 0;
    fire  += +p.fire || 0;
    pg3   += +p.pg3 || 0;
    pg6   += +p.pg6 || 0;
  });

  const tokenAmt = token * 5;
  const fireAmt  = fire * 1;
  const pg3Amt   = pg3 * 3;
  const pg6Amt   = pg6 * 6;
  const total    = tokenAmt + fireAmt + pg3Amt + pg6Amt + (+sponsorAmount || 0);

  return `
    <table class="table table-borderless">
      <tbody>
        <tr><td class="text-start">祈福令牌</td><td class="text-end">5 RM × ${token} 个 = ${tokenAmt.toFixed(2)}</td></tr>
        <tr><td class="text-start">小护摩片</td><td class="text-end">1 RM × ${fire} 片 = ${fireAmt.toFixed(2)}</td></tr>
        <tr><td class="text-start">纸金 3</td><td class="text-end">3 RM × ${pg3} 份 = ${pg3Amt.toFixed(2)}</td></tr>
        <tr><td class="text-start">纸金 6</td><td class="text-end">6 RM × ${pg6} 份 = ${pg6Amt.toFixed(2)}</td></tr>
        <tr><td class="text-start">祈福报名供养金 (随喜赞助)</td><td class="text-end">= ${(+sponsorAmount).toFixed(2)}</td></tr>
        <tr class="fw-bold bg-light">
          <td class="text-start">合计总金额：</td>
          <td class="text-end fw-bold">RM ${total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;
};

// 表单数据收集器
window.getCurrentFormData = function () {
  const prayers = Array.from(document.getElementById("prayersContainer").children)
    .map(div => ({
      name: div.querySelector(".name")?.value?.trim() || "",
      address: div.querySelector(".address")?.value?.trim() || "",
      token: +div.querySelector(".token")?.value || 0,
      fire: +div.querySelector(".fire")?.value || 0,
      pg3: +div.querySelector(".pg3")?.value || 0,
      pg6: +div.querySelector(".pg6")?.value || 0,
    }))
    .filter(p => p.name); // 👈 忽略空卡片



  return {
    phoneNumber: document.getElementById("phoneNumber")?.value.trim() || "",
    mainName: document.getElementById("mainName")?.value.trim() || "",
    dharmaType: document.getElementById("dharmaType")?.value.trim() || "",
    receiptNumber: document.getElementById("receiptNumber")?.value.trim() || "",
    receiptDate: document.getElementById("receiptDate")?.value.trim() || "",
    sponsorAmount: +document.getElementById("sponsorAmount")?.value || 0,
    total: window.currentTotalAmount || 0, // ✅ ✨新增字段
    admin: localStorage.getItem("admin") || "未登录", // ✅ ✨新增字段
    data: prayers
  };
};

// utils.js

// ✅ 全局编号生成函数
window.generateReceiptNumber = function () {
  const currentYear = new Date().getFullYear();
  const storedYear = localStorage.getItem("receiptYear");

  // ✅ 如果年份变了，重置计数器
  if (storedYear !== String(currentYear)) {
      localStorage.setItem("receiptCounter", 1);
      localStorage.setItem("receiptYear", currentYear);
  }

  // ✅ 读取当前计数器
  let counter = parseInt(localStorage.getItem("receiptCounter")) || 1;

  // ✅ 生成编号，例如 MLTS-2025-0001
  const receiptNumber = `LQF-${currentYear}-${String(counter).padStart(4, '0')}`;

  // ✅ 增加计数器并保存到 localStorage
  localStorage.setItem("receiptCounter", counter + 1);

  return receiptNumber;
};
// utils.js 或 init.js

function resetReceiptCounter() {
  localStorage.removeItem("receiptCounter");
  localStorage.removeItem("receiptYear");
  localStorage.removeItem("lastPrintedReceiptNumber");
  console.log("✅ 编号计数器已重置");
  alert("✅ 编号计数器已重置");
}
