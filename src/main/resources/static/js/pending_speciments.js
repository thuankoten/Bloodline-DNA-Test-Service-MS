// Gán trạng thái cần lọc ở đây
const FILTER_STATUS = "Chờ kết quả"; 
let currentTr = null;

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "";

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
      const filteredOrders = data.filter(
        (order) => order.status && order.status.trim() === FILTER_STATUS
      );
      renderSpecimenTable(filteredOrders);
    })
    .catch((error) => console.error("Lỗi khi tải dữ liệu", error));
});

function renderSpecimenTable(orders) {
  const tableBody = document.querySelector("table.data-table tbody");
  tableBody.innerHTML = "";

  if (orders.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      `<td colspan="5" style="text-align: center; color: gray;">Không có mẫu với trạng thái "${FILTER_STATUS}".</td>`;
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
      <td><span class="status ${getStatusClass(order.status)}">${order.status || "Không rõ"}</span></td>
      <td>
        <button class="action-btn view-btn" title="Xem chi tiết">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachEventHandlers();
}

function attachEventHandlers() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tr = btn.closest("tr");

      document.getElementById("modal-id").textContent = tr.dataset.id;
      document.getElementById("modal-name").textContent = tr.dataset.name;
      document.getElementById("modal-date").textContent = tr.dataset.date;
      document.getElementById("modal-status").textContent = tr.dataset.status;
      document.getElementById("modal-type").textContent = tr.dataset.type;

      document.getElementById("specimen-modal").style.display = "flex";
    });
  });
}

document.getElementById("specimen-modal").addEventListener("click", function (e) {
  if (e.target === this) this.style.display = "none";
});
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("specimen-modal").style.display = "none";
  });
});

function getStatusClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s.includes("hoàn thành")) return "completed";
  if (s.includes("chờ")) return "pending";
  if (s.includes("đang")) return "processing";
  return "unknown";
}
