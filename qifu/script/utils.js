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

// utils.js (祈福系统 - 支持多实例)

window.generateReceiptNumber = function () {
    // 获取系统ID（可以通过URL参数或全局变量获取）
    const SYSTEM_ID = getCurrentSystemId();

    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);       // 两位年，如 "25"
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 两位月，如 "05"
    const ymKey = `${year}${month}`;  // "2505"

    // 使用系统特定的键名
    const counterKey = `receiptCounter_${SYSTEM_ID}`;
    const yearMonthKey = `receiptYearMonth_${SYSTEM_ID}`;

    const storedYM = localStorage.getItem(yearMonthKey);

    // ✅ 如果年月变了，重置计数器
    if (storedYM !== ymKey) {
        localStorage.setItem(counterKey, 1);
        localStorage.setItem(yearMonthKey, ymKey);
    }

    // ✅ 读取当前计数器
    let counter = parseInt(localStorage.getItem(counterKey), 10);
    if (isNaN(counter) || counter < 1) {
        counter = 1;
    }

    // ✅ 生成编号，例如 LQFR-2505-0001
    const receiptNumber = `LQFR-${ymKey}-${String(counter).padStart(4, '0')}`;

    // ✅ 增加计数器并保存
    localStorage.setItem(counterKey, counter + 1);

    return receiptNumber;
};

// 获取当前系统ID的函数
function getCurrentSystemId() {
    // 方法1: 从URL参数获取
    const urlParams = new URLSearchParams(window.location.search);
    const systemId = urlParams.get('system_id');
    if (systemId && systemId.trim()) {
        return systemId.trim();
    }

    // 方法2: 从全局变量获取（如果在页面中定义了SYSTEM_ID）
    if (typeof SYSTEM_ID !== 'undefined' && SYSTEM_ID) {
        return SYSTEM_ID;
    }

    // 方法3: 从页面元素获取
    const systemIdElement = document.querySelector('[name="system_id"], #system_id');
    if (systemIdElement && systemIdElement.value) {
        return systemIdElement.value.trim();
    }

    // 默认返回，但建议在实际部署时明确指定系统ID
    return 'system_1'; // 请根据实际情况修改为 'system_2', 'system_3' 等
}

// 修正重置计数器函数，支持系统特定的重置
function resetReceiptCounter() {
    const SYSTEM_ID = getCurrentSystemId();
    
    // 重置当前系统特定的计数器
    localStorage.removeItem(`receiptCounter_${SYSTEM_ID}`);
    localStorage.removeItem(`receiptYearMonth_${SYSTEM_ID}`);
    localStorage.removeItem(`lastPrintedReceiptNumber_${SYSTEM_ID}`);
    
    console.log(`✅ 系统${SYSTEM_ID}的编号计数器已重置`);
    alert(`✅ 系统${SYSTEM_ID}的编号计数器已重置`);
}
