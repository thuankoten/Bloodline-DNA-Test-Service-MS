document.addEventListener("DOMContentLoaded", function () {
  // Lấy loại dịch vụ từ tham số URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceType = urlParams.get("type");

  // Cập nhật nội dung dựa trên loại dịch vụ
  updateServiceContent(serviceType);

  // Chuyển đổi Tab
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Xóa lớp 'active' khỏi tất cả các nút và tab pane
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Thêm lớp 'active' vào nút được nhấp và tab pane tương ứng
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Accordion
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      accordionItems.forEach((item) => item.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});

const serviceData = {
  paternity: {
    title: "Xét nghiệm DNA Cha con",
    description:
      "Dịch vụ xét nghiệm DNA cha con của chúng tôi cung cấp kết quả chính xác và có giá trị pháp lý...",
    pricing: {
      standard: {
        price: "4.990.000 VNĐ",
        turnaround: "5-7 ngày làm việc",
        features: [
          "Báo cáo xét nghiệm DNA cơ bản",
          "Hỗ trợ qua Email",
          "Xử lý tiêu chuẩn",
          "Tư vấn kết quả cơ bản",
        ],
      },
      express: {
        price: "6.990.000 VNĐ",
        turnaround: "2-3 ngày làm việc",
        features: [
          "Phân tích DNA chi tiết",
          "Xử lý ưu tiên",
          "Hỗ trợ qua điện thoại & Email",
          "Tư vấn mở rộng",
          "Báo cáo kỹ thuật số & bản cứng",
        ],
      },
      premium: {
        price: "9.990.000 VNĐ",
        turnaround: "24 giờ",
        features: [
          "Phân tích DNA toàn diện",
          "Xử lý trong ngày",
          "Hỗ trợ VIP 24/7",
          "Buổi tư vấn chuyên gia",
          "Gói tài liệu pháp lý",
          "Lưu trữ kết quả trọn đời",
        ],
      },
    },
    process: [
      // Dữ liệu ví dụ cho quy trình
      {
        step: 1,
        title: "Đặt lịch hẹn",
        description: "Đặt lịch hẹn lấy mẫu DNA của bạn.",
        duration: "5 phút",
        requirements: ["Chứng minh thư"],
      },
      {
        step: 2,
        title: "Lấy mẫu",
        description:
          "Mẫu DNA của bạn sẽ được thu thập tại phòng khám của chúng tôi.",
        duration: "15 phút",
        requirements: ["Mẫu nước bọt"],
      },
      {
        step: 3,
        title: "Phân tích phòng thí nghiệm",
        description:
          "Các mẫu được gửi đến phòng thí nghiệm để phân tích chuyên sâu.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Không áp dụng"],
      },
      {
        step: 4,
        title: "Nhận kết quả",
        description:
          "Kết quả của bạn sẽ được gửi qua email hoặc có sẵn trực tuyến.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Email hợp lệ", "Truy cập internet"],
      },
    ],
  },
  relationship: {
    title: "Xét nghiệm Mối quan hệ Gia đình",
    description:
      "Dịch vụ xét nghiệm mối quan hệ gia đình của chúng tôi giúp xác định mối liên hệ huyết thống...",
    pricing: {
      standard: {
        price: "5.990.000 VNĐ",
        turnaround: "7-10 ngày làm việc",
        features: [
          "Phân tích mối quan hệ cơ bản",
          "Báo cáo tiêu chuẩn",
          "Hỗ trợ qua Email",
        ],
      },
      express: {
        price: "7.990.000 VNĐ",
        turnaround: "3-5 ngày làm việc",
        features: [
          "Phân tích gia đình chi tiết",
          "Xử lý ưu tiên",
          "Giờ hỗ trợ mở rộng",
          "Báo cáo toàn diện",
        ],
      },
      premium: {
        price: "11.990.000 VNĐ",
        turnaround: "48 giờ",
        features: [
          "Phân tích di truyền nâng cao",
          "Xử lý nhanh",
          "Gói hỗ trợ VIP",
          "Sơ đồ cây gia đình",
          "Tài liệu pháp lý",
        ],
      },
    },
    process: [
      // Dữ liệu ví dụ cho quy trình
      {
        step: 1,
        title: "Tư vấn ban đầu",
        description:
          "Thảo luận về nhu cầu xét nghiệm và các thành viên gia đình tham gia.",
        duration: "30 phút",
        requirements: ["Thông tin cơ bản về gia đình"],
      },
      {
        step: 2,
        title: "Thu thập mẫu",
        description: "Thu thập mẫu DNA từ tất cả các bên liên quan.",
        duration: "20-30 phút",
        requirements: ["Mẫu nước bọt từ mỗi người"],
      },
      {
        step: 3,
        title: "Phân tích di truyền",
        description:
          "Phân tích các dấu hiệu di truyền để xác định mối quan hệ.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Không áp dụng"],
      },
      {
        step: 4,
        title: "Trình bày kết quả",
        description: "Nhận báo cáo chi tiết về mối quan hệ gia đình.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Email hợp lệ"],
      },
    ],
  },
  forensic: {
    title: "Xét nghiệm DNA Pháp y",
    description:
      "Dịch vụ xét nghiệm DNA pháp y của chúng tôi cung cấp phân tích bằng chứng chuyên biệt cho mục đích pháp lý...",
    pricing: {
      standard: {
        price: "8.990.000 VNĐ",
        turnaround: "10-12 ngày làm việc",
        features: [
          "Phân tích pháp y cơ bản",
          "Chuỗi giám định",
          "Báo cáo tiêu chuẩn",
        ],
      },
      express: {
        price: "12.990.000 VNĐ",
        turnaround: "5-7 ngày làm việc",
        features: [
          "Phân tích pháp y chi tiết",
          "Xử lý ưu tiên",
          "Tư vấn chuyên gia",
          "Tài liệu pháp lý",
        ],
      },
      premium: {
        price: "15.990.000 VNĐ",
        turnaround: "3 ngày làm việc",
        features: [
          "Phân tích pháp y nâng cao",
          "Xử lý nhanh",
          "Có sẵn lời khai chuyên gia",
          "Gói pháp lý toàn diện",
          "Lưu trữ bằng chứng an toàn",
        ],
      },
    },
    process: [
      // Dữ liệu ví dụ cho quy trình
      {
        step: 1,
        title: "Gửi bằng chứng",
        description:
          "Gửi các mẫu bằng chứng đến phòng thí nghiệm pháp y của chúng tôi.",
        duration: "Ngay lập tức",
        requirements: ["Mẫu niêm phong", "Giấy tờ pháp lý"],
      },
      {
        step: 2,
        title: "Xử lý chuỗi giám định",
        description:
          "Đảm bảo tính toàn vẹn của bằng chứng thông qua quy trình chuỗi giám định nghiêm ngặt.",
        duration: "1 ngày",
        requirements: ["Tài liệu đầy đủ"],
      },
      {
        step: 3,
        title: "Phân tích pháp y",
        description: "Phân tích DNA kỹ lưỡng trên các mẫu bằng chứng.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Không áp dụng"],
      },
      {
        step: 4,
        title: "Báo cáo pháp y",
        description:
          "Cung cấp báo cáo chuyên gia chi tiết có thể được sử dụng trong các thủ tục pháp lý.",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Không áp dụng"],
      },
    ],
  },
};

