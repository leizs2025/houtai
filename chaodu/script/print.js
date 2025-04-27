// ✅ 打印当前表单内容为干净格式

function printEntry() {
  const win = window.open('', '_blank');
  if (!win) return alert("请允许弹窗以打印");

  const style = `<style>
    body { font-family: sans-serif; padding: 20px; }
    h2 { text-align: center; }
    .block { margin-bottom: 1rem; }
    .block label { display: block; font-weight: bold; margin-top: 0.5rem; }
    .block span { display: block; padding-left: 0.5rem; }
    hr { margin: 1.5rem 0; }
  </style>`;

  const get = id => document.getElementById(id)?.value || "";
  const fields = [
    { label: "阳上报恩人", value: get("mainName") },
    { label: "手机号", value: get("phoneNumber") },
    { label: "阳上地址", value: get("address") },
    { label: "法会类别", value: get("festival") },
    { label: "收据编号", value: get("receiptNumber") },
    { label: "收款日期", value: get("receiptDate") },
    { label: "随喜供养金额", value: `RM ${get("donation")}` }
  ];

  let html = `<h2>超度报名单</h2>${style}`;
  html += fields.map(f => `<div class='block'><label>${f.label}</label><span>${f.value}</span></div>`).join("");
  html += `<hr><h4>祖先 / 亡灵 报名</h4>`;

  const cards = document.querySelectorAll("#group-ancestor .card");
  cards.forEach((card, i) => {
    html += `<div class='block'><strong>第 ${i + 1} 位</strong></div>`;
    card.querySelectorAll("input, select").forEach(input => {
      const label = input.closest(".col-md-3, .col-md-6")?.querySelector("label")?.textContent;
      const val = input.value;
      if (label && val) html += `<div class='block'><label>${label}</label><span>${val}</span></div>`;
    });
    html += `<hr>`;
  });

  win.document.write(html);
  win.document.close();
  win.print();
}