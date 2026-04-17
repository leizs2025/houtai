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

// utils.js (添加缓存功能)

// 生成收据编号的函数（保持原有逻辑）
window.generateReceiptNumber = function () {
    const SYSTEM_ID = getCurrentSystemId();

    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ymKey = `${year}${month}`;

    const counterKey = `receiptCounter_${SYSTEM_ID}`;
    const yearMonthKey = `receiptYearMonth_${SYSTEM_ID}`;

    const storedYM = localStorage.getItem(yearMonthKey);

    if (storedYM !== ymKey) {
        localStorage.setItem(counterKey, 1);
        localStorage.setItem(yearMonthKey, ymKey);
    }

    let counter = parseInt(localStorage.getItem(counterKey), 10);
    if (isNaN(counter) || counter < 1) {
        counter = 1;
    }

    const receiptNumber = `LQFR-${ymKey}-${String(counter).padStart(4, '0')}`;
    localStorage.setItem(counterKey, counter + 1);

    return receiptNumber;
};

// 缓存当日收据的功能
window.cacheReceiptData = function (data) {
    const SYSTEM_ID = getCurrentSystemId();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 生成唯一的缓存键
    const cacheKey = `daily_receipts_${today}_${SYSTEM_ID}`;
    
    // 获取现有的缓存数据
    let cachedReceipts = JSON.parse(localStorage.getItem(cacheKey) || []);
    
    // 添加当前收据数据
    const receiptEntry = {
        timestamp: new Date().toISOString(),
        receiptData: data,
        systemId: SYSTEM_ID
    };
    
    cachedReceipts.push(receiptEntry);
    
    // 保存回localStorage
    localStorage.setItem(cacheKey, JSON.stringify(cachedReceipts));
    
    console.log(`收据已缓存: ${data.receiptNumber || 'N/A'}`);
};

// 获取当日缓存的收据
window.getDailyCachedReceipts = function (date = null) {
    const SYSTEM_ID = getCurrentSystemId();
    const today = date || new Date().toISOString().split('T')[0];
    
    const cacheKey = `daily_receipts_${today}_${SYSTEM_ID}`;
    return JSON.parse(localStorage.getItem(cacheKey) || []);
};

// 清空当日缓存（通常在A4打印后调用）
window.clearDailyCache = function (date = null) {
    const SYSTEM_ID = getCurrentSystemId();
    const today = date || new Date().toISOString().split('T')[0];
    
    const cacheKey = `daily_receipts_${today}_${SYSTEM_ID}`;
    localStorage.removeItem(cacheKey);
    console.log(`已清空 ${today} 的缓存数据`);
};

// 获取系统ID的函数
function getCurrentSystemId() {
    const urlParams = new URLSearchParams(window.location.search);
    const systemId = urlParams.get('system_id');
    if (systemId && systemId.trim()) {
        return systemId.trim();
    }
    
    if (typeof SYSTEM_ID !== 'undefined' && SYSTEM_ID) {
        return SYSTEM_ID;
    }
    
    const systemIdElement = document.querySelector('[name="system_id"], #system_id');
    if (systemIdElement && systemIdElement.value) {
        return systemIdElement.value.trim();
    }
    
    return 'system_1';
}
