document.addEventListener("DOMContentLoaded", () => {
  // Hàm tách số tiền từ chuỗi, trả về số (int)
  function extractPrice(str) {
    if (!str) return 0;
    // Tìm số tiền (có thể có dấu phẩy) sau dấu '-'
    const match = str.match(/- *([\d.,]+)/);
    if (match && match[1]) {
      // Loại bỏ dấu phẩy và chấm, chỉ giữ số
      return parseInt(match[1].replace(/[^0-9]/g, ""), 10);
    }
    return 0;
  }

  let reportData = []; // Thêm biến toàn cục để lưu dữ liệu gốc

  // Đổi đường dẫn fetch cho đúng context nếu cần (ví dụ: /Bloodline-DNA-Test-Service-MS/admin-report)
  fetch('http://localhost:8080/api/admin-report')
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalUsers").textContent = data.totalUsers || 0;
      document.getElementById("totalTests").textContent = data.totalTests || 0;

      // Lưu dữ liệu gốc để filter
      reportData = data.tests || [];

      // Tính tổng doanh thu từ mảng tests
      let totalRevenue = 0;
      if (reportData.length > 0) {
        totalRevenue = reportData.reduce((sum, item) => sum + extractPrice(item.price), 0);
      }
      document.getElementById("totalRevenue").textContent = totalRevenue.toLocaleString() + "đ";

      renderTable(reportData); // Render bảng lần đầu
    })
    .catch(err => {
      alert("Lỗi khi tải dữ liệu báo cáo!");
      console.error(err);
    });

  // Hàm render lại bảng
  function renderTable(dataArr) {
    const tbody = document.querySelector("#reportTable tbody");
    tbody.innerHTML = "";
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td>${item.userName}</td>
          <td>${item.testCode}</td>
          <td>${item.testDate}</td>
          <td>${item.price}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = "<tr><td colspan='5'>Không có dữ liệu</td></tr>";
    }
  } 

  document.getElementById('filterBtn').addEventListener('click', function() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const searchUser = document.getElementById('searchUser').value.trim().toLowerCase();

    const filtered = reportData.filter(item => {
      const testDate = item.testDate; // Định dạng yyyy-mm-dd
      const userName = item.userName.toLowerCase();
      let matchDate = true, matchUser = true;

      if (fromDate) matchDate = testDate >= fromDate;
      if (toDate) matchDate = matchDate && testDate <= toDate;
      if (searchUser) matchUser = userName.includes(searchUser);

      return matchDate && matchUser;
    });

    renderTable(filtered);
  });

  document.getElementById('exportBtn').addEventListener('click', function() {
    const table = document.getElementById('reportTable');
    if (!table) {
      alert("Không tìm thấy bảng dữ liệu!");
      return;
    }
    // Chuyển bảng HTML thành workbook Excel
    const wb = XLSX.utils.table_to_book(table, {sheet: "Báo cáo"});
    XLSX.writeFile(wb, "bao_cao_xet_nghiem.xlsx");
  });
});
