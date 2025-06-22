document.addEventListener("DOMContentLoaded", function () {
  // Lấy loại dịch vụ từ tham số URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceType = urlParams.get("type") || "paternity"; // Thêm giá trị mặc định

  // Cập nhật nội dung dựa trên loại dịch vụ
  updateServiceContent(serviceType);

  // Chuyển đổi Tab - Sửa lỗi selector
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định

    // Xóa lớp 'active' khỏi tất cả các nút và tab pane
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // Thêm lớp 'active' vào nút được nhấp và tab pane tương ứng
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    const targetPane = document.getElementById(tabId);

    if (targetPane) {
      targetPane.classList.add("active");

      if (tabId === "faq") {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceType = urlParams.get("type") || "paternity";
        updateFAQTab(serviceData[serviceType].faq);
      }

   
      if (tabId === "documents") {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceType = urlParams.get("type") || "paternity";
        updateDocumentsTab(serviceData[serviceType].documents);
      }

      
      if (tabId === "process") {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceType = urlParams.get("type") || "paternity";
        updateProcessTab(serviceData[serviceType].process);
      }
    }
  });
});


  // Accordion 
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    if (header) {
      header.addEventListener("click", (e) => {
        e.preventDefault();
        const isActive = item.classList.contains("active");
        
  
        accordionItems.forEach((accordionItem) => accordionItem.classList.remove("active"));
        
        
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // Thêm event listener cho booking button
  const bookingButton = document.querySelector(".btn-primary.btn-block");
  if (bookingButton) {
    bookingButton.href = `book-appointment.html?service=${serviceType}`;
  }
});

const serviceData = {
  paternity: {
    title: "Xét nghiệm DNA Huyết thống",
    description:
      "Dịch vụ xét nghiệm DNA huyết thống của chúng tôi cung cấp kết quả chính xác và có giá trị pháp lý để xác định mối quan hệ sinh học giữa người cha và đứa trẻ. Sử dụng công nghệ tiên tiến, chúng tôi đảm bảo độ chính xác 99.99% trong các quy trình xét nghiệm của mình.",
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
      
      {
        step: 1,
        title: "Tư vấn ban đầu",
        description: "Tư vấn miễn phí với các chuyên gia di truyền của chúng tôi để hiểu nhu cầu của bạn",
        duration: "30 phút",
        requirements: ["Thảo luận các lựa chọn xét nghiệm", "Xem xét các yêu cầu pháp lý", "Lên lịch hẹn"],
      },
      {
        step: 2,
        title: "Lấy mẫu",
        description: "Mẫu DNA của bạn sẽ được thu thập tại phòng khám của chúng tôi hoặc tại nhà",
        duration: "15 phút",
        requirements: ["Chứng minh thư hợp lệ", "Mẫu nước bọt hoặc tế bào má"],
      },
      {
        step: 3,
        title: "Phân tích phòng thí nghiệm",
        description: "Các mẫu được gửi đến phòng thí nghiệm để phân tích chuyên sâu",
        duration: "Tùy thuộc vào gói dịch vụ",
        requirements: ["Không áp dụng - xử lý tự động"],
      },
      {
        step: 4,
        title: "Nhận kết quả",
        description: "Kết quả của bạn sẽ được gửi qua email hoặc có sẵn trên cổng thông tin trực tuyến",
        duration: "Theo thời gian gói dịch vụ",
        requirements: ["Email hợp lệ", "Truy cập cổng thông tin"],
      },
    ],
    faq: [
      {
        question: "Độ chính xác của xét nghiệm DNA là bao nhiêu?",
        answer: "Xét nghiệm DNA của chúng tôi cung cấp độ chính xác 99.99% cho trường hợp khẳng định và 100% cho trường hợp loại trừ. Chúng tôi sử dụng công nghệ mới nhất và tuân thủ các biện pháp kiểm soát chất lượng nghiêm ngặt."
      },
      {
        question: "Mất bao lâu để có kết quả?",
        answer: "Thời gian tùy thuộc vào gói dịch vụ: Gói tiêu chuẩn 5-7 ngày, gói nhanh 2-3 ngày, gói cao cấp trong 24 giờ."
      },
      {
        question: "Kết quả có giá trị pháp lý không?",
        answer: "Có, tất cả các xét nghiệm của chúng tôi đều tuân thủ chuỗi giám định và có giá trị pháp lý tại tòa án."
      }
    ],
    documents: [
      {
        title: "Giấy tờ tùy thân hợp lệ của chính phủ",
        description: "Giấy phép lái xe, hộ chiếu hoặc CMND/CCCD",
        icon: "fas fa-id-card"
      },
      {
        title: "Giấy khai sinh (nếu có)",
        description: "Để xác minh thông tin về đứa trẻ",
        icon: "fas fa-certificate"
      }
    ]
  },
  relationship: {
    title: "Xét nghiệm Mối quan hệ Gia đình",
    description:
      "Dịch vụ xét nghiệm mối quan hệ gia đình của chúng tôi giúp xác định mối liên hệ huyết thống giữa các thành viên trong gia đình như anh chị em, ông bà cháu, cô dì chú bác...",
    pricing: {
      standard: {
        price: "5.990.000 VNĐ",
        turnaround: "7-10 ngày làm việc",
        features: [
          "Phân tích mối quan hệ cơ bản",
          "Báo cáo tiêu chuẩn",
          "Hỗ trợ qua Email",
          "Tư vấn kết quả",
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
          "Sơ đồ quan hệ gia đình",
        ],
      },
      premium: {
        price: "11.990.000 VNĐ",
        turnaround: "48 giờ",
        features: [
          "Phân tích di truyền nâng cao",
          "Xử lý nhanh",
          "Gói hỗ trợ VIP",
          "Sơ đồ cây gia đình chi tiết",
          "Tài liệu pháp lý",
          "Tư vấn chuyên gia 1-1",
        ],
      },
    },
    process: [
      
      {
        step: 1,
        title: "Tư vấn và lập kế hoạch",
        description: "Tư vấn miễn phí để xác định mối quan hệ cần kiểm tra và lựa chọn phương pháp phân tích phù hợp",
        duration: "45 phút",
        requirements: [
          "Thông tin về các thành viên gia đình tham gia",
          "Xác định loại mối quan hệ cần kiểm tra",
          "Thảo luận về độ phức tạp của gia đình",
          "Lên lịch lấy mẫu cho tất cả thành viên"
        ],
      },
      {
        step: 2,
        title: "Thu thập mẫu từ nhiều thành viên",
        description: "Lấy mẫu DNA từ tất cả các thành viên gia đình liên quan để đảm bảo độ chính xác cao nhất",
        duration: "30-60 phút",
        requirements: [
          "Chứng minh thư của tất cả thành viên tham gia",
          "Mẫu nước bọt hoặc tế bào má từ mỗi người",
          "Sự đồng ý của tất cả các bên (hoặc người giám hộ hợp pháp)"
        ],
      },
      {
        step: 3,
        title: "Phân tích so sánh phức tạp",
        description: "Thực hiện phân tích DNA so sánh giữa nhiều cá nhân và xây dựng mô hình quan hệ gia đình",
        duration: "Tùy thuộc vào gói dịch vụ và độ phức tạp",
        requirements: ["Không áp dụng - xử lý tự động trong phòng thí nghiệm"],
      },
      {
        step: 4,
        title: "Tạo sơ đồ gia đình và báo cáo",
        description: "Xây dựng sơ đồ cây gia đình chi tiết và cung cấp báo cáo kết quả toàn diện",
        duration: "1-2 ngày sau khi hoàn thành phân tích",
        requirements: [
          "Email hợp lệ để nhận báo cáo",
          "Truy cập cổng thông tin để xem sơ đồ tương tác",
          "Lên lịch buổi tư vấn giải thích kết quả (nếu cần)"
        ],
      },
    ],
    faq: [
      {
        question: "Loại mối quan hệ gia đình nào có thể được xét nghiệm?",
        answer: "Chúng tôi có thể xét nghiệm nhiều loại mối quan hệ bao gồm: anh chị em ruột, anh chị em cùng cha khác mẹ hoặc cùng mẹ khác cha, ông bà - cháu, cô dì - cháu, chú bác - cháu, và các mối quan hệ gia đình phức tạp khác. Độ chính xác phụ thuộc vào loại mối quan hệ và số lượng thành viên tham gia xét nghiệm."
      },
      {
        question: "Cần bao nhiêu người tham gia xét nghiệm để có kết quả chính xác?",
        answer: "Số lượng người cần thiết phụ thuộc vào loại mối quan hệ cần xác định. Đối với anh chị em ruột, chỉ cần 2 người. Đối với các mối quan hệ phức tạp hơn như cô dì - cháu, chúng tôi khuyến nghị có thêm các thành viên gia đình khác tham gia để tăng độ chính xác."
      },
      {
        question: "Độ chính xác của xét nghiệm mối quan hệ gia đình là bao nhiêu?",
        answer: "Độ chính xác dao động từ 90-99.9% tùy thuộc vào loại mối quan hệ. Anh chị em ruột có độ chính xác cao nhất (99.9%), trong khi các mối quan hệ xa hơn như cô dì - cháu có độ chính xác khoảng 90-95%. Chúng tôi sẽ tư vấn cụ thể về độ chính xác dự kiến trong buổi tư vấn ban đầu."
      },
      {
        question: "Có thể xét nghiệm với người đã qua đời không?",
        answer: "Có thể, nếu có mẫu DNA từ người đã qua đời (như tóc, móng tay, hoặc mẫu sinh học được bảo quản) hoặc có thể xét nghiệm với các thành viên gia đình khác để suy ra mối quan hệ. Chúng tôi sẽ tư vấn cụ thể về các phương án khả thi."
      },
      {
        question: "Kết quả có được trình bày dưới dạng sơ đồ cây gia đình không?",
        answer: "Có, các gói Express và Premium bao gồm sơ đồ cây gia đình chi tiết. Gói Premium còn cung cấp sơ đồ tương tác trực tuyến với khả năng zoom và xem thông tin chi tiết của từng thành viên."
      }
    ],
    documents: [
      {
        title: "Giấy tờ tùy thân của tất cả thành viên",
        description: "CMND/CCCD, giấy phép lái xe hoặc hộ chiếu của mỗi người tham gia",
        icon: "fas fa-id-card"
      },
      {
        title: "Giấy khai sinh (nếu có)",
        description: "Để xác minh thông tin gia đình và mối quan hệ đã biết",
        icon: "fas fa-certificate"
      },
      {
        title: "Sổ hộ khẩu hoặc giấy tờ gia đình",
        description: "Để tham khảo thêm thông tin về cấu trúc gia đình",
        icon: "fas fa-users"
      }
    ]
  },
  forensic: {
    title: "Xét nghiệm DNA Pháp y",
    description:
      "Dịch vụ xét nghiệm DNA pháp y của chúng tôi cung cấp phân tích bằng chứng chuyên biệt cho mục đích pháp lý, điều tra tội phạm và nhận dạng...",
    pricing: {
      standard: {
        price: "8.990.000 VNĐ",
        turnaround: "10-12 ngày làm việc",
        features: [
          "Phân tích pháp y cơ bản",
          "Chuỗi giám định",
          "Báo cáo tiêu chuẩn",
          "Hỗ trợ pháp lý cơ bản",
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
          "Báo cáo chuyên gia",
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
          "Hỗ trợ tại tòa án",
        ],
      },
    },
    process: [
      
      {
        step: 1,
        title: "Tư vấn pháp lý và đánh giá vụ án",
        description: "Tư vấn với chuyên gia pháp y về yêu cầu cụ thể và đánh giá tính khả thi của mẫu bằng chứng",
        duration: "60-90 phút",
        requirements: [
          "Thông tin chi tiết về vụ án hoặc yêu cầu điều tra",
          "Mô tả loại bằng chứng DNA có sẵn",
          "Thảo luận về yêu cầu pháp lý cụ thể",
          "Xem xét timeline và deadline của vụ án"
        ],
      },
      {
        step: 2,
        title: "Thu thập và bảo quản bằng chứng",
        description: "Thu thập mẫu bằng chứng theo quy trình pháp y nghiêm ngặt với chuỗi giám định hoàn chỉnh",
        duration: "Varies based on evidence type",
        requirements: [
          "Tuân thủ quy trình chuỗi giám định",
          "Chứng minh thư của tất cả các bên liên quan",
          "Ghi chép chi tiết về nguồn gốc bằng chứng",
          "Bảo quản mẫu trong điều kiện phù hợp"
        ],
      },
      {
        step: 3,
        title: "Phân tích pháp y chuyên biệt",
        description: "Thực hiện phân tích DNA pháp y với các kỹ thuật tiên tiến và kiểm soát chất lượng nghiêm ngặt",
        duration: "Tùy thuộc vào gói dịch vụ và độ phức tạp",
        requirements: ["Không áp dụng - xử lý trong môi trường phòng thí nghiệm được chứng nhận"],
      },
      {
        step: 4,
        title: "Báo cáo chuyên gia và hỗ trợ pháp lý",
        description: "Cung cấp báo cáo pháp y chi tiết và hỗ trợ chuyên gia tại tòa án nếu cần thiết",
        duration: "2-3 ngày sau khi hoàn thành phân tích",
        requirements: [
          "Thông tin liên hệ của đại diện pháp lý",
          "Yêu cầu cụ thể về định dạng báo cáo",
          "Lên lịch buổi briefing với luật sư (nếu cần)",
          "Chuẩn bị cho khả năng ra tòa làm chứng"
        ],
      },
    ],
    faq: [
      {
        question: "Loại bằng chứng DNA nào có thể được phân tích trong pháp y?",
        answer: "Chúng tôi có thể phân tích nhiều loại bằng chứng bao gồm: máu, tinh dịch, nước bọt, tóc (có chân tóc), mô da, móng tay, xương, răng, và các mẫu ADN bị degraded từ hiện trường vụ án. Khả năng phân tích phụ thuộc vào chất lượng và số lượng DNA có trong mẫu."
      },
      {
        question: "Chuỗi giám định (Chain of Custody) hoạt động như thế nào?",
        answer: "Chuỗi giám định là quy trình ghi chép chi tiết về việc thu thập, vận chuyển, lưu trữ và xử lý bằng chứng. Mỗi bước đều được ghi chép với thời gian, người thực hiện, và chữ ký xác nhận. Điều này đảm bảo tính toàn vẹn của bằng chứng và khả năng chấp nhận tại tòa án."
      },
      {
        question: "Kết quả có thể được sử dụng trong tòa án không?",
        answer: "Có, tất cả các xét nghiệm pháp y của chúng tôi đều tuân thủ các tiêu chuẩn pháp lý quốc tế và có giá trị tại tòa án Việt Nam. Báo cáo được chuẩn bị theo định dạng pháp lý và chuyên gia của chúng tôi có thể ra tòa làm chứng nếu cần thiết."
      },
      {
        question: "Thời gian xử lý có thể được rút ngắn trong trường hợp khẩn cấp không?",
        answer: "Có, chúng tôi cung cấp dịch vụ xử lý khẩn cấp cho các vụ án đặc biệt. Gói Premium có thể hoàn thành trong 3 ngày làm việc, và trong trường hợp cực kỳ khẩn cấp, chúng tôi có thể xử lý trong 24-48 giờ với phụ phí bổ sung."
      },
      {
        question: "Chi phí chuyên gia ra tòa làm chứng được tính như thế nào?",
        answer: "Gói Premium bao gồm sẵn 1 lần ra tòa làm chứng. Đối với các gói khác hoặc các lần ra tòa bổ sung, chi phí là 5.000.000 VNĐ/ngày tòa án, bao gồm cả thời gian chuẩn bị và di chuyển. Chúng tôi cũng cung cấp dịch vụ tư vấn từ xa qua video call nếu phù hợp."
      },
      {
        question: "Mẫu bằng chứng có được bảo quản sau khi phân tích không?",
        answer: "Có, chúng tôi bảo quản tất cả mẫu bằng chứng trong môi trường kiểm soát trong tối thiểu 7 năm hoặc theo yêu cầu của tòa án. Khách hàng có thể yêu cầu trả lại mẫu hoặc tiêu hủy an toàn sau khi vụ án kết thúc."
      }
    ],
    documents: [
      {
        title: "Giấy tờ ủy quyền pháp lý",
        description: "Lệnh tòa án, công văn cơ quan điều tra, hoặc giấy ủy quyền từ luật sư",
        icon: "fas fa-gavel"
      },
      {
        title: "Hồ sơ vụ án",
        description: "Thông tin chi tiết về vụ án và yêu cầu phân tích cụ thể",
        icon: "fas fa-folder-open"
      },
      {
        title: "Chứng từ chuỗi giám định",
        description: "Tài liệu ghi chép quá trình thu thập và bảo quản bằng chứng",
        icon: "fas fa-clipboard-list"
      },
      {
        title: "Giấy tờ tùy thân các bên liên quan",
        description: "CMND/CCCD của người yêu cầu xét nghiệm và đại diện pháp lý",
        icon: "fas fa-id-card"
      }
    ]
  },
};

