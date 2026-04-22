window.printReceipt = function (data) {
    // ✅ 1. 第一步：立即打开窗口！不要放在后面，也不要放在定时器里
    // 这样能确保浏览器认为这是用户点击触发的
    const printUrl = `receipt.html?system_id=${getCurrentSystemId()}`;
    const printWindow = window.open(printUrl, "_blank", "width=320,height=1000");

    if (!printWindow) {
        alert("打印窗口被浏览器拦截！请允许该网站的弹窗权限。");
        return;
    }

    // 2. 处理小票编号逻辑
    const receiptInput = document.getElementById("receiptNumber");
    let receiptNumber = receiptInput ? receiptInput.value.trim() : "";
    const SYSTEM_ID = getCurrentSystemId();

    if (!receiptNumber || receiptNumber === "未生成") {
        receiptNumber = generateReceiptNumber();
        data.receiptNumber = receiptNumber;
        if(receiptInput) receiptInput.value = receiptNumber;
        console.log("已生成并临时保存小票编号:", receiptNumber);
        localStorage.setItem(`lastPrintedReceiptNumber_${SYSTEM_ID}`, receiptNumber);
    } else {
        data.receiptNumber = receiptNumber;
        console.log("已使用已有小票编号:", receiptNumber);
    }

    // ✅ 3. 缓存数据
    if (typeof cacheReceiptData === 'function') {
        cacheReceiptData(data);
    }

    // 4. 监听新窗口加载状态并发送数据
    // 使用 load 事件通常比 setInterval 更可靠
    printWindow.addEventListener('load', function() {
        console.log("打印窗口已加载，正在发送数据...");
        printWindow.postMessage(JSON.stringify(data), "*");
    });
    
    // 兜底方案：如果 load 事件没触发，保留你的定时器逻辑（但需确保 printWindow 存在）
    /* 
    const interval = setInterval(() => {
        if (printWindow && printWindow.document.readyState === "complete") {
            clearInterval(interval);
            printWindow.postMessage(JSON.stringify(data), "*");
        }
    }, 100); 
    */
};
