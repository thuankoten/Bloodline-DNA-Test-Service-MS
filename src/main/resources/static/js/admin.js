/**
 * Hệ thống Quản lý Dịch vụ Xét nghiệm DNA Bloodline
 * JavaScript Bảng điều khiển Quản trị viên
 */

document.addEventListener("DOMContentLoaded", function () {
  initAdminUI();
  initCharts();
  initAdminActions();
});

/**
 * Khởi tạo các phần tử Giao diện người dùng Quản trị viên
 */
function initAdminUI() {
  // Chuyển đổi thanh bên di động
  const sidebarToggle = document.createElement("button");
  sidebarToggle.className = "sidebar-toggle";
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';

  const header = document.querySelector(".admin-header .container");
  if (header) {
    header.insertBefore(sidebarToggle, header.firstChild);

    sidebarToggle.addEventListener("click", () => {
      document.querySelector(".admin-sidebar").classList.toggle("active");
    });
  }

  // Menu thả xuống người dùng
  const userMenu = document.querySelector(".user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", () => {
      const dropdown = document.createElement("div");
      dropdown.className = "user-dropdown";
      dropdown.innerHTML = `
                <ul>
                    <li><a href="admin-profile.html"><i class="fas fa-user-circle"></i> Hồ sơ của tôi</a></li>
                    <li><a href="admin-settings.html"><i class="fas fa-cog"></i> Cài đặt hệ thống</a></li>
                    <li><a href="../login/login.html"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            `;

      // Xóa dropdown hiện có nếu có
      const existingDropdown = document.querySelector(".user-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      // Thêm dropdown vào DOM
      userMenu.appendChild(dropdown);

      // Đóng dropdown khi nhấp chuột bên ngoài
      document.addEventListener("click", function closeDropdown(e) {
        if (!userMenu.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener("click", closeDropdown);
        }
      });
    });
  }

  // Thả xuống thông báo
  const notification = document.querySelector(".notification");
  if (notification) {
    notification.addEventListener("click", () => {
      const dropdown = document.createElement("div");
      dropdown.className = "notification-dropdown";
      dropdown.innerHTML = `
                <div class="dropdown-header">
                    <h3>Thông báo hệ thống</h3>
                    <a href="#" class="mark-all">Đánh dấu tất cả đã đọc</a>
                </div>
                <ul>
                    <li class="unread urgent">
                        <div class="notification-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="notification-content">
                            <p>Cảnh báo nhiệt độ lưu trữ mẫu: Nhiệt độ Đơn vị B3 đã vượt ngưỡng (8°C)</p>
                            <span class="notification-time">10 phút trước</span>
                        </div>
                    </li>
                    <li class="unread">
                        <div class="notification-icon"><i class="fas fa-database"></i></div>
                        <div class="notification-content">
                            <p>Sao lưu Cơ sở dữ liệu hoàn tất: Sao lưu hàng ngày đã hoàn tất thành công</p>
                            <span class="notification-time">1 giờ trước</span>
                        </div>
                    </li>
                    <li>
                        <div class="notification-icon"><i class="fas fa-user-plus"></i></div>
                        <div class="notification-content">
                            <p>Tạo tài khoản nhân viên phòng thí nghiệm mới: Tiến sĩ Rebecca Johnson được thêm làm Kỹ thuật viên Phòng thí nghiệm</p>
                            <span class="notification-time">2 giờ trước</span>
                        </div>
                    </li>
                    <li>
                        <div class="notification-icon"><i class="fas fa-box"></i></div>
                        <div class="notification-content">
                            <p>Cảnh báo tồn kho thấp: Tồn kho bộ kit thu thập DNA dưới ngưỡng (còn lại 25 đơn vị)</p>
                            <span class="notification-time">5 giờ trước</span>
                        </div>
                    </li>
                </ul>
                <div class="dropdown-footer">
                    <a href="admin-notifications.html">Xem tất cả thông báo</a>
                </div>
            `;

      // Xóa dropdown hiện có nếu có
      const existingDropdown = document.querySelector(".notification-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      // Thêm dropdown vào DOM
      document.body.appendChild(dropdown);

      // Định vị dropdown
      const rect = notification.getBoundingClientRect();
      dropdown.style.top = rect.bottom + 10 + "px";
      dropdown.style.right = window.innerWidth - rect.right + "px";

      // Đóng dropdown khi nhấp chuột bên ngoài
      document.addEventListener("click", function closeDropdown(e) {
        if (!notification.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener("click", closeDropdown);
        }
      });

      // Đánh dấu tất cả đã đọc
      const markAllBtn = dropdown.querySelector(".mark-all");
      markAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.querySelectorAll("li.unread").forEach((item) => {
          item.classList.remove("unread");
        });
        notification.querySelector(".badge").style.display = "none";
      });
    });
  }

  // Bộ chọn kỳ cho biểu đồ doanh thu
  const periodBtns = document.querySelectorAll(".period-selector button");
  if (periodBtns.length) {
    periodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Xóa lớp active khỏi tất cả các nút
        periodBtns.forEach((b) => b.classList.remove("active"));

        // Thêm lớp active vào nút được nhấp
        btn.classList.add("active");

        // Cập nhật biểu đồ dựa trên kỳ được chọn
        updateRevenueChart(btn.textContent.toLowerCase());
      });
    });
  }
}

