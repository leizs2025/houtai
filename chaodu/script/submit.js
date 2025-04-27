// ✅ 提交新增数据到 GAS 的 doPost 接口

function submitData() {
  const payload = buildPayload();
  payload.action = "create";

  fetch("https://form.gealarm2012.workers.dev/admin-chaodu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  clearForm()
  .catch(err => alert("提交失败: " + err));
}



function buildPayload() {
  const getVal = id => document.getElementById(id)?.value?.trim() || "";

  const data = {
    name: getVal("mainName"),
    phone: getVal("phoneNumber"),
    address: getVal("address"),
    festival: getVal("festival"),
    donation: getVal("donation"),  // 注意: donation也是 ""，不是 0
    receiptNo: getVal("receiptNumber"),
    receiptDate: getVal("receiptDate"),
    ritualType: getVal("festival"),
    admin: localStorage.getItem("admin") || "",
    moveToTop: true,
    totalAmount: "",
    ancestor: [],
    baby: [],
    enemy: [],
    past: [],
    ground: []
  };

  const groupIds = {
    ancestor: "group-ancestor",
    baby: "group-baby",
    enemy: "group-enemy",
    past: "group-past",
    ground: "group-ground"
  };

  Object.entries(groupIds).forEach(([key, domId]) => {
    const container = document.getElementById(domId);
    const cards = container.querySelectorAll(".card");
    cards.forEach(card => {
      const obj = {};
      card.querySelectorAll("input[data-key], select[data-key]").forEach(input => {
        const fieldKey = input.dataset.key;
        obj[fieldKey] = input.value?.trim() || "";
      });
      data[key].push(obj);
    });
  });

  // totalAmount因为页面上会算出来，所以这里单独计算，不影响传输逻辑
  const priceMap = { token: 5, boat: 30, lotus: 6, paper3: 3, paper6: 6, paper27: 27 };
  let total = 0;

  ["ancestor", "baby", "enemy", "past", "ground"].forEach(group => {
    data[group].forEach(item => {
      Object.entries(priceMap).forEach(([field, price]) => {
        const value = parseFloat(item[field]);
        if (!isNaN(value)) total += value * price;
      });
    });
  });

  const donationVal = parseFloat(data.donation);
  if (!isNaN(donationVal)) total += donationVal;

  data.totalAmount = total ? total.toFixed(2) : "";

  return data;
}

