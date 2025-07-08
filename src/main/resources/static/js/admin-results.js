function loadResults() {
  fetch('/api/user-order-tests')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('resultsBody');
      tbody.innerHTML = '';
      data.forEach(result => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${result.id}</td>
          <td>${result.username}</td>
          <td>${result.testType || ''}</td>
          <td>${result.appointmentDate || ''}</td>
          <td>
            <button onclick="viewDetail('${result.id}')" title="Xem chi tiết">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Lỗi khi tải dữ liệu:', error);
    });
}

function viewDetail(id) {
  window.location.href = `../admin/resultshow.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', loadResults);
