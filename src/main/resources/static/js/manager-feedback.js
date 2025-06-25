 async function loadFeedbacks() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const starFilter = document.getElementById('starFilter').value;

      const res = await fetch("/api/feedback/all");
      const data = await res.json();

      const tbody = document.getElementById("feedbackTable");
      tbody.innerHTML = ""; // clear cũ

      data
        .filter(item => {
          const matchesKeyword = item.feedback.toLowerCase().includes(search) || item.customerName.toLowerCase().includes(search);
          const matchesStar = starFilter === "" || item.rating == starFilter;
          return matchesKeyword && matchesStar;
        })
        .forEach(item => {
          const row = `<tr>
            <td>${item.customerName}</td>
            <td>${item.rating} &#11088;</td>
            <td>${item.feedback}</td>
            <td>${item.createdAt}</td>
            <td><button class="delete-btn" onclick="deleteFeedback(${item.id})">Xóa</button></td>
          </tr>`;
          tbody.innerHTML += row;
        });
    }

    async function deleteFeedback(id) {
      if (confirm("Bạn có chắc chắn muốn xóa feedback này không?")) {
        const res = await fetch("/api/feedback/delete/" + id, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Đã xóa thành công!");
          loadFeedbacks();
        } else {
          alert("Có lỗi khi xóa.");
        }
      }
    }

    // Tự động load khi mở trang
    window.onload = loadFeedbacks;