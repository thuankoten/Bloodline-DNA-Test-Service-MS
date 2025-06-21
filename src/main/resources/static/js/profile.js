document.addEventListener("DOMContentLoaded", function () {
  const username = sessionStorage.getItem("loggedInUsername");

  if (username) {
    document.querySelectorAll(".user-name").forEach((el) => {
      el.textContent = username;
    });

    fetch(`http://localhost:8080/api/user?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          document.getElementById("full-name").value = data.user.fullName || "";
          document.getElementById("email").value = data.user.email || "";
          document.getElementById("phone").value = data.user.phone || "";
        } else {
          console.error("Không tìm thấy dữ liệu người dùng:", data.message);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu hồ sơ:", err);
      });
  }

  // Xử lý đăng xuất
  const logoutLink = document.getElementById("logout-link");
  logoutLink?.addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("loggedInUsername");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userFullName");
    window.location.href = "index.html";
  });

  // Kiểm tra độ mạnh mật khẩu mới
  const passwordField = document.getElementById("new-password");
  if (passwordField) {
    passwordField.addEventListener("input", function () {
      const password = passwordField.value;
      const strengthMeter = document.querySelector(".strength-meter span");
      const strengthText = document.querySelector(".strength-text span");

      if (!strengthMeter || !strengthText) return;

      let strength = 0;
      let label = "Yếu";
      let color = "#ff4d4d";

      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/\d/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;

      switch (strength) {
        case 0:
        case 1:
          label = "Yếu";
          color = "#ff4d4d";
          strengthMeter.style.width = "25%";
          break;
        case 2:
          label = "Trung bình";
          color = "#ffaa00";
          strengthMeter.style.width = "50%";
          break;
        case 3:
          label = "Khá";
          color = "#2db92d";
          strengthMeter.style.width = "75%";
          break;
        case 4:
          label = "Mạnh";
          color = "#00b300";
          strengthMeter.style.width = "100%";
          break;
      }

      strengthMeter.style.backgroundColor = color;
      strengthText.textContent = label;
      strengthText.style.color = color;
    });
  }
});

const form = document.querySelector(".profile-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = sessionStorage.getItem("loggedInUsername");
    const newPassword = document.getElementById("new-password").value;

    if (!newPassword || newPassword.trim().length < 6) {
      alert("Mật khẩu phải từ 6 ký tự trở lên.");
      return;
    }

    fetch("http://localhost:8080/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        newPassword: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.success) {
          document.getElementById("new-password").value = "";
          document.querySelector(".strength-meter span").style.width = "0";
          document.querySelector(".strength-text span").textContent = "";
        }
      })
      .catch((err) => {
        console.error("Lỗi đổi mật khẩu:", err);
        alert("Đã xảy ra lỗi khi đổi mật khẩu.");
      });
  });
}

