window.printEntry = function () {
  const formData = getCurrentFormData();

  const printWindow = window.open("print.html", "_blank");

  const interval = setInterval(() => {
    if (printWindow && printWindow.document.readyState === "complete") {
      clearInterval(interval);
      printWindow.postMessage(JSON.stringify(formData), "*");
    }
  }, 100);
};
