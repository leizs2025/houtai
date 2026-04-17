// print.js

window.printReceipt = function (data) {
    const receiptInput = document.getElementById("receiptNumber");
    let receiptNumber = receiptInput.value.trim();

    // ✅ 获取系统ID
    const SYSTEM_ID = getCurrentSystemId();

    // ✅ 只在没有编号时生成
    if (!receiptNumber || receiptNumber === "未生成") {
        receiptNumber = generateReceiptNumber();
        data.receiptNumber = receiptNumber;
        receiptInput.value = receiptNumber;
        console.log("已生成并临时保存小票编号:", receiptNumber);

        // ✅ 临时保存这个编号，等待保存时一起提交（使用系统特定的键）
        localStorage.setItem(`lastPrintedReceiptNumber_${SYSTEM_ID}`, receiptNumber);
    } else {
        // ✅ 如果已有编号，直接使用
        data.receiptNumber = receiptNumber;
        console.log("已使用已有小票编号:", receiptNumber);
    }

    // ✅ 打开 80mm 小票打印窗口，并传递系统ID
    const printUrl = `receipt.html?system_id=${SYSTEM_ID}`;
    const printWindow = window.open(printUrl, "_blank", "width=320,height=1000");

    // 确保页面加载完成再发送数据
    const interval = setInterval(() => {
        if (printWindow && printWindow.document.readyState === "complete") {
            clearInterval(interval);
            printWindow.postMessage(JSON.stringify(data), "*");
        }
    }, 100);
};

// 获取系统ID的辅助函数
function getCurrentSystemId() {
    // 方法1: 从URL参数获取
    const urlParams = new URLSearchParams(window.location.search);
    const systemId = urlParams.get('system_id');
    if (systemId && systemId.trim()) {
        return systemId.trim();
    }

    // 方法2: 从全局变量获取
    if (typeof SYSTEM_ID !== 'undefined' && SYSTEM_ID) {
        return SYSTEM_ID;
    }

    // 方法3: 从页面元素获取
    const systemIdElement = document.querySelector('[name="system_id"], #system_id');
    if (systemIdElement && systemIdElement.value) {
        return systemIdElement.value.trim();
    }

    // 默认返回
    return 'system_1';
}
