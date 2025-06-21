/**
 * Hệ thống Quản lý Dịch vụ Xét nghiệm DNA Bloodline
 * Tệp JavaScript chính
 */

document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo tất cả các thành phần
  initNavigation();
  initScrollAnimations();
  initContactForm();
  initTestimonialSlider();
  initNewsletterForm();
});

/**
 * Khởi tạo điều hướng trên di động
 */
function initNavigation() {
  // Thêm chức năng bật tắt điều hướng trên di động
  const navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.innerHTML = '<i class="fas fa-bars"></i>';

  const header = document.querySelector("header .container");
  if (header) {
    header.appendChild(navToggle);

    navToggle.addEventListener("click", () => {
      const nav = document.querySelector("header nav");
      nav.classList.toggle("active");

      // Thay đổi biểu tượng dựa trên trạng thái điều hướng
      if (nav.classList.contains("active")) {
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    // Đóng điều hướng trên di động khi nhấp vào một liên kết
    const navLinks = document.querySelectorAll("header nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const nav = document.querySelector("header nav");
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // Thêm hành vi tiêu đề dính
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
  });
}

/**
 * Khởi tạo hiệu ứng cuộn
 */
function initScrollAnimations() {
  // Thêm hiệu ứng động cho các phần tử khi chúng xuất hiện trong khung nhìn
  const animatedElements = document.querySelectorAll(
    ".service-card, .step, .about-content, .testimonial, .contact-wrapper, .footer-content"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Thêm cuộn mượt cho các liên kết neo
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Khởi tạo chức năng biểu mẫu liên hệ
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Lấy dữ liệu biểu mẫu
      const formData = new FormData(this);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      // Hiển thị trạng thái đang gửi
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
      submitBtn.disabled = true;

      // Mô phỏng gửi biểu mẫu (thay thế bằng lệnh gọi API thực tế)
      setTimeout(() => {
        // Đặt lại biểu mẫu
        contactForm.reset();

        // Hiển thị thông báo thành công
        const successMessage = document.createElement("div");
        successMessage.className = "form-message success";
        successMessage.innerHTML =
          '<i class="fas fa-check-circle"></i> Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm.';

        contactForm.appendChild(successMessage);

        // Đặt lại nút
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Xóa thông báo sau 5 giây
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1500);
    });
  }
}

/**
 * Khởi tạo thanh trượt đánh giá
 */
function initTestimonialSlider() {
  const testimonialContainer = document.querySelector(".testimonial-slider");
  if (testimonialContainer) {
    // Thêm các nút điều hướng
    const sliderNav = document.createElement("div");
    sliderNav.className = "slider-nav";
    sliderNav.innerHTML = `
            <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
            <div class="slider-dots"></div>
            <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
        `;

    const testimonialSection = document.querySelector(".testimonials");
    testimonialSection.appendChild(sliderNav);

    const testimonials = document.querySelectorAll(".testimonial");
    const dotsContainer = document.querySelector(".slider-dots");

    // Tạo các chấm
    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    // Thêm sự kiện nhấp chuột vào các nút
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentSlide = 0;

    prevBtn.addEventListener("click", () => {
      currentSlide =
        (currentSlide - 1 + testimonials.length) % testimonials.length;
      goToSlide(currentSlide);
    });

    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % testimonials.length;
      goToSlide(currentSlide);
    });

    // Hàm để chuyển đến một slide cụ thể
    function goToSlide(index) {
      // Phiên bản di động: chỉ hiển thị một slide tại một thời điểm
      if (window.innerWidth < 768) {
        testimonials.forEach((testimonial, i) => {
          testimonial.style.display = i === index ? "block" : "none";
        });
      }

      // Cập nhật các chấm
      const dots = document.querySelectorAll(".slider-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      currentSlide = index;
    }

    // Khởi tạo thanh trượt cho di động
    if (window.innerWidth < 768) {
      goToSlide(0);
    }

    // Cập nhật thanh trượt khi thay đổi kích thước cửa sổ
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        goToSlide(currentSlide);
      } else {
        testimonials.forEach((testimonial) => {
          testimonial.style.display = "block";
        });
      }
    });

    // Tự động chuyển tiếp slide
    let sliderInterval = setInterval(() => {
      if (window.innerWidth < 768) {
        currentSlide = (currentSlide + 1) % testimonials.length;
        goToSlide(currentSlide);
      }
    }, 5000);

    // Tạm dừng tự động chuyển tiếp khi di chuột qua
    testimonialContainer.addEventListener("mouseenter", () => {
      clearInterval(sliderInterval);
    });

    testimonialContainer.addEventListener("mouseleave", () => {
      sliderInterval = setInterval(() => {
        if (window.innerWidth < 768) {
          currentSlide = (currentSlide + 1) % testimonials.length;
          goToSlide(currentSlide);
        }
      }, 5000);
    });
  }
}

/**
 * Khởi tạo chức năng biểu mẫu bản tin
 */
function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        // Hiển thị thông báo lỗi
        showFormMessage(
          newsletterForm,
          "Vui lòng nhập địa chỉ email hợp lệ.",
          "error"
        );
        return;
      }

      // Hiển thị trạng thái đang gửi
      const submitBtn = newsletterForm.querySelector("button");
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      // Mô phỏng đăng ký (thay thế bằng lệnh gọi API thực tế)
      setTimeout(() => {
        // Đặt lại biểu mẫu
        newsletterForm.reset();

        // Hiển thị thông báo thành công
        showFormMessage(
          newsletterForm,
          "Cảm ơn bạn đã đăng ký nhận bản tin của chúng tôi!",
          "success"
        );

        // Đặt lại nút
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}

/**
 * Hàm tiện ích để xác thực email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Hàm tiện ích để hiển thị thông báo biểu mẫu
 */
function showFormMessage(form, message, type) {
  // Xóa mọi thông báo hiện có
  const existingMessage = form.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Tạo và thêm phần tử thông báo
  const messageElement = document.createElement("div");
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;

  // Thêm biểu tượng dựa trên loại thông báo
  if (type === "success") {
    messageElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  } else if (type === "error") {
    messageElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  }

  form.appendChild(messageElement);

  // Xóa thông báo sau 5 giây
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  });
});
