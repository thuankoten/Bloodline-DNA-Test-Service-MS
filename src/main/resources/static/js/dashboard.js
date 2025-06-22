/**
 * Hệ thống quản lý dịch vụ xét nghiệm DNA Bloodline
 * JavaScript cho trang tổng quan (Dashboard)
 */

document.addEventListener("DOMContentLoaded", function () {
  initDashboardUI();
  initAncestryChart();
  initActionButtons();
});

/**
 * Khởi tạo các phần tử giao diện người dùng (UI) của Dashboard
 */
function initDashboardUI() {
  // Nút chuyển đổi thanh bên (sidebar) trên di động
  const sidebarToggle = document.createElement("button");
  sidebarToggle.className = "sidebar-toggle";
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';

  const header = document.querySelector(".dashboard-header .container");
  if (header) {
    header.insertBefore(sidebarToggle, header.firstChild);

    sidebarToggle.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("active");
    });
  }

  // Menu thả xuống của người dùng
  const userMenu = document.querySelector(".user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", () => {
      const dropdown = document.createElement("div");
      dropdown.className = "user-dropdown";
      dropdown.innerHTML = `
                <ul>
                    <li><a href="profile.html"><i class="fas fa-user-circle"></i> Hồ sơ của tôi</a></li>
                    <li><a href="settings.html"><i class="fas fa-cog"></i> Cài đặt</a></li>
                    <li><a href="../login/login.html"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            `;

      // Xóa dropdown hiện có (nếu có)
      const existingDropdown = document.querySelector(".user-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      // Thêm dropdown vào DOM
      userMenu.appendChild(dropdown);

      // Đóng dropdown khi nhấp ra bên ngoài
      document.addEventListener("click", function closeDropdown(e) {
        if (!userMenu.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener("click", closeDropdown);
        }
      });
    });
  }

  // Menu thả xuống thông báo
  const notification = document.querySelector(".notification");
  if (notification) {
    notification.addEventListener("click", () => {
      const dropdown = document.createElement("div");
      dropdown.className = "notification-dropdown";
      dropdown.innerHTML = `
                <div class="dropdown-header">
                    <h3>Thông báo</h3>
                    <a href="#" class="mark-all">Đánh dấu tất cả là đã đọc</a>
                </div>
                <ul>
                    <li class="unread">
                        <div class="notification-icon"><i class="fas fa-flask"></i></div>
                        <div class="notification-content">
                            <p>Kết quả xét nghiệm DNA Tổ tiên của bạn đã sẵn sàng!</p>
                            <span class="notification-time">Vừa xong</span>
                        </div>
                    </li>
                    <li class="unread">
                        <div class="notification-icon"><i class="fas fa-truck"></i></div>
                        <div class="notification-content">
                            <p>Bộ dụng cụ thu thập DNA của bạn đã được gửi đi</p>
                            <span class="notification-time">2 giờ trước</span>
                        </div>
                    </li>
                    <li>
                        <div class="notification-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="notification-content">
                            <p>Nhắc nhở: Lịch hẹn tư vấn di truyền vào ngày mai lúc 2 giờ chiều</p>
                            <span class="notification-time">Hôm qua</span>
                        </div>
                    </li>
                </ul>
                <div class="dropdown-footer">
                    <a href="notifications.html">Xem tất cả thông báo</a>
                </div>
            `;

      // Xóa dropdown hiện có (nếu có)
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

      // Đóng dropdown khi nhấp ra bên ngoài
      document.addEventListener("click", function closeDropdown(e) {
        if (!notification.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener("click", closeDropdown);
        }
      });

      // Đánh dấu tất cả là đã đọc
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
}

/**
 * Khởi tạo Biểu đồ Tổ tiên
 */
function initAncestryChart() {
  const ancestryCanvas = document.getElementById("ancestryChart");

  if (ancestryCanvas) {
    const ctx = ancestryCanvas.getContext("2d");

    // Dữ liệu mẫu cho phân tích tổ tiên
    const data = {
      labels: ["Tây Âu", "Đông Âu", "Bắc Âu", "Địa Trung Hải", "Khác"],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            "#4285F4", // Xanh dương
            "#34A853", // Xanh lá
            "#FBBC05", // Vàng
            "#EA4335", // Đỏ
            "#9C27B0", // Tím
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
 * Khởi tạo chức năng cho các nút hành động
 */
function initActionButtons() {
  // Nút xem
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const testId =
        this.closest("tr").querySelector("td:first-child").textContent;
      window.location.href = `test-details.html?id=${testId}`;
    });
  });

  // Nút tải xuống
  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const testId =
        this.closest("tr").querySelector("td:first-child").textContent;
      // Mô phỏng tải xuống tệp
      simulateDownload(testId);
    });
  });

  // Nút chia sẻ
  document.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const testId =
        this.closest("tr").querySelector("td:first-child").textContent;
      // Hiển thị hộp thoại chia sẻ
      showShareModal(testId);
    });
  });

  // Nút theo dõi
  document.querySelectorAll(".track-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const testId =
        this.closest("tr").querySelector("td:first-child").textContent;
      // Hiển thị hộp thoại theo dõi
      showTrackingModal(testId);
    });
  });

  // Nút kết nối trong phần kết quả trùng khớp DNA
  document.querySelectorAll(".match-card .btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const matchName =
        this.closest(".match-card").querySelector("h3").textContent;

      // Thay đổi trạng thái nút
      this.innerHTML = "Yêu cầu đã gửi";
      this.classList.add("btn-secondary");
      this.disabled = true;

      // Hiển thị thông báo
      showMessage(`Yêu cầu kết nối đã gửi đến ${matchName}`, "success");
    });
  });
}

