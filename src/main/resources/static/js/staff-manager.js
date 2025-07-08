document.addEventListener("DOMContentLoaded", function () {
  const username = sessionStorage.getItem("loggedInUsername"); // Lấy username từ sessionStorage

  if (username) {
    // Cập nhật username trong header
    const userNameElements = document.querySelectorAll(".user-name");
    userNameElements.forEach((element) => {
      element.textContent = username;
    });

    // Cập nhật username trong phần "Chào mừng trở lại"
    const welcomeUserNameElement =
      document.getElementById("welcome-user-name");
    if (welcomeUserNameElement) {
      welcomeUserNameElement.textContent = username;
    }
  } else {
    console.warn(
      "Không tìm thấy username trong sessionStorage. Người dùng có thể chưa đăng nhập hoặc phiên đã hết hạn."
    );
    // window.location.href = 'login.html';
  }

  // Xử lý sự kiện đăng xuất
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("loggedInUsername");
      console.log("Username đã bị xóa khỏi sessionStorage.");
      window.location.href = "../login/login.html";
    });
  }

  // Notification filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const notifItems = document.querySelectorAll('.notif-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const type = this.getAttribute('data-type');
      notifItems.forEach(item => {
        if (type === 'all' || item.classList.contains(type)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  let allCustomers = [];

  function renderCustomerTable(customers) {
    const tbody = document.querySelector('.customer-table tbody');
    tbody.innerHTML = '';
    customers.filter(customer => customer.role === 'staff').forEach(customer => {
      tbody.innerHTML += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.email}</td>
          <td>${customer.firstName}</td>
          <td>${customer.lastName}</td>
          <td>*******</td>
          <td>${customer.phone}</td>
          <td>${customer.username}</td>
          <td>${customer.active ? 'true' : 'false'}</td>
          <td>${customer.role}</td>
          <td>
            <button class="edit-btn" onclick='editCustomer(${JSON.stringify(customer).replace(/'/g, "\\'")})'>Sửa</button>
            <button class="delete-btn" onclick="deleteCustomer(${customer.id})">Xóa</button>
          </td>
        </tr>
      `;
    });
  }

  // Khi tải trang, lấy dữ liệu và render bảng
  fetch('/api/users')
    .then(response => response.json())
    .then(data => {
      allCustomers = data;
      renderCustomerTable(allCustomers);
    });

  // Xử lý tìm kiếm
  document.getElementById('customerSearchInput').addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    const filtered = allCustomers.filter(customer => {
      return (
        (customer.firstName && customer.firstName.toLowerCase().includes(keyword)) ||
        (customer.lastName && customer.lastName.toLowerCase().includes(keyword)) ||
        (customer.username && customer.username.toLowerCase().includes(keyword)) ||
        (customer.email && customer.email.toLowerCase().includes(keyword)) ||
        (customer.phone && customer.phone.includes(keyword))
      );
    });
    renderCustomerTable(filtered);
  });

  // Ẩn/hiện form thêm khách hàng
  const showBtn = document.getElementById('showAddCustomerFormBtn');
  const form = document.getElementById('addCustomerForm');
  const cancelBtn = document.getElementById('cancelAddCustomerBtn');

  showBtn.addEventListener('click', function() {
    form.style.display = 'block';
    showBtn.style.display = 'none';
  });

  cancelBtn.addEventListener('click', function() {
    form.style.display = 'none';
    showBtn.style.display = 'inline-block';
    form.querySelectorAll('input').forEach(input => input.value = '');
    form.querySelector('select').selectedIndex = 0;
    form.removeAttribute('data-edit-id');
  });
});

// Thêm khách hàng mới (ví dụ)
function addCustomer() {
  const form = document.getElementById('addCustomerForm');
  const editId = form.getAttribute('data-edit-id');
  const email = document.getElementById('email').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const username = document.getElementById('username').value.trim();
  const active = document.getElementById('active').value === "true";
  let role = document.getElementById('role').value.trim();

  // Validation
  if (!email.includes('@')) {
    alert('Email phải chứa ký tự @ và .com');
    return;
  }
  if (password.length < 8) {
    alert('Password phải có ít nhất 8 ký tự');
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert('Số điện thoại phải là 10 chữ số');
    return;
  }
  // Role mặc định là staff nếu để trống hoặc khác staff
  if (!role || role.toLowerCase() !== 'staff') {
    role = 'staff';
    document.getElementById('role').value = 'staff';
  }

  const customer = {
    email,
    firstName,
    lastName,
    password,
    phone,
    username,
    active,
    role
  };

  let url = '/api/users';
  let method = 'POST';

  if (editId) {
    url += `/${editId}`;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
  })
  .then(response => response.json())
  .then(data => {
    alert(editId ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
    location.reload();
  })
  .catch(error => {
    alert('Có lỗi khi lưu khách hàng!');
    console.error(error);
  });
}

function deleteCustomer(id) {
  if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
    fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        alert('Xóa khách hàng thành công!');
        location.reload();
      } else {
        alert('Xóa khách hàng thất bại!');
      }
    })
    .catch(error => {
      alert('Có lỗi khi xóa khách hàng!');
      console.error(error);
    });
  }
}

function editCustomer(customer) {
  const form = document.getElementById('addCustomerForm');
  form.style.display = 'block';
  document.getElementById('showAddCustomerFormBtn').style.display = 'none';

  document.getElementById('email').value = customer.email;
  document.getElementById('firstName').value = customer.firstName;
  document.getElementById('lastName').value = customer.lastName;
  document.getElementById('password').value = customer.password || '';
  document.getElementById('phone').value = customer.phone;
  document.getElementById('username').value = customer.username;
  document.getElementById('active').value = customer.active ? "true" : "false";
  document.getElementById('role').value = customer.role;

  // Đổi tên nút (tùy chọn)
  form.querySelector('button[onclick="addCustomer()"]').textContent = "Cập nhật khách hàng";

  // Lưu lại id khách hàng đang sửa
  form.setAttribute('data-edit-id', customer.id);
}
