document.addEventListener("DOMContentLoaded", () => {
  window.selectedEntry = null;
  let fullData = [];

  window.searchPhone = function () {
    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) return alert("请输入手机号关键字");

    fetch(`https://form.gealarm2012.workers.dev/admin-qifu?search=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(data => {
        console.log("📦 实际返回内容 data：", data);

        const info = Array.isArray(data) ? data[0] : data;
        const prayers = info.data || info.prayers || [];

        if (!Array.isArray(prayers)) {
          console.error("❌ 缺少祈福人信息字段", data);
          alert("数据错误：缺少祈福人信息");
          return;
        }

        info.prayers = prayers;
        info.data = prayers; // ✅ 保持兼容 update.js 和后端结构
        fullData = data;

        const selector = document.getElementById("resultSelector");
        selector.innerHTML = "";

        if (data.length === 0) {
          selector.textContent = "未找到资料";
          return;
        }

        if (data.length === 1) {
          selectedEntry = info;
          setTimeout(() => renderForm(selectedEntry), 0);
        } else {
          const select = document.createElement("select");
          select.className = "form-select";
          select.innerHTML = `<option selected disabled>请选择一笔资料</option>`;
          select.onchange = () => {
            const index = select.selectedIndex - 1;
            if (index >= 0) {
              selectedEntry = fullData[index];
              selectedEntry.prayers = selectedEntry.data || selectedEntry.prayers || [];
              selectedEntry.data = selectedEntry.prayers;
              setTimeout(() => renderForm(selectedEntry), 0);
            }
          };
          data.forEach(item => {
            const option = document.createElement("option");
            option.textContent = `${item.phoneNumber} - ${item.mainName}`;
            select.appendChild(option);
          });
          selector.appendChild(select);
        }
      })
      .catch(err => {
        console.error("❌ 查询异常：", err.stack || err);
        alert("查询失败：" + err.message);
      });
  };

  function padDate(input) {
    if (!input) return "";
    const date = new Date(input);
    if (isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function createPrayerBlock(data = {}, index = 1) {
    const div = document.createElement("div");
    div.className = "card p-3 mb-3 position-relative";

    const tokenVal = data.token !== undefined ? data.token : '';
    const fireVal = data.fire !== undefined ? data.fire : '';
    const pg3Val = data.pg3 !== undefined ? data.pg3 : '';
    const pg6Val = data.pg6 !== undefined ? data.pg6 : '';

    div.innerHTML = `
      <div style="position:absolute; top:5px; right:10px; cursor:pointer;" onclick="this.parentElement.remove(); updateDonationBreakdown()">❌</div>
      <h6 class="mb-3">🧍‍♀️ 第 ${index} 位祈福者</h6>
      <div class="row g-3">
        <div class="col-md-4">
          <label>姓名</label>
          <input type="text" class="form-control name" value="${data.name || ''}">
        </div>
        <div class="col-md-8">
          <label>现居地址</label>
          <input type="text" class="form-control address" value="${data.address || ''}">
        </div>
      </div>
      <div class="row g-3 mt-2">
        <div class="col-md-3">
          <label>祈福令牌</label>
          <input type="number" class="form-control token" value="${+tokenVal ? tokenVal : ''}" oninput="updateDonationBreakdown()">
        </div>
        <div class="col-md-3">
          <label>小护摩片</label>
          <input type="number" class="form-control fire" value="${+fireVal ? fireVal : ''}" oninput="updateDonationBreakdown()">
        </div>
        <div class="col-md-3">
          <label>纸金 3</label>
          <input type="number" class="form-control pg3" value="${+pg3Val ? pg3Val : ''}" oninput="updateDonationBreakdown()">
        </div>
        <div class="col-md-3">
          <label>纸金 6</label>
          <input type="number" class="form-control pg6" value="${+pg6Val ? pg6Val : ''}" oninput="updateDonationBreakdown()">
        </div>
      </div>
    `;
    return div;
  }

  window.renderForm = function (entry) {
    const container = document.getElementById("prayersContainer");
    if (!container) return alert("页面未加载完成，请刷新");

    const formBlock = document.getElementById("adminForm");
    if (!formBlock) return alert("表单结构缺失！");

    formBlock.classList.remove("d-none");

    document.getElementById("mainName").value = entry.mainName || "";
    document.getElementById("phoneNumber").value = entry.phoneNumber || "";
    document.getElementById("dharmaType").value = entry.dharmaType || "";
    document.getElementById("receiptNumber").value = entry.receiptNumber || "";
    document.getElementById("receiptDate").value = padDate(entry.receiptDate);
    document.getElementById("sponsorAmount").value = entry.sponsorAmount || "";

    container.innerHTML = "";

    const prayers = entry.prayers || [];
    prayers.forEach((item, index) => {
      const allEmpty = !item.name?.trim() && !+item.token && !+item.fire && !+item.pg3 && !+item.pg6;
      if (!allEmpty) container.appendChild(createPrayerBlock(item, index + 1));
    });

    if (container.children.length === 0) {
      container.appendChild(createPrayerBlock({}, 1));
    }

    let token = 0, fire = 0, pg3 = 0, pg6 = 0;
    prayers.forEach(p => {
      token += +p.token || 0;
      fire  += +p.fire || 0;
      pg3   += +p.pg3 || 0;
      pg6   += +p.pg6 || 0;
    });
    const sponsor = +entry.sponsorAmount || 0;
    window.currentTotalAmount = token * 5 + fire * 1 + pg3 * 3 + pg6 * 6 + sponsor;

    updateDonationBreakdown();
  };

});
