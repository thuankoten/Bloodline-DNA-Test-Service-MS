// Biến dùng để lưu tr của dòng đang xem
let currentTr = null;

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "";

  // Nếu không có username thì gọi API /all
  let apiUrl = "http://localhost:8080/api/orders/all";
  if (!username) {
    apiUrl += "/all";
  } else {
    apiUrl += `?username=${encodeURIComponent(username)}`;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Không lấy được dữ liệu");
      return response.json();
    })
    .then((data) => {
      // Lọc chỉ các mẫu đang xét nghiệm
      const processingOrders = data.filter(
        (order) => order.status && order.status.trim() === "Đang xét nghiệm"
      );
      renderSpecimenTable(processingOrders);
    })
    .catch((error) => console.error("Lỗi khi tải dữ liệu", error));
});

// Hàm render bảng
function renderSpecimenTable(orders) {
  const tableBody = document.querySelector("table.data-table tbody");
  tableBody.innerHTML = "";

  if (orders.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      `<td colspan="5" style="text-align: center; color: gray;">Không có mẫu đang xét nghiệm.</td>`;
    tableBody.appendChild(row);
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.dataset.id = order.id || "";
    row.dataset.name = order.recipientName || "";
    row.dataset.date = order.receivedDate || order.appointmentDate || "";
    row.dataset.status = order.status || "";
    row.dataset.type = order.testType || "Chưa có thông tin";

    row.innerHTML = `
      <td>${order.id || "N/A"}</td>
      <td>${order.customerName || order.username || "Ẩn danh"}</td>
      <td>${order.receivedDate || order.appointmentDate || "Chưa nhận"}</td>
      <td><span class="status processing">${order.status || "Không rõ"}</span></td>
      <td>
        <button class="action-btn view-btn" title="Xem chi tiết">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachEventHandlers(); // Gắn sự kiện cho nút xem
}

// Gắn sự kiện cho nút xem
function attachEventHandlers() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tr = btn.closest("tr");

      // Lấy thông tin từ dòng đó và hiển thị lên modal
      document.getElementById("modal-id").textContent = tr.dataset.id;
      document.getElementById("modal-name").textContent = tr.dataset.name;
      document.getElementById("modal-date").textContent = tr.dataset.date;
      document.getElementById("modal-status").textContent = tr.dataset.status;
      document.getElementById("modal-type").textContent = tr.dataset.type;

      // Hiển thị modal xem
      document.getElementById("specimen-modal").style.display = "flex";
    });
  });
}

// Đóng modal khi bấm ra ngoài hoặc nút đóng
document.getElementById("specimen-modal").addEventListener("click", function (e) {
  if (e.target === this) this.style.display = "none";
});
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("specimen-modal").style.display = "none";
  });
});

// Hàm phụ nếu muốn đổi màu trạng thái (không bắt buộc)
function getStatusClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s.includes("hoàn thành")) return "completed";
  if (s.includes("chờ")) return "pending";
  if (s.includes("đang")) return "processing";
  return "unknown";
}