function updateServiceContent(serviceType) {
  const service = serviceData[serviceType] || serviceData.paternity;

  updatePricingTab(service.pricing);

  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = service.title;
  }

  // Cập nhật tiêu đề
  const heroTitle = document.querySelector(".service-detail-hero h1");
  if (heroTitle) {
    heroTitle.textContent = service.title;
  }

  // Cập nhật mô tả
  const descriptionElement = document.querySelector(".service-description p");
  if (descriptionElement) {
    descriptionElement.textContent = service.description;
  }

  // Cập nhật giá
  const priceElement = document.querySelector(".pricing-card .amount");
  if (priceElement && service.pricing.standard) {
    priceElement.textContent = service.pricing.standard.price;
  }

  // Cập nhật quy trình nếu có dữ liệu
  updateProcessTab(service.process);
  
  // Cập nhật FAQ nếu có dữ liệu
  updateFAQTab(service.faq);
  
  // Cập nhật tài liệu nếu có dữ liệu
  updateDocumentsTab(service.documents);
}

function updatePricingTab(pricingData) {
  const pricingContainer = document.querySelector(".pricing-details");
  if (pricingContainer && pricingData) {
    const packages = ["standard", "express", "premium"];
    pricingContainer.innerHTML = packages.map(pkg => {
      const data = pricingData[pkg];
      if (!data) return "";
      return `
        <div class="pricing-box ${pkg}">
          <h4>Gói ${pkg.toUpperCase()}</h4>
          <p class="price"><strong>${data.price}</strong> (${data.turnaround})</p>
          <ul class="features">
            ${data.features.map(f => `<li><i></i> ${f}</li>`).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }
}

function updateProcessTab(processData) {
  const processContainer = document.querySelector("#process .timeline");
  if (processContainer && processData) {
    processContainer.innerHTML = processData.map(step => `
      <div class="timeline-item">
        <div class="timeline-marker">${step.step}</div>
        <div class="timeline-content">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
          <div class="timeline-details">
            <span class="duration"><i class="fas fa-clock"></i> ${step.duration}</span>
            ${step.requirements ? `
              <ul class="requirements">
                ${step.requirements.map(req => `<li><i></i> ${req}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }
}

function updateFAQTab(faqData) {
  const faqContainer = document.querySelector("#faq .accordion");
  if (faqContainer && faqData) {
    faqContainer.innerHTML = faqData.map(item => `
      <div class="accordion-item">
        <div class="accordion-header">
          <h4>${item.question}</h4>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <p>${item.answer}</p>
        </div>
      </div>
    `).join('');
    
  
    const newAccordionItems = faqContainer.querySelectorAll(".accordion-item");
    newAccordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      if (header) {
        header.addEventListener("click", (e) => {
          e.preventDefault();
          const isActive = item.classList.contains("active");
          newAccordionItems.forEach((accordionItem) => accordionItem.classList.remove("active"));
          if (!isActive) {
            item.classList.add("active");
          }
        });
      }
    });
  }
}

function updateDocumentsTab(documentsData) {
  const documentsContainer = document.querySelector("#documents .document-list");
  if (documentsContainer && documentsData) {
    documentsContainer.innerHTML = documentsData.map(doc => `
      <div class="document-item">
        <i class="${doc.icon}"></i>
        <div>
          <h4>${doc.title}</h4>
          <p>${doc.description}</p>
        </div>
      </div>
    `).join('');
  }
}