/**
 * Khởi tạo Biểu đồ
 */
function initCharts() {
  // Biểu đồ Doanh thu
  initRevenueChart();

  // Biểu đồ Phân phối xét nghiệm
  initTestDistributionChart();
}

/**
 * Khởi tạo Biểu đồ Doanh thu
 */
function initRevenueChart() {
  const revenueCanvas = document.getElementById("revenueChart");

  if (revenueCanvas) {
    const ctx = revenueCanvas.getContext("2d");

    // Dữ liệu mẫu cho biểu đồ doanh thu (hàng tháng)
    const monthlyData = {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Doanh thu",
          data: [
            85000, 92000, 88000, 94000, 102000, 110000, 108000, 115000, 120000,
            125000, 128000, 135000,
          ],
          backgroundColor: "rgba(59, 111, 182, 0.1)",
          borderColor: "#3b6fb6",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          label: "Chi phí",
          data: [
            65000, 68000, 66000, 70000, 75000, 78000, 77000, 80000, 82000,
            85000, 87000, 90000,
          ],
          backgroundColor: "rgba(234, 67, 53, 0.1)",
          borderColor: "#ea4335",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };

    // Cấu hình biểu đồ
    const config = {
      type: "line",
      data: monthlyData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value / 1000 + "k";
              },
            },
          },
        },
      },
    };

    // Tạo biểu đồ và lưu tham chiếu
    window.revenueChart = new Chart(ctx, config);
  }
}

/**
 * Cập nhật Biểu đồ Doanh thu dựa trên kỳ đã chọn
 */
function updateRevenueChart(period) {
  const chart = window.revenueChart;
  if (!chart) return;

  let labels, revenueData, expensesData;

  // Đặt dữ liệu dựa trên kỳ
  switch (period) {
    case "quarterly": // Hàng quý
      labels = [
        "Q1 2022",
        "Q2 2022",
        "Q3 2022",
        "Q4 2022",
        "Q1 2023",
        "Q2 2023",
        "Q3 2023",
        "Q4 2023",
      ];
      revenueData = [
        255000, 306000, 343000, 380000, 390000, 425000, 480000, 520000,
      ];
      expensesData = [
        195000, 223000, 239000, 255000, 260000, 280000, 310000, 340000,
      ];
      break;
    case "yearly": // Hàng năm
      labels = ["2018", "2019", "2020", "2021", "2022", "2023"];
      revenueData = [950000, 1100000, 1250000, 1400000, 1550000, 1700000];
      expensesData = [700000, 820000, 880000, 950000, 1050000, 1200000];
      break;
    default: // monthly (hàng tháng)
      labels = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      revenueData = [
        85000, 92000, 88000, 94000, 102000, 110000, 108000, 115000, 120000,
        125000, 128000, 135000,
      ];
      expensesData = [
        65000, 68000, 66000, 70000, 75000, 78000, 77000, 80000, 82000, 85000,
        87000, 90000,
      ];
  }

  // Cập nhật dữ liệu biểu đồ
  chart.data.labels = labels;
  chart.data.datasets[0].data = revenueData;
  chart.data.datasets[1].data = expensesData;
  chart.update();
}

/**
 * Khởi tạo Biểu đồ Phân phối xét nghiệm
 */
