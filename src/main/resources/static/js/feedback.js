let selectedRating = 0;

document.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", function () {
    selectedRating = parseInt(this.getAttribute("data-value"));
    document
      .querySelectorAll(".star")
      .forEach((s) => s.classList.remove("selected"));
    for (let i = 0; i < selectedRating; i++) {
      document.querySelectorAll(".star")[i].classList.add("selected");
    }
  });
});

function submitFeedback() {
  const feedback = document.getElementById("feedback").value.trim();
  const username =
    sessionStorage.getItem("loggedInUsername") || "Người dùng ẩn danh";

  if (selectedRating === 0) return alert("Vui lòng chọn số sao để đánh giá.");
  if (!feedback) return alert("Vui lòng nhập nội dung đánh giá.");

  fetch("/api/feedback/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: selectedRating,
      feedback: feedback,
      customerName: username,
    }),
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      document.getElementById("feedback").value = "";
      selectedRating = 0;
      document
        .querySelectorAll(".star")
        .forEach((s) => s.classList.remove("selected"));
      loadUserFeedbacks(); // reload bảng
    });
}

function loadUserFeedbacks() {
  const username = sessionStorage.getItem("loggedInUsername");
  if (!username) return;

  fetch(`/api/feedback/user?username=${username}`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("userFeedbackList");
      tbody.innerHTML = "";

      if (data.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='3'>Bạn chưa gửi đánh giá nào.</td></tr>";
        return;
      }

      data.forEach((fb) => {
        const row = `
          <tr>
            <td>${fb.createdAt}</td>
            <td>${fb.rating}⭐ - ${fb.feedback}</td>
            <td>${fb.reply ? fb.reply : "Chưa có phản hồi"}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    });
}

window.addEventListener("DOMContentLoaded", () => {
  loadUserFeedbacks();
});
