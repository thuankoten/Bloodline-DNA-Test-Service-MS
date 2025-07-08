document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('Không tìm thấy mã xét nghiệm!');
    return;
  }

  fetch(`/api/orders/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Không tìm thấy kết quả!');
      return res.json();
    })
    .then(data => renderResult(data))
    .catch(err => {
      console.error(err);
      document.querySelector('.report-container').innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    });
});

function renderResult(data) {
  document.getElementById('id').textContent = data.id || '';
  document.getElementById('username').textContent = data.customerName || data.username || '';
  document.getElementById('appointmentdate').textContent = data.receivedDate || data.appointmentDate || '';
  // Hiển thị loại xét nghiệm, lấy đúng trường test_type
  document.getElementById('testtype').textContent = data.test_type || data.testtype || data.type || data.loaiXetNghiem || '';
  // Xử lý xuống hàng sau 'Kết luận:' nếu có
  let conclusion = data.conclusion || '';
  conclusion = conclusion.replace(/(Kết luận:)/i, '<br><strong style="background:#bdeeee">$1</strong>');
  document.getElementById('conclusion').innerHTML = conclusion ? conclusion : '<em>Chưa có kết luận</em>';
}