function initTestDistributionChart() {
  const distributionCanvas = document.getElementById("testDistributionChart");

  if (distributionCanvas) {
    const ctx = distributionCanvas.getContext("2d");

    // Dữ liệu mẫu cho phân phối xét nghiệm
    const data = {
      labels: [
        "Xét nghiệm DNA Tổ tiên",
        "Sàng lọc sức khỏe",
        "Xét nghiệm huyết thống",
        "Xét nghiệm pháp y",
      ],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            "#4285F4", // Xanh dương
            "#34A853", // Xanh lá
            "#FBBC05", // Vàng
            "#EA4335", // Đỏ
          ],
          borderWidth: 0,
        },
      ],
    };

    // Cấu hình biểu đồ
    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}%`;
              },
            },
          },
        },
        cutout: "65%",
      },
    };

    // Tạo biểu đồ
    new Chart(ctx, config);
  }
}

/**
 * Khởi tạo các Nút hành động của Quản trị viên
 */
function initAdminActions() {
  // Nút xem xét nghiệm
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const testId = row.querySelector("td:first-child").textContent;

      // Chuyển hướng đến trang chi tiết xét nghiệm
      window.location.href = `admin-test-details.html?id=${testId}`;
    });
  });

  // Nút chỉnh sửa xét nghiệm
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const testId = row.querySelector("td:first-child").textContent;

      // Hiển thị modal chỉnh sửa
      showEditTestModal(testId, row);
    });
  });

  // Nút xóa xét nghiệm
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const testId = row.querySelector("td:first-child").textContent;

      // Hiển thị modal xác nhận xóa
      showDeleteConfirmation(testId, row);
    });
  });

  // Nút xem người dùng
  document.querySelectorAll(".user-card .view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".user-card");
      const userName = card.querySelector("h4").textContent;

      // Chuyển hướng đến trang chi tiết người dùng
      window.location.href = `admin-user-details.html?name=${encodeURIComponent(
        userName
      )}`;
    });
  });

  // Đánh dấu thông báo đã đọc
  document.querySelectorAll(".notification-actions button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.closest(".notification-item");
      item.classList.add("read");

      // Mô phỏng đánh dấu đã đọc trong cơ sở dữ liệu
      setTimeout(() => {
        item.style.opacity = "0.5";
      }, 300);
    });
  });
}

/**
 * Hiển thị Modal Chỉnh sửa Xét nghiệm
 */
function showEditTestModal(testId, row) {
  // Lấy chi tiết xét nghiệm từ hàng
  const customer = row.querySelector(".customer-info span").textContent;
  const testType = row.cells[2].textContent;
  const submissionDate = row.cells[3].textContent;
  const status = row.querySelector(".status").textContent;

  // Tạo phần tử modal
  const modal = document.createElement("div");
  modal.className = "modal edit-test-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chỉnh sửa Xét nghiệm ${testId}</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="edit-customer">Khách hàng</label>
                    <input type="text" id="edit-customer" value="${customer}" disabled>
                </div>
                <div class="form-group">
                    <label for="edit-test-type">Loại xét nghiệm</label>
                    <select id="edit-test-type">
                        <option value="Ancestry DNA Test" ${
                          testType === "Ancestry DNA Test" ? "selected" : ""
                        }>Xét nghiệm DNA Tổ tiên</option>
                        <option value="Health Screening" ${
                          testType === "Health Screening" ? "selected" : ""
                        }>Sàng lọc sức khỏe</option>
                        <option value="Paternity Test" ${
                          testType === "Paternity Test" ? "selected" : ""
                        }>Xét nghiệm huyết thống</option>
                        <option value="Forensic DNA Test" ${
                          testType === "Forensic DNA Test" ? "selected" : ""
                        }>Xét nghiệm DNA pháp y</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-date">Ngày gửi</label>
                    <input type="date" id="edit-date" value="${formatDateForInput(
                      submissionDate
                    )}">
                </div>
                <div class="form-group">
                    <label for="edit-status">Trạng thái</label>
                    <select id="edit-status">
                        <option value="Sample Received" ${
                          status === "Sample Received" ? "selected" : ""
                        }>Mẫu đã nhận</option>
                        <option value="Processing" ${
                          status === "Processing" ? "selected" : ""
                        }>Đang xử lý</option>
                        <option value="Kit Shipped" ${
                          status === "Kit Shipped" ? "selected" : ""
                        }>Kit đã gửi</option>
                        <option value="Completed" ${
                          status === "Completed" ? "selected" : ""
                        }>Hoàn thành</option>
                        <option value="Awaiting Review" ${
                          status === "Awaiting Review" ? "selected" : ""
                        }>Đang chờ xem xét</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-notes">Ghi chú</label>
                    <textarea id="edit-notes" rows="3" placeholder="Thêm ghi chú về xét nghiệm này"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancel-edit">Hủy</button>
                <button class="btn btn-primary" id="save-edit">Lưu thay đổi</button>
            </div>
        </div>
    `;

  // Thêm modal vào DOM
  document.body.appendChild(modal);

  // Thêm trình nghe sự kiện
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Đóng modal khi nhấp chuột bên ngoài nội dung
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Nút hủy
  const cancelBtn = modal.querySelector("#cancel-edit");
  cancelBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Nút lưu
  const saveBtn = modal.querySelector("#save-edit");
  saveBtn.addEventListener("click", () => {
    // Lấy giá trị mới
    const newTestType = modal.querySelector("#edit-test-type").value;
    const newDate = modal.querySelector("#edit-date").value;
    const newStatus = modal.querySelector("#edit-status").value;
    const notes = modal.querySelector("#edit-notes").value;

    // Hiển thị trạng thái tải
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    saveBtn.disabled = true;

    // Mô phỏng lưu vào cơ sở dữ liệu
    setTimeout(() => {
      // Cập nhật hàng trong bảng
      row.cells[2].textContent = newTestType;
      row.cells[3].textContent = formatDateForDisplay(newDate);
      row.querySelector(".status").textContent = newStatus;

      // Cập nhật lớp trạng thái
      const statusSpan = row.querySelector(".status");
      statusSpan.className = "status";

      if (newStatus === "Completed") {
        statusSpan.classList.add("completed");
      } else if (newStatus === "Processing") {
        statusSpan.classList.add("processing");
      } else if (newStatus === "Kit Shipped") {
        statusSpan.classList.add("shipped");
      } else if (newStatus === "Sample Received") {
        statusSpan.classList.add("received");
      } else if (newStatus === "Awaiting Review") {
        statusSpan.classList.add("awaiting");
      }

      // Hiển thị thông báo thành công
      showAdminMessage(
        `Xét nghiệm ${testId} đã được cập nhật thành công`,
        "success"
      );

      // Đóng modal
      modal.remove();
    }, 1000);
  });
}

