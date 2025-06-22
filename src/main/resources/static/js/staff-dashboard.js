
// Sự kiện click xem thông tin mẫu xét nghiệm icon mắt
document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener('click', function () {
        // lấy dòng tr chứ nút click
        const tr = btn.closest('tr');
        // lấy tất cả các ô td trong dòng đó
        const tds = tr.querySelectorAll('td');

        // lấy thông tin data actribute(nếu có), nếu không lấy từ td
        document.getElementById('modal-id').textContent = tr.dataset.id || tds[0].textContent;
        document.getElementById('modal-name').textContent = tr.dataset.name || tds[1].textContent;
        document.getElementById('modal-date').textContent = tr.dataset.date || tds[2].textContent;
        document.getElementById('modal-status').textContent = tr.dataset.status || tds[3].textContent;
        document.getElementById('modal-type').textContent = tr.dataset.type || "Chưa có thông tin";
        // hiển thị modal
        document.getElementById('specimen-modal').style.display = 'flex';
    });
});

// đóng modal khi bấm nút đóng
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.onclick = function() {
    document.getElementById('specimen-modal').style.display = 'none';
  };
});

// đóng modal khi click ra ngoài
document.getElementById('specimen-modal').onclick = function(ex) {
    if (ex.target === this) {
        this.style.display = 'none';
    }
};

// js điều chỉnh trạng thái mẫu xét nghiệm

let currentTr = null;
// bắt đầu sự kiện click vào nút (cập nhật trạng thái)
document.querySelectorAll('.update-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // lưu trạng thía <tr> hiện tại để sau này cập nhật
    currentTr = btn.closest('tr');
    // Hiện modal cập nhật trạng thái
    document.getElementById('update-modal').style.display = 'flex';
    // lấy trạng thái hiện tại từ <span classs="status"> trong dòng đó
    const currentStatus = currentTr.querySelector('.status').innerText.trim();
    // đặt trạng thái hiện tại vào dropdown select
    document.getElementById('status-select').value = currentStatus;
  });
});

// 2. Khi bấm nút "lưu" trong modal cập nhật trạng thái
document.getElementById('save-status-btn').onclick = function() {
  if (currentTr) {
    // lấy trạng thái mới từ dropdown
    const newStatus = document.getElementById('status-select').value;
    // cập nhật nội dung trạng thái trong bảng span
    const statusSpan = currentTr.querySelector('.status');
    statusSpan.innerText = newStatus;
    // cập nhật class cho trạng thái để đổi màu sắc nếu có
    statusSpan.className = 'status' + (
      newStatus === 'Đã hoàn thành' ? 'completed' :
      newStatus === 'chờ kết quả' ? 'pending' : 'processing'
    );
    // cập nhật lại data-status trên <tr>
    currentTr.dataset.status = newStatus;
    // đóng modal
    document.getElementById('update-modal').style.display = 'none';
  }
};

// 3. đóng modal khi bấm nút đóng
document.querySelectorAll('#update-modal .close-btn').forEach(btn => {
  btn.onclick = function() {
    document.getElementById('update-modal').style.display = 'none';
  };
});

// 4. đóng modal khi click ra ngoài modal-content
document.getElementById('udate-modal').onclick = function(ex) {
  if (ex.target === this) {
    this.style.display = 'none';
  }
};