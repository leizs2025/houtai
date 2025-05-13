// print.js

window.printReceipt = function (data) {
    const receiptInput = document.getElementById("receiptNumber");
    let receiptNumber = receiptInput.value.trim();

    // ✅ 只在没有编号时生成
    if (!receiptNumber || receiptNumber === "未生成") {
        receiptNumber = generateReceiptNumber();
        data.receiptNumber = receiptNumber;
        receiptInput.value = receiptNumber;
        console.log("已生成并临时保存小票编号:", receiptNumber);

        // ✅ 临时保存这个编号，等待保存时一起提交
        localStorage.setItem("lastPrintedReceiptNumber", receiptNumber);
    } else {
        // ✅ 如果已有编号，直接使用
        data.receiptNumber = receiptNumber;
        console.log("已使用已有小票编号:", receiptNumber);
    }

    // ✅ 打开 80mm 小票打印窗口
    const printWindow = window.open("receipt.html", "_blank", "width=320,height=1000");

    // 确保页面加载完成再发送数据
    const interval = setInterval(() => {
        if (printWindow && printWindow.document.readyState === "complete") {
            clearInterval(interval);
            printWindow.postMessage(JSON.stringify(data), "*");
        }
    }, 100);
};
