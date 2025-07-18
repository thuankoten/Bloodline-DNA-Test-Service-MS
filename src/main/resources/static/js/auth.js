document.addEventListener("DOMContentLoaded", function () {
  initAuthTabs();
  initPasswordToggle();
  initPasswordStrength();

  if (document.getElementById("loginForm")) {
    initLoginForm();
  }

  if (document.getElementById("registerForm")) {
    initRegisterForm();
  }
});

function initAuthTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  if (tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((tab) => tab.classList.remove("active"));
        btn.classList.add("active");
        const tabType = btn.dataset.tab;
        updateFormForTab(tabType);
      });
    });
  }
}

function updateFormForTab(tabType) {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.setAttribute("data-selected-role", tabType);

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    switch (tabType) {
      case "admin":
        emailInput.placeholder = "Nhập email của Admin";
        passwordInput.placeholder = "Nhập mật khẩu admin";
        showRoleHint("Admin: admin@bloodline.com / admin123");
        break;
      case "staff":
        emailInput.placeholder = "Nhập email của Staff";
        passwordInput.placeholder = "Nhập mật khẩu staff";
        showRoleHint("Staff: staff@bloodline.com / staff123");
        break;
      case "manager":
        emailInput.placeholder = "Nhập email của Manager";
        passwordInput.placeholder = "Nhập mật khẩu manager";
        showRoleHint("Manager: manager@bloodline.com / manager123");
        break;
      default:
        emailInput.placeholder = "Nhập email của bạn";
        passwordInput.placeholder = "Nhập mật khẩu của bạn";
        hideRoleHint();
        break;
    }
  }
}

function showRoleHint(message) {
  const existingHint = document.querySelector(".role-hint");
  if (existingHint) existingHint.remove();

  const hintElement = document.createElement("div");
  hintElement.className = "role-hint";
  hintElement.style.cssText = `
    background: #e3f2fd;
    border: 1px solid #2196f3;
    border-radius: 4px;
    padding: 8px 12px;
    margin: 10px 0;
    font-size: 14px;
    color: #1976d2;
    text-align: center;
  `;
  hintElement.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;

  const formContainer = document.querySelector(".auth-form-container");
  if (formContainer) {
    const form = formContainer.querySelector("form");
    formContainer.insertBefore(hintElement, form);
  }
}

function hideRoleHint() {
  const existingHint = document.querySelector(".role-hint");
  if (existingHint) existingHint.remove();
}

function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll(".toggle-password");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const passwordField = btn.parentElement.querySelector("input");
      if (passwordField.type === "password") {
        passwordField.type = "text";
        btn.classList.remove("fa-eye-slash");
        btn.classList.add("fa-eye");
      } else {
        passwordField.type = "password";
        btn.classList.remove("fa-eye");
        btn.classList.add("fa-eye-slash");
      }
    });
  });
}

function initPasswordStrength() {
  const passwordField = document.getElementById("password");
  if (passwordField) {
    passwordField.addEventListener("input", updatePasswordStrength);
  }

  function updatePasswordStrength() {
    const password = passwordField.value;
    const strengthMeter = document.querySelector(".strength-meter span");
    const strengthText = document.querySelector(".strength-text span");

    if (!strengthMeter || !strengthText) return;

    let strength = 0;
    let strengthLabel = "Yếu";
    let color = "#ff4d4d";

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    switch (strength) {
      case 0:
      case 1:
        strengthLabel = "Yếu";
        color = "#ff4d4d";
        strengthMeter.style.width = "25%";
        break;
      case 2:
        strengthLabel = "Trung bình";
        color = "#ffaa00";
        strengthMeter.style.width = "50%";
        break;
      case 3:
        strengthLabel = "Khá";
        color = "#2db92d";
        strengthMeter.style.width = "75%";
        break;
      case 4:
        strengthLabel = "Mạnh";
        color = "#00b300";
        strengthMeter.style.width = "100%";
        break;
    }

    strengthMeter.style.backgroundColor = color;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = color;
  }
}

function initLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const selectedRole =
        loginForm.getAttribute("data-selected-role") || "customer";

      if (!isValidEmail(email)) {
        showAuthMessage("Vui lòng nhập địa chỉ email hợp lệ.", "error");
        return;
      }

      if (password.length < 6) {
        showAuthMessage("Mật khẩu phải có ít nhất 6 ký tự.", "error");
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
      submitBtn.disabled = true;

      fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, selectedRole }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((errorText) => {
              try {
                const errorData = JSON.parse(errorText);
                throw new Error(
                  errorData.message ||
                    "Đăng nhập thất bại với status " + res.status
                );
              } catch (parseError) {
                throw new Error("Đăng nhập thất bại với status " + res.status);
              }
            });
          }
          return res.text();
        })
        .then((responseText) => {
          const data = JSON.parse(responseText);

          if (data.success) {
            if (
              data.user &&
              typeof data.user.username === "string" &&
              data.user.username.trim() !== ""
            ) {
              sessionStorage.setItem("loggedInUsername", data.user.username);
              sessionStorage.setItem("userRole", data.user.role);
              sessionStorage.setItem("userEmail", data.user.email);
              sessionStorage.setItem("userFullName", data.user.fullName);
              console.log(
                "Thông tin user đã được lưu vào sessionStorage:",
                data.user
              );
            }

            showAuthMessage("Đăng nhập thành công!", "success");

            setTimeout(() => {
              let redirectPage = "/customer/order-test.html";
              switch (data.user.role) {
                case "admin":
                  redirectPage = "/admin/admin-reports.html";
                  break;
                case "staff":
                  redirectPage = "/staff/staff-dashboard.html";
                  break;
                case "manager":
                  redirectPage = "/manager/customer-profile.html";
                  break;
                default:
                  redirectPage = "/customer/order-test.html";
              }

              console.log("Chuyển hướng đến:", redirectPage);
              window.location.href = redirectPage;
            }, 1500);
          } else {
            showAuthMessage(data.message || "Đăng nhập thất bại.", "error");
            submitBtn.innerHTML = "Đăng nhập";
            submitBtn.disabled = false;
          }
        })
        .catch((err) => {
          console.error("Lỗi khi gọi API đăng nhập:", err);
          showAuthMessage(
            "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
            "error"
          );
          submitBtn.innerHTML = "Đăng nhập";
          submitBtn.disabled = false;
        });
    });
  }
}

function initRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const termsChecked = document.getElementById("terms").checked;

      if (firstName.length < 2 || lastName.length < 2) {
        showAuthMessage("Vui lòng nhập đầy đủ họ tên của bạn.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showAuthMessage("Vui lòng nhập địa chỉ email hợp lệ.", "error");
        return;
      }

      if (username.length < 4) {
        showAuthMessage("Tên người dùng phải có ít nhất 4 ký tự.", "error");
        return;
      }

      if (password.length < 8) {
        showAuthMessage("Mật khẩu phải có ít nhất 8 ký tự.", "error");
        return;
      }

      if (password !== confirmPassword) {
        showAuthMessage("Mật khẩu không khớp.", "error");
        return;
      }

      if (!termsChecked) {
        showAuthMessage(
          "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.",
          "error"
        );
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang tạo tài khoản...';
      submitBtn.disabled = true;

      fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          username,
          password,
        }),
      })
        .then((res) => res.text())
        .then((responseText) => {
          const data = JSON.parse(responseText);
          if (data.success) {
            showAuthMessage(
              "Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.",
              "success"
            );
            setTimeout(() => {
              window.location.href = "login.html";
            }, 2000);
          } else {
            showAuthMessage(data.message || "Đăng ký thất bại.", "error");
            submitBtn.innerHTML = "Tạo tài khoản";
            submitBtn.disabled = false;
          }
        })
        .catch((err) => {
          console.error("Lỗi khi gọi API đăng ký:", err);
          showAuthMessage(
            "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.",
            "error"
          );
          submitBtn.innerHTML = "Tạo tài khoản";
          submitBtn.disabled = false;
        });
    });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showAuthMessage(message, type) {
  const existingMessage = document.querySelector(".auth-message");
  if (existingMessage) existingMessage.remove();

  const messageElement = document.createElement("div");
  messageElement.className = `auth-message ${type}`;
  messageElement.innerHTML =
    type === "success"
      ? `<i class="fas fa-check-circle"></i> ${message}`
      : `<i class="fas fa-exclamation-circle"></i> ${message}`;

  const formContainer = document.querySelector(".auth-form-container");
  if (formContainer) {
    formContainer.insertBefore(messageElement, formContainer.firstChild);
  } else {
    document.body.prepend(messageElement);
  }

  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 5000);
}
