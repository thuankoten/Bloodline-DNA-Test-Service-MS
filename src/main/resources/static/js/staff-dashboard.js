// Hàm đổi màu class trạng thái
function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case "0":
    case "đang xét nghiệm":
      return "processing";
    case "1":
    case "chờ kết quả":
      return "pending";
    case "2":
    case "đã hoàn thành":
      return "completed";
    default:
      return "";
  }
}

// Hàm hiển thị tiếng Việt từ mã trạng thái
function getStatusLabel(status) {
  switch (status?.toString()) {
    case "0":
      return "Đang xét nghiệm";
    case "1":
      return "Chờ kết quả";
    case "2":
      return "Đã hoàn thành";
    default:
      return "Không rõ";
  }
}

// Hàm chuyển tiếng Việt thành mã để gửi lên server
function getStatusCode(label) {
  switch (label?.toLowerCase()) {
    case "đang xét nghiệm":
      return "0";
    case "chờ kết quả":
      return "1";
    case "đã hoàn thành":
      return "2";
    default:
      return "";
  }
}

let currentTr = null;

// Gọi API và render bảng
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "";

  let apiUrl = "http://localhost:8080/api/orders/all";
  if (username) {
    apiUrl = `http://localhost:8080/api/orders?username=${encodeURIComponent(
      username
    )}`;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Không lấy được dữ liệu");
      return response.json();
    })
    .then((data) => renderSpecimenTable(data))
    .catch((error) => console.error("Lỗi khi tải dữ liệu", error));
});

// Hàm render bảng mẫu xét nghiệm
function renderSpecimenTable(orders) {
  const tableBody = document.querySelector("table.data-table tbody");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.dataset.id = order.id || "";
    row.dataset.name = order.recipientName || "";
    row.dataset.date = order.appointmentDate || "";
    row.dataset.status = getStatusLabel(order.status);
    row.dataset.type = order.testType || "Chưa có thông tin";

    row.innerHTML = `
      <td>${order.id || "N/A"}</td>
      <td>${order.customerName || order.username || "Ẩn danh"}</td>
      <td>${order.receivedDate || order.appointmentDate || "Chưa nhận"}</td>
      <td><span class="status ${getStatusClass(order.status)}">${getStatusLabel(
      order.status
    )}</span></td>
      <td>
        <button class="action-btn view-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
        <button class="action-btn update-btn" title="Cập nhật trạng thái"><i class="fas fa-edit"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachEventHandlers();
}

// Hàm gắn lại các sự kiện sau khi render bảng
function attachEventHandlers() {
  // Sự kiện click xem thông tin mẫu xét nghiệm icon mắt
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tr = btn.closest("tr");
      const tds = tr.querySelectorAll("td");

      document.getElementById("modal-id").textContent =
        tr.dataset.id || tds[0].textContent;
      document.getElementById("modal-name").textContent =
        tr.dataset.name || tds[1].textContent;
      document.getElementById("modal-date").textContent =
        tr.dataset.date || tds[2].textContent;
      document.getElementById("modal-status").textContent =
        tr.dataset.status || tds[3].textContent;
      document.getElementById("modal-type").textContent =
        tr.dataset.type || "Chưa có thông tin";

      document.getElementById("specimen-modal").style.display = "flex";
    });
  });

  // Sự kiện cập nhật trạng thái
  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentTr = btn.closest("tr");
      const currentStatus = currentTr.querySelector(".status").innerText.trim();
      document.getElementById("status-select").value = currentStatus;
      document.getElementById("update-modal").style.display = "flex";
    });
  });
}

// Sự kiện lưu trạng thái mới khi bấm nút "Lưu"
document.getElementById("save-status-btn").onclick = function () {
  if (!currentTr) return;

  const newLabel = document.getElementById("status-select").value;
  const newStatusCode = getStatusCode(newLabel);
  const orderId = currentTr.dataset.id;

  fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatusCode }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Không cập nhật được mẫu");
      return res.json();
    })
    .then((updatedOrder) => {
      const statusSpan = currentTr.querySelector(".status");
      const newLabel = getStatusLabel(updatedOrder.status);

      statusSpan.innerText = newLabel;
      statusSpan.className = "status " + getStatusClass(updatedOrder.status);
      currentTr.dataset.status = newLabel;

      document.getElementById("update-modal").style.display = "none";
      alert("✔️ Đã cập nhật trạng thái");
    })
    .catch((err) => {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    });
};

// Đóng modal khi click ra ngoài
document.getElementById("specimen-modal").onclick = function (e) {
  if (e.target === this) this.style.display = "none";
};
document.getElementById("update-modal").onclick = function (e) {
  if (e.target === this) this.style.display = "none";
};

// Nút đóng modal
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.onclick = function () {
    document.getElementById("specimen-modal").style.display = "none";
    document.getElementById("update-modal").style.display = "none";
  };
});

document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('click', () => {
    const url = card.dataset.href;
    if (url) {
      window.location.href = url;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/api/orders/stats")
    .then(res => res.json())
    .then(data => {
      document.querySelector('.stat-card[data-href="speciments-processing.html"] h3').textContent = data.processing;
      document.querySelector('.stat-card[data-href="pending-speciments.html"] h3').textContent = data.pending;
      document.querySelector('.stat-card[data-href="completed-speciments.html"] h3').textContent = data.completed;
    })
    .catch(err => console.error("Lỗi tải thống kê:", err));
});
