document.addEventListener("DOMContentLoaded", function () {
  const username = sessionStorage.getItem("loggedInUsername");
  if (!username) return;

  fetch(`http://localhost:8080/api/orders?username=${username}`)
    .then(res => res.json())
    .then(data => {
      const body = document.getElementById("appointments-body");
      if (!body || !Array.isArray(data)) return;

      body.innerHTML = data.map(item => `
        <tr data-id="${item.id}">
          <td>${item.appointmentDate || "-"}</td>
          <td>${item.appointmentTime || "-"}</td>
          <td>${item.recipientName || "-"}</td>
          <td>${item.recipientPhone || "-"}</td>
          <td>${item.recipientAddress || "-"}</td>
          <td>${item.selectedPackageLabel || "-"}</td>
          <td>${item.testType || "-"}</td>
        </tr>
      `).join('');
    })
    .catch(err => console.error("Lỗi tải lịch hẹn:", err));
});
