// print.js (修改版 - 添加缓存功能)

window.printReceipt = function (data) {
    const receiptInput = document.getElementById("receiptNumber");
    let receiptNumber = receiptInput.value.trim();

    const SYSTEM_ID = getCurrentSystemId();

    if (!receiptNumber || receiptNumber === "未生成") {
        receiptNumber = generateReceiptNumber();
        data.receiptNumber = receiptNumber;
        receiptInput.value = receiptNumber;
        console.log("已生成并临时保存小票编号:", receiptNumber);

        localStorage.setItem(`lastPrintedReceiptNumber_${SYSTEM_ID}`, receiptNumber);
    } else {
        data.receiptNumber = receiptNumber;
        console.log("已使用已有小票编号:", receiptNumber);
    }

    // ✅ 缓存收据数据
    cacheReceiptData(data);

    const printUrl = `receipt.html?system_id=${SYSTEM_ID}`;
    const printWindow = window.open(printUrl, "_blank", "width=320,height=1000");

    const interval = setInterval(() => {
        if (printWindow && printWindow.document.readyState === "complete") {
            clearInterval(interval);
            printWindow.postMessage(JSON.stringify(data), "*");
        }
    }, 100);
};

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
