// Biến dùng để lưu tr của dòng đang xem
let currentTr = null;

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "";

  // Nếu không có username thì gọi API /all
  let apiUrl = "";
  if (!username) {
    apiUrl = "http://localhost:8080/api/orders/all";
  } else {
    apiUrl = `http://localhost:8080/api/orders?username=${encodeURIComponent(
      username
    )}`;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Không lấy được dữ liệu");
      return response.json();
    })
    .then((data) => {
      // Lọc chỉ các mẫu đang xét nghiệm
      const processingOrders = data.filter(
        (order) =>
          order.status &&
          (order.status === "1" ||
            order.status.trim().toLowerCase() === "chờ kết quả")
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
    row.innerHTML = `<td colspan="5" style="text-align: center; color: gray;">Không có mẫu đang chờ kết quả.</td>`;
    tableBody.appendChild(row);
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.dataset.id = order.id || "";
    row.dataset.name = order.recipientName || "";
    row.dataset.date = order.receivedDate || order.appointmentDate || "";
    row.dataset.status = mapStatusText(order.status);
    row.dataset.type = order.testType || "Chưa có thông tin";

    row.innerHTML = `
      <td>${order.id || "N/A"}</td>
      <td>${order.customerName || order.username || "Ẩn danh"}</td>
      <td>${order.receivedDate || order.appointmentDate || "Chưa nhận"}</td>
      <td><span class="status ${getStatusClass(order.status)}">${mapStatusText(
      order.status
    )}</span></td>
      <td>
        <button class="action-btn view-btn" title="Xem chi tiết">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn advance-status-btn" title="Tăng trạng thái">
          <i class="fas fa-arrow-up"></i>
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

      document.getElementById("modal-id").textContent = tr.dataset.id;
      document.getElementById("modal-name").textContent = tr.dataset.name;
      document.getElementById("modal-date").textContent = tr.dataset.date;
      document.getElementById("modal-status").textContent = tr.dataset.status;
      document.getElementById("modal-type").textContent = tr.dataset.type;

      document.getElementById("specimen-modal").style.display = "flex";
    });
  });
}

// Đóng modal khi bấm ra ngoài hoặc nút đóng
document
  .getElementById("specimen-modal")
  .addEventListener("click", function (e) {
    if (e.target === this) this.style.display = "none";
  });

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("specimen-modal").style.display = "none";
  });
});

// Chuyển số trạng thái sang chữ
function mapStatusText(status) {
  switch (status.toString()) {
    case "0":
    case "đang xét nghiệm":
      return "Đang xét nghiệm";
    case "1":
    case "chờ kết quả":
      return "Chờ kết quả";
    case "2":
    case "đã hoàn thành":
      return "Đã hoàn thành";
    default:
      return status || "Không rõ";
  }
}

// Hàm đổi class màu trạng thái
function getStatusClass(status) {
  const value = status?.toString().toLowerCase();
  if (value === "0" || value.includes("đang")) return "processing";
  if (value === "1" || value.includes("chờ")) return "pending";
  if (value === "2" || value.includes("hoàn thành")) return "completed";
  return "";
}

// Gắn sự kiện nút tăng trạng thái
document.addEventListener("click", function (e) {
  if (e.target.closest(".advance-status-btn")) {
    const btn = e.target.closest(".advance-status-btn");
    const tr = btn.closest("tr");
    const orderId = tr.dataset.id;
    const currentStatusText = tr.dataset.status;

    const statusMap = {
      "Đang xét nghiệm": 0,
      "Chờ kết quả": 1,
      "Đã hoàn thành": 2,
    };
    let currentStatus = statusMap[currentStatusText];
    if (currentStatus === undefined || currentStatus >= 2) return;

    const newStatus = currentStatus + 1;
    const newStatusText = Object.keys(statusMap).find(
      (key) => statusMap[key] === newStatus
    );

    const confirmed = confirm(
      `Bạn có chắc muốn chuyển trạng thái mẫu ${orderId} từ "${currentStatusText}" sang "${newStatusText}" không?`
    );
    if (!confirmed) return;

    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus.toString() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then((updatedOrder) => {
        if (newStatus > 0) {
          tr.remove(); // Xóa dòng khỏi bảng nếu không còn trong "Đang xử lý"
        } else {
          tr.dataset.status = mapStatusText(newStatus.toString());
          const statusSpan = tr.querySelector("span.status");
          statusSpan.textContent = mapStatusText(newStatus.toString());
          statusSpan.className =
            "status " + getStatusClass(newStatus.toString());
        }
        alert("Đã cập nhật trạng thái thành công!");
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi khi cập nhật trạng thái.");
      });
  }
});
