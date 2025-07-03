// Sự kiện click xem thông tin mẫu xét nghiệm icon mắt
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // lấy dòng tr chứ nút click
    const tr = btn.closest("tr");
    // lấy tất cả các ô td trong dòng đó
    const tds = tr.querySelectorAll("td");

    // lấy thông tin data actribute(nếu có), nếu không lấy từ td
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
    // hiển thị modal
    document.getElementById("specimen-modal").style.display = "flex";
  });
});

// js điều chỉnh trạng thái mẫu xét nghiệm

let currentTr = null;
// bắt đầu sự kiện click vào nút (cập nhật trạng thái)
document.querySelectorAll(".update-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // lưu trạng thía <tr> hiện tại để sau này cập nhật
    currentTr = btn.closest("tr");
    // Hiện modal cập nhật trạng thái
    document.getElementById("update-modal").style.display = "flex";
    // lấy trạng thái hiện tại từ <span classs="status"> trong dòng đó
    const currentStatus = currentTr.querySelector(".status").innerText.trim();
    // đặt trạng thái hiện tại vào dropdown select
    document.getElementById("status-select").value = currentStatus;
  });
});

// 2. Khi bấm nút "lưu" trong modal cập nhật trạng thái
document.getElementById("save-status-btn").onclick = function () {
  if (currentTr) {
    // lấy trạng thái mới từ dropdown
    const newStatus = document.getElementById("status-select").value;
    // cập nhật nội dung trạng thái trong bảng span
    const statusSpan = currentTr.querySelector(".status");
    statusSpan.innerText = newStatus;
    // cập nhật class cho trạng thái để đổi màu sắc nếu có
    statusSpan.className = "status " + getStatusClass(newStatus);
    // cập nhật lại data-status trên <tr>
    currentTr.dataset.status = newStatus;
    // đóng modal
    document.getElementById("update-modal").style.display = "none";
  }
};

// gọi API render lên bảng xét nghiệm
document.addEventListener("DOMContentLoaded", function () {
  const username =  localStorage.getItem("username") || "";

  let apiUrl = "http://localhost:8080/api/orders/all";
  if (username) {
    apiUrl += `?username=${encodeURIComponent(username)}`;
  } else {
    apiUrl += "/all";
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Không lấy được dữ liệu");
      return response.json();
    })
    .then((data) => renderSpecimenTable(data))
    .catch((error) => console.error("Lỗi khi tải dữ liệu", error));
});

function renderSpecimenTable(orders) {
  const tableBody = document.querySelector("table.data-table tbody");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.dataset.id = order.id || "";
    row.dataset.name = order.recipientName || ""; // Tên người nhận
    row.dataset.date = order.appointmentDate || ""; // Ngày nhận
    row.dataset.status = order.status || ""; // Trạng tháiSSSSS
    row.dataset.type = order.testType || "Chưa có thông tin";

    row.innerHTML = `
      <td>${order.id || "N/A"}</td>
      <td>${order.customerName || order.username || "Ẩn danh"}</td>
      <td>${order.receivedDate || order.appointmentDate || "Chưa nhận"}</td>
      <td><span class="status ${getStatusClass(order.status)}">${
      order.status || "Không rõ"
    }</span></td>

      <td>
        <button class="action-btn view-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
        <button class="action-btn update-btn" title="Cập nhật trạng thái"><i class="fas fa-edit"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachEventHandlers();
}

// Sự kiện click xem thông tin mẫu xét nghiệm icon mắt
function attachEventHandlers() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tr = btn.closest("tr");
      document.getElementById("modal-id").textContent = tr.dataset.id;
      document.getElementById("modal-name").textContent = tr.dataset.name;
      document.getElementById("modal-date").textContent = tr.dataset.date;
      document.getElementById("modal-status").textContent = tr.dataset.status;
      document.getElementById("modal-type").textContent =
        tr.dataset.type || "Chưa có thông tin";
      document.getElementById("specimen-modal").style.display = "flex";
    });
  });

  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentTr = btn.closest("tr");
      const currentStatus = currentTr.querySelector(".status").innerText.trim();
      document.getElementById("status-select").value = currentStatus;
      document.getElementById("update-modal").style.display = "flex";
    });
  });
}

// Xử lý cập nhật trạng thái
document.getElementById("save-status-btn").onclick = function () {
  if (!currentTr) return;

  const newStatus = document.getElementById("status-select").value;
  const orderId = currentTr.dataset.id;

  fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Không cập nhật được mẫu");
      return res.json();
    })
    .then((updatedOrder) => {
      const statusSpan = currentTr.querySelector(".status");
      statusSpan.innerText = updatedOrder.status;
      statusSpan.className = "status " + getStatusClass(updatedOrder.status);
      currentTr.dataset.status = updatedOrder.status;
      document.getElementById("update-modal").style.display = "none";
      alert("✔️ Đã cập nhật trạng thái");
    })
    .catch((err) => {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    });
};

// Đóng modal khi click ra ngoài hoặc nút đóng
document.getElementById("specimen-modal").onclick = function (e) {
  if (e.target === this) this.style.display = "none";
};
document.getElementById("update-modal").onclick = function (e) {
  if (e.target === this) this.style.display = "none";
};
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.onclick = function () {
    document.getElementById("specimen-modal").style.display = "none";
    document.getElementById("update-modal").style.display = "none";
  };
});

// Hàm đổi màu trạng thái
function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case "đang xét nghiệm":
      return "processing";
    case "đã hoàn thành":
      return "completed";
    case "chờ kết quả":
      return "pending";
    default:
      return "";
  }
}

// Xử lý thêm mẫu mới
// document.getElementById("specimen-form").onsubmit = function (e) {
//   e.preventDefault();

//   const specimenData = {
//     code: document.getElementById("code").value,
//     username: document.getElementById("username").value,
//     testType: document.getElementById("testType").value,
//     appointmentDate: document.getElementById("appointmentDate").value,
//     appointmentTime: document.getElementById("appointmentTime").value,
//     recipientName: document.getElementById("recipientName").value,
//     recipientAddress: document.getElementById("recipientAddress").value,
//     recipientPhone: document.getElementById("recipientPhone").value,
//     selectedPackageLabel: document.getElementById("selectedPackageLabel").value,
//     customerName: document.getElementById("customerName").value,
//     receivedDate: document.getElementById("receivedDate").value,
//     status: document.getElementById("status").value,
//   };

//   fetch("http://localhost:8080/api/orders", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(specimenData),
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Không thể thêm mẫu");
//       return res.json();
//     })
//     .then(() => {
//       alert("Thêm mẫu thành công!");
//       document.getElementById("specimen-form").reset();
//       location.reload();
//     })
//     .catch((err) => {
//       console.error("Lỗi thêm mẫu:", err);
//       alert("Gửi mẫu thất bại");
//     });
// };