/**
 * Hiển thị Modal Xác nhận Xóa
 */
function showDeleteConfirmation(testId, row) {
  // Tạo phần tử modal
  const modal = document.createElement("div");
  modal.className = "modal delete-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Xác nhận xóa</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Bạn có chắc chắn muốn xóa xét nghiệm ${testId}?</p>
                <p class="warning"><i class="fas fa-exclamation-triangle"></i> Hành động này không thể hoàn tác.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancel-delete">Hủy</button>
                <button class="btn btn-danger" id="confirm-delete">Xóa</button>
            </div>
        </div>
    `;

  // Thêm modal vào DOM
  document.body.appendChild(modal);

  // Thêm trình nghe sự kiện
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Đóng modal khi nhấp chuột bên ngoài nội dung
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Nút hủy
  const cancelBtn = modal.querySelector("#cancel-delete");
  cancelBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Nút xác nhận
  const confirmBtn = modal.querySelector("#confirm-delete");
  confirmBtn.addEventListener("click", () => {
    // Hiển thị trạng thái tải
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    confirmBtn.disabled = true;

    // Mô phỏng xóa khỏi cơ sở dữ liệu
    setTimeout(() => {
      // Xóa hàng khỏi bảng với hiệu ứng động
      row.style.backgroundColor = "#ffebee";
      setTimeout(() => {
        row.style.opacity = "0";
        setTimeout(() => {
          row.remove();

          // Hiển thị thông báo thành công
          showAdminMessage(`Xét nghiệm ${testId} đã bị xóa`, "success");

          // Đóng modal
          modal.remove();
        }, 300);
      }, 300);
    }, 1000);
  });
}

/**
 * Định dạng ngày từ định dạng hiển thị sang định dạng đầu vào
 */
function formatDateForInput(displayDate) {
  const months = {
    "Tháng 1": "01",
    "Tháng 2": "02",
    "Tháng 3": "03",
    "Tháng 4": "04",
    "Tháng 5": "05",
    "Tháng 6": "06",
    "Tháng 7": "07",
    "Tháng 8": "08",
    "Tháng 9": "09",
    "Tháng 10": "10",
    "Tháng 11": "11",
    "Tháng 12": "12",
  };

  const parts = displayDate.split(" ");
  if (parts.length === 3) {
    const month = months[parts[0]];
    const day = parts[1].replace(",", "").padStart(2, "0");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  }

  // Trả về ngày hiện tại nếu định dạng không được nhận dạng
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Định dạng ngày từ định dạng đầu vào sang định dạng hiển thị
 */
function formatDateForDisplay(inputDate) {
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const date = new Date(inputDate);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Hiển thị cửa sổ bật lên thông báo quản trị viên
 */
function showAdminMessage(message, type) {
  // Xóa mọi thông báo hiện có
  const existingMessage = document.querySelector(".admin-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Tạo phần tử thông báo
  const messageElement = document.createElement("div");
  messageElement.className = `admin-message ${type}`;

  // Thêm biểu tượng dựa trên loại thông báo
  let icon = "info-circle";
  if (type === "success") {
    icon = "check-circle";
  } else if (type === "error") {
    icon = "exclamation-circle";
  } else if (type === "warning") {
    icon = "exclamation-triangle";
  }

  messageElement.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-message"><i class="fas fa-times"></i></button>
    `;

  // Thêm vào DOM
  document.body.appendChild(messageElement);

  // Thêm chức năng nút đóng
  const closeBtn = messageElement.querySelector(".close-message");
  closeBtn.addEventListener("click", () => {
    messageElement.remove();
  });

  // Tự động xóa sau 5 giây
  setTimeout(() => {
    messageElement.classList.add("hiding");
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, 5000);
}
