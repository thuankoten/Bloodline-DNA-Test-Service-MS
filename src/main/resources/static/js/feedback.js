let selectedRating = 0;

    document.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', function () {
        selectedRating = parseInt(this.getAttribute('data-value'));
        document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
        for (let i = 0; i < selectedRating; i++) {
          document.querySelectorAll('.star')[i].classList.add('selected');
        }
      });
    });

    function submitFeedback() {
      const feedback = document.getElementById("feedback").value.trim();

      if (selectedRating === 0) return alert("Vui lòng chọn số sao để đánh giá.");
      if (!feedback) return alert("Vui lòng nhập nội dung đánh giá.");

      fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rating: selectedRating,
          feedback: feedback,
          customerName: "Người dùng ẩn danh" // hoặc lấy từ session nếu có đăng nhập
        })
      })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        document.getElementById("feedback").value = "";
        selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
      });
    }