/**
 * Mô phỏng tải xuống tệp
 */
function simulateDownload(testId) {
  // Tạo một liên kết tải xuống giả
  const link = document.createElement("a");
  link.href = "#";
  link.download = `Bloodline_Test_Results_${testId.replace("#", "")}.pdf`;

  // Hiển thị thông báo đang tải
  showMessage("Đang chuẩn bị tải xuống...", "info");

  // Mô phỏng độ trễ
  setTimeout(() => {
    // Hiển thị thông báo thành công
    showMessage("Tải xuống đã bắt đầu!", "success");

    // Cố gắng mô phỏng tải xuống (chỉ hoạt động với các tệp thực tế)
    try {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Sẽ tải xuống tệp trong môi trường sản phẩm");
    }
  }, 1500);
}

/**
 * Hiển thị hộp thoại chia sẻ
 */
function showShareModal(testId) {
  // Tạo phần tử hộp thoại
  const modal = document.createElement("div");
  modal.className = "modal share-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chia sẻ kết quả xét nghiệm</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Chia sẻ kết quả xét nghiệm của bạn (${testId}) với:</p>
                <div class="share-options">
                    <button class="share-option" data-method="email">
                        <i class="fas fa-envelope"></i>
                        <span>Email</span>
                    </button>
                    <button class="share-option" data-method="doctor">
                        <i class="fas fa-user-md"></i>
                        <span>Bác sĩ</span>
                    </button>
                    <button class="share-option" data-method="link">
                        <i class="fas fa-link"></i>
                        <span>Lấy liên kết</span>
                    </button>
                </div>
                <div class="share-email-form" style="display: none;">
                    <div class="form-group">
                        <label for="share-email">Email người nhận</label>
                        <input type="email" id="share-email" placeholder="Nhập địa chỉ email">
                    </div>
                    <div class="form-group">
                        <label for="share-message">Tin nhắn (Tùy chọn)</label>
                        <textarea id="share-message" rows="3" placeholder="Thêm tin nhắn cá nhân"></textarea>
                    </div>
                    <button class="btn btn-primary send-email-btn">Gửi</button>
                </div>
            </div>
        </div>
    `;

  // Thêm hộp thoại vào DOM
  document.body.appendChild(modal);

  // Thêm trình lắng nghe sự kiện
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Đóng hộp thoại khi nhấp ra bên ngoài nội dung
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Các nút tùy chọn chia sẻ
  const shareOptions = modal.querySelectorAll(".share-option");
  shareOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const method = option.dataset.method;

      if (method === "email") {
        // Hiển thị biểu mẫu email
        modal.querySelector(".share-options").style.display = "none";
        modal.querySelector(".share-email-form").style.display = "block";
      } else if (method === "doctor") {
        // Hiển thị xác nhận chia sẻ với bác sĩ
        showMessage(
          "Bác sĩ của bạn sẽ nhận được quyền truy cập vào các kết quả này trong vòng 24 giờ",
          "success"
        );
        modal.remove();
      } else if (method === "link") {
        // Sao chép liên kết vào clipboard
        const dummyLink = `https://bloodlinedna.com/results/${testId.replace(
          "#",
          ""
        )}`;
        navigator.clipboard.writeText(dummyLink).then(() => {
          showMessage("Liên kết đã được sao chép vào clipboard!", "success");
          modal.remove();
        });
      }
    });
  });

  // Nút gửi email
  const sendEmailBtn = modal.querySelector(".send-email-btn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      const email = modal.querySelector("#share-email").value;

      // Xác thực email
      if (!isValidEmail(email)) {
        showMessage("Vui lòng nhập địa chỉ email hợp lệ", "error");
        return;
      }

      // Hiển thị thông báo thành công
      showMessage(`Kết quả đã được chia sẻ với ${email}`, "success");
      modal.remove();
    });
  }
}

/**
 * Hiển thị hộp thoại theo dõi
 */
function showTrackingModal(testId) {
  // Tạo phần tử hộp thoại
  const modal = document.createElement("div");
  modal.className = "modal tracking-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Theo dõi mẫu</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="tracking-info">
                    <h4>Mã xét nghiệm: ${testId}</h4>
                    <div class="tracking-timeline">
                        <div class="timeline-item completed">
                            <div class="timeline-icon">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Bộ kit đã gửi</h5>
                                <p>Bộ dụng cụ thu thập DNA của bạn đã được gửi đi</p>
                                <span class="timeline-date">Ngày 10 tháng 11, 2023</span>
                            </div>
                        </div>
                        <div class="timeline-item active">
                            <div class="timeline-icon">
                                <i class="fas fa-truck"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Đang vận chuyển</h5>
                                <p>Bộ kit của bạn đang trên đường đến bạn</p>
                                <span class="timeline-date">Ngày 12 tháng 11, 2023</span>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="fas fa-home"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Bộ kit đã giao</h5>
                                <p>Ngày giao hàng dự kiến</p>
                                <span class="timeline-date">Ngày 15 tháng 11, 2023</span>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="fas fa-vial"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Thu thập mẫu</h5>
                                <p>Làm theo hướng dẫn để thu thập mẫu DNA của bạn</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="fas fa-flask"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Xử lý tại phòng thí nghiệm</h5>
                                <p>Mẫu của bạn sẽ được phân tích trong phòng thí nghiệm của chúng tôi</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>Kết quả đã sẵn sàng</h5>
                                <p>Kết quả xét nghiệm DNA của bạn sẽ có sẵn</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tracking-details">
                    <p><strong>Hãng vận chuyển:</strong> Express Delivery Services</p>
                    <p><strong>Mã theo dõi:</strong> EDS54921783654</p>
                    <p><strong>Giao hàng dự kiến:</strong> Ngày 15 tháng 11, 2023</p>
                </div>
            </div>
        </div>
    `;

  // Thêm hộp thoại vào DOM
  document.body.appendChild(modal);

  // Thêm trình lắng nghe sự kiện
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Đóng hộp thoại khi nhấp ra bên ngoài nội dung
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

/**
 * Hàm tiện ích để hiển thị thông báo
 */
function showMessage(message, type) {
  // Xóa mọi thông báo hiện có
  const existingMessage = document.querySelector(".message-popup");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Tạo phần tử thông báo
  const messageElement = document.createElement("div");
  messageElement.className = `message-popup ${type}`;

  // Thêm biểu tượng dựa trên loại thông báo
  let icon = "info-circle";
  if (type === "success") {
    icon = "check-circle";
  } else if (type === "error") {
    icon = "exclamation-circle";
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

/**
 * Hàm tiện ích để xác thực email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
