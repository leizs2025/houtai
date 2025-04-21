// 页面初始化与登录验证
window.addEventListener("DOMContentLoaded", () => {
  const admin = localStorage.getItem("admin");
  if (!admin) {
    alert("请先登录后台系统");
    window.location.href = "login.html";
    return;
  }
  document.getElementById("whoLogin").textContent = admin;
});

// 启动新增表单模式
window.startNewEntry = function () {
  selectedEntry = null;
  document.getElementById("adminForm").classList.remove("d-none");

  document.getElementById("mainName").value = "";
  document.getElementById("phoneNumber").value = "";
  document.getElementById("dharmaType").value = "";
  document.getElementById("receiptNumber").value = "";
  document.getElementById("receiptDate").value = "";
  document.getElementById("sponsorAmount").value = "0";

  const container = document.getElementById("prayersContainer");
  container.innerHTML = "";
  container.appendChild(createPrayerBlock({}, 1));

  updateDonationBreakdown();
};

// 添加祈福者卡片
window.addPrayer = function () {
  const container = document.getElementById("prayersContainer");
  const currentCount = container.children.length;
  if (currentCount >= 13) {
    alert("⚠️ 最多只能添加 13 位祈福者！");
    return;
  }
  container.appendChild(createPrayerBlock({}, currentCount + 1));
  updateDonationBreakdown();
};