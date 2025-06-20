// Hiện / ẩn mật khẩu
document.querySelector('.toggle-password').addEventListener('click', function () {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

// Cập nhật role khi bấm nút
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('role').value = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Xử lý đăng nhập phân vai
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  const userDB = {
    admin: {
      email: "admin@bloodline.com",
      password: "admin123",
      redirect: "admin-dashboard.html"
    },
    customer: {
      email: "customer@example.com",
      password: "cust123",
      redirect: "customer-dashboard.html"
    },
    staff: {
      email: "staff@example.com",
      password: "staff123",
      redirect: "staff-dashboard.html"
    },
    manager: {
      email: "manager@example.com",
      password: "mana123",
      redirect: "manager-dashboard.html"
    }
  };

  const user = userDB[role];

  if (user && email === user.email && password === user.password) {
    alert("Đăng nhập thành công với vai trò " + role);
    window.location.href = user.redirect;
  } else {
    alert("Sai thông tin đăng nhập hoặc không đúng vai trò.");
  }
});
