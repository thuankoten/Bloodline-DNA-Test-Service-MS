document.addEventListener("DOMContentLoaded", function () {
  const username = sessionStorage.getItem("loggedInUsername");
  const usedServicesList = document.getElementById("used-services-list");

  if (!username || !usedServicesList) return;

  const modal = document.createElement("div");
  modal.id = "sample-confirm-modal";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-box">
      <p id="modal-message">Bạn có chắc muốn chọn mẫu này?</p>
      <div class="modal-actions">
        <button id="modal-confirm">Xác nhận</button>
        <button id="modal-cancel">Huỷ</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let confirmCallback = null;
  document.getElementById("modal-confirm").addEventListener("click", () => {
    modal.style.display = "none";
    if (typeof confirmCallback === "function") confirmCallback();
  });
  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.style.display = "none";
  });

  fetch(`http://localhost:8080/api/orders?username=${username}`)
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        usedServicesList.innerHTML = "<li>Dữ liệu không hợp lệ</li>";
        return;
      }

      if (data.length === 0) {
        usedServicesList.innerHTML = "<li>Chưa sử dụng dịch vụ nào</li>";
        return;
      }

      const servicesMap = {
        "dna-huyet-thong": "Xét nghiệm DNA huyết thống",
        "gia-dinh": "Xét nghiệm mối quan hệ gia đình",
        "dna-phap-y": "Xét nghiệm DNA pháp y",
      };

      data.forEach((order) => {
        const li = document.createElement("li");

        const serviceName = servicesMap[order.testType] || order.testType;
        const appointmentDate = order.appointmentDate || "Không rõ ngày";
        const appointmentTime = order.appointmentTime || "Không rõ giờ";

        li.innerHTML = `
          <div><strong>${serviceName}</strong>  
            Ngày hẹn: <span>${appointmentDate}</span>  
            Giờ hẹn: <span>${appointmentTime}</span>
          </div>
          <div>
            <label>Mẫu xét nghiệm:</label>
            <select class="sample-type-select" data-order-id="${order.id}">
              <option value="">-- Chọn mẫu --</option>
              <option value="Máu">Máu</option>
              <option value="Tóc">Tóc</option>
              <option value="Vân tay">Vân tay</option>
              <option value="Khác">Khác</option>
            </select>
            <span class="test-status"></span>
          </div>
        `;

        usedServicesList.appendChild(li);

        const select = li.querySelector(".sample-type-select");
        const statusSpan = li.querySelector(".test-status");

        // nếu mẫu đã được chọn trước đó thì hiển thị đúng và khóa lại 
        if (order.sample) {
          // gán mẫu đúng với giá trị trong select
          const options = Array.from(select.options);
          const match = options.find(opt => opt.value === order.sample);
          if (match) {
            select.value = match.value;
            select.disabled = true;
          }
          // select.value = order.sample;
          // select.disabled = true;

          // Hiển thị trạng thái tương ứng từ order.status
          if (order.status === "0") {
            statusSpan.textContent = "Đang xét nghiệm";
            statusSpan.classList.add("waiting");
          } else if (order.status === "2") {
            statusSpan.textContent = "Đã hoàn tất";
            statusSpan.classList.add("done");
          } else if (order.status === "1") {
            statusSpan.textContent = "Chờ kết quả";
            statusSpan.classList.add("pending-result");
          } else {
            statusSpan.textContent = "Không rõ trạng thái";
            statusSpan.classList.add("unknown")
          }
        } else {
          // Nếu chưa chọn mẫu → cho phép chọn mẫu
          select.addEventListener("change", () => {
            const sample = select.value;
            const orderId = select.getAttribute("data-order-id");
            if (!sample || !orderId) return;

            document.getElementById(
              "modal-message"
            ).textContent = `Bạn có chắc chắn chọn mẫu "${sample}" cho xét nghiệm này?`;
            modal.style.display = "flex";

            confirmCallback = () => {
              fetch(`http://localhost:8080/api/orders/${orderId}/sample`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sample }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Lỗi khi gửi mẫu");
                  return res.json();
                })
                .then((updatedOrder) => {
                  select.disabled = true;
                  // statusSpan.textContent = "Đang chờ xét nghiệm";
                  // statusSpan.classList.add("waiting");

                  // Sau khi chọn mẫu, gán trạng thái đúng từ phản hồi
                  if (updatedOrder.status === "0") {
                    statusSpan.textContent = "Đang xét nghiệm";
                    statusSpan.classList.add("waiting");
                  } else if (updatedOrder.status === "1") {
                    statusSpan.textContent = "Đã hoàn tất";
                    statusSpan.classList.add("done");
                  } else if(updatedOrder.status === "2") {
                    statusSpan.textContent = "Chờ kết quả";
                    statusSpan.classList.add("pending-result");
                  } else {
                    statusSpan.textContent = "Đang chờ xét nghệm";
                    statusSpan.classList.add("waiting");
                  }
                })
                .catch((error) => {
                  console.error("Lỗi gửi mẫu:", error);
                  alert("Không thể gửi mẫu, vui lòng thử lại.");
                  select.value = "";
                });
            };
          });
        }
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải danh sách dịch vụ:", error);
      usedServicesList.innerHTML = "<li>Lỗi khi tải dữ liệu</li>";
    });
});