function updateServiceContent(serviceType) {
  const service = serviceData[serviceType] || serviceData.paternity;

  // Cập nhật thông tin cơ bản
  document.querySelector(".service-detail-hero h1").textContent = service.title;
  // Kiểm tra xem phần tử có tồn tại trước khi truy cập 'textContent'
  const descriptionElement = document.querySelector(".service-description p");
  if (descriptionElement) {
    descriptionElement.textContent = service.description;
  }

  // Cập nhật phần giá cả
  const pricingContainer = document.querySelector(".pricing-options");
  if (pricingContainer) {
    // Kiểm tra xem phần tử có tồn tại
    pricingContainer.innerHTML = Object.entries(service.pricing)
      .map(
        ([level, details]) => `
                <div class="pricing-card ${level}">
                    <h3>Gói ${
                      level.charAt(0).toUpperCase() + level.slice(1)
                    }</h3>
                    <div class="price">
                        <span class="amount">${details.price}</span>
                        <span class="turnaround">Kết quả trong ${
                          details.turnaround
                        }</span>
                    </div>
                    <ul class="features">
                        ${details.features
                          .map(
                            (feature) => `
                            <li><i class="fas fa-check"></i> ${feature}</li>
                        `
                          )
                          .join("")}
                    </ul>
                    <button class="btn btn-primary" onclick="window.location.href='book-appointment.html?service=${serviceType}&package=${level}'">Đặt lịch hẹn</button>
                </div>
            `
      )
      .join("");
  }

  // Cập nhật dòng thời gian quy trình (process timeline)
  const processContainer = document.querySelector(".process-timeline");
  if (processContainer && service.process) {
    // Kiểm tra xem phần tử và dữ liệu có tồn tại
    processContainer.innerHTML = service.process
      .map(
        (step) => `
                <div class="process-step">
                    <div class="step-number">${step.step}</div>
                    <div class="step-content">
                        <h4>${step.title}</h4>
                        <p>${step.description}</p>
                        <div class="step-details">
                            <span><i class="fas fa-clock"></i> ${
                              step.duration
                            }</span>
                            <div class="requirements">
                                <strong>Yêu cầu:</strong>
                                <ul>
                                    ${step.requirements
                                      .map(
                                        (req) => `
                                        <li><i class="fas fa-dot-circle"></i> ${req}</li>
                                    `
                                      )
                                      .join("")}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
      )
      .join("");
  } else if (processContainer) {
    // Xóa nội dung nếu không có dữ liệu quy trình
    processContainer.innerHTML =
      "<p>Không có thông tin quy trình cho dịch vụ này.</p>";
  }
}
