document.addEventListener('DOMContentLoaded', function () {
  const username = sessionStorage.getItem('loggedInUsername'); // đổi từ localStorage sang sessionStorage
  if (!username) {
    alert('Không tìm thấy thông tin đăng nhập!');
    return;
  }
  fetch(`http://localhost:8080/api/orders?username=${username}`)
    .then(response => response.json())
    .then(data => renderResultsTable(data))
    .catch(error => {
      console.error('Lỗi khi lấy dữ liệu:', error);
    });
});

function renderResultsTable(results) {
  const tbody = document.getElementById('results-table-body');
  tbody.innerHTML = '';
  if (!results.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;">Không có kết quả xét nghiệm nào.</td></tr>`;
    return;
  }
  results.forEach(item => {
    let statusText = '';
    switch (item.status) {
      case '0':
        statusText = 'Đang chờ xử lý';
        break;
      case '1':
        statusText = 'Đang xử lý';
        break;
      case '2':
        statusText = 'Đã hoàn thành';
        break;
      default:
        statusText = '';
    }
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.recipientName || ''}</td>
      <td>${item.testType || ''}</td>
      <td>${item.sample || ''}</td>
      <td>${statusText}</td>
      <td>
        <button class="view-result-btn" data-id="${item.id}" title="Xem kết quả">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Thêm sự kiện click cho các nút xem kết quả
  document.addEventListener('click', function(e) {
    if (e.target.closest('.view-result-btn')) {
      const id = e.target.closest('.view-result-btn').dataset.id;
      if (id) {
        // Gọi API lấy chi tiết kết quả
        fetch(`/api/orders/${id}`)
          .then(res => res.json())
          .then(data => showResultModal(data))
          .catch(() => alert('Không thể tải kết quả!'));
      }
    }
    // Đóng modal khi bấm dấu X
    if (e.target.classList.contains('close-modal')) {
      document.getElementById('result-modal').style.display = 'none';
    }
  });

  // Hàm render nội dung modal
  function showResultModal(data) {
    const modal = document.getElementById('result-modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <h2>KẾT QUẢ XÉT NGHIỆM ADN</h2>
      <p><strong>Mã xét nghiệm:</strong> ${data.id || ''}</p>
      <p><strong>Họ và tên người xét nghiệm:</strong> ${data.customerName || data.username || ''}</p>
      <p><strong>Ngày xét nghiệm:</strong> ${data.receivedDate || data.appointmentDate || ''}</p>
      <p><strong>Loại xét nghiệm:</strong> ${data.test_type || data.testType || ''}</p>
      <div class="conclusion-box" style="margin-top:20px;">
        <h3>Kết quả & Kết luận</h3>
        <p>${data.conclusion ? data.conclusion.replace(/(Kết luận:)/i, '<br><strong style="background:#bdeeee">$1</strong>') : '<em>Chưa có kết luận</em>'}</p>
      </div>
    `;
    modal.style.display = 'flex';
  }
}
