let selectedFeedbackId = null;

async function loadFeedbacks() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const starFilter = document.getElementById("starFilter").value;

  const res = await fetch("/api/feedback/all");
  const data = await res.json();

  const tbody = document.getElementById("feedbackTable");
  tbody.innerHTML = ""; // clear

  data
    .filter((item) => {
      const matchesKeyword =
        item.feedback.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search);
      const matchesStar = starFilter === "" || item.rating == starFilter;
      return matchesKeyword && matchesStar;
    })
    .forEach((item) => {
      const row = `<tr>
        <td>${item.customerName}</td>
        <td>${item.rating} <i class="fa-solid fa-star"></i></td>
        <td>${item.feedback}</td>
        <td>${item.createdAt}</td>
        <td>
          <button class="reply-btn" onclick="openReplyModal(${
            item.id
          }, '${item.feedback.replace(/'/g, "\\'")}')">Trả lời</button>
        </td>
      </tr>`;
      tbody.innerHTML += row;
    });
}

function openReplyModal(id, content) {
  selectedFeedbackId = id;
  document.getElementById("feedbackContent").innerText = "Phản hồi: " + content;
  document.getElementById("replyText").value = "";
  document.getElementById("replyModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("replyModal").style.display = "none";
}

async function submitReply() {
  const reply = document.getElementById("replyText").value.trim();
  if (!reply) return alert("Vui lòng nhập nội dung phản hồi.");

  const res = await fetch(`/api/feedback/reply/${selectedFeedbackId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply }),
  });

  if (res.ok) {
    alert("Đã gửi phản hồi!");
    closeModal();
    loadFeedbacks();
  } else {
    alert("Có lỗi khi gửi phản hồi.");
  }
}

// Load feedback khi mở trang
window.onload = loadFeedbacks;
