let selectedRating = 0;

const stars = document.querySelectorAll(".star");

stars.forEach((star) => {
  const value = parseInt(star.getAttribute("data-value"));

  star.addEventListener("click", function () {
    selectedRating = value;
    updateStars(selectedRating);
  });

  star.addEventListener("mouseover", function () {
    updateStars(value);
  });

  star.addEventListener("mouseout", function () {
    updateStars(selectedRating);
  });
});

function updateStars(value) {
  stars.forEach((s) => {
    const starValue = parseInt(s.getAttribute("data-value"));
    if (starValue <= value) {
      s.classList.add("selected");
    } else {
      s.classList.remove("selected");
    }
  });
}

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
      updateStars(0); 
      loadUserFeedbacks(); 
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
