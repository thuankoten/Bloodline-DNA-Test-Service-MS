document.addEventListener("DOMContentLoaded", function () {
  const testType = document.getElementById("test-type");
  const testPriceOptions = document.getElementById("test-price-options");

  const priceMap = {
    "dna-huyet-thong": [
      { label: "STANDARD (5 đến 7 ngày)", value: "4990000" },
      { label: "EXPRESS (2 đến 3 ngày)", value: "6990000" },
      { label: "PREMIUM (24 giờ)", value: "9990000" },
    ],
    "gia-dinh": [
      { label: "STANDARD (7 đến 10 ngày)", value: "5990000" },
      { label: "EXPRESS (3 đến 5 ngày)", value: "7990000" },
      { label: "PREMIUM (48 giờ)", value: "11990000" },
    ],
    "dna-phap-y": [
      { label: "STANDARD (10 đến 12 ngày)", value: "8990000" },
      { label: "EXPRESS (5 đến 7 ngày)", value: "12990000" },
      { label: "PREMIUM (3 ngày)", value: "15990000" },
    ],
  };
 
  testType.addEventListener("change", function () {
    const selected = this.value;
    const options = priceMap[selected];

    // Cập nhật các lựa chọn giá
    if (!options) {
      testPriceOptions.innerHTML =
        '<p style="color: #888;">Vui lòng chọn loại xét nghiệm</p>';
      return;
    }

    testPriceOptions.innerHTML = options
      .map(
        (opt, index) => `
        <label>
          <input type="radio" name="priceOption" value="${opt.value}" ${
          index === 0 ? "required" : ""
        } />
          ${opt.label} - ${parseInt(opt.value).toLocaleString()} VNĐ
        </label>
      `
      )
      .join("");

    const locationGroup = document.getElementById("location-group");
    if (selected === "dna-phap-y") {
      locationGroup.style.display = "none";

      locationGroup
        .querySelectorAll("input[name='location']")
        .forEach((input) => {
          input.required = false;
          input.checked = false;
        });
    } else {
      locationGroup.style.display = "block";

      locationGroup
        .querySelectorAll("input[name='location']")
        .forEach((input) => {
          input.required = true;
        });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("appointment-form");
  const testType = document.getElementById("test-type");
  const locationGroup = document.getElementById("location-group");
  const addressModal = document.getElementById("address-modal");
  const closeButton = addressModal.querySelector(".close-button");
  const addressForm = document.getElementById("address-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedType = testType.value;
    const selectedLocation = form.querySelector(
      "input[name='location']:checked"
    )?.value;
    const selectedPriceRadio = document.querySelector(
      "input[name='priceOption']:checked"
    );
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const username = sessionStorage.getItem("loggedInUsername");

    if (!selectedType) {
      alert("Vui lòng chọn loại xét nghiệm.");
      return;
    }

    if (!selectedPriceRadio) {
      alert("Vui lòng chọn gói dịch vụ.");
      return;
    }

    const selectedPriceLabel = selectedPriceRadio
      .closest("label")
      .innerText.trim();

    if (!appointmentDate || !appointmentTime) {
      alert("Vui lòng chọn ngày và giờ hẹn.");
      return;
    }

    if (selectedType === "dna-phap-y" || selectedLocation === "clinic") {
      fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          testType: selectedType,
          appointmentDate,
          appointmentTime,
          recipientName: null,
          recipientPhone: null,
          recipientAddress: null,
          selectedPackageLabel: selectedPriceLabel, // Gửi label về BE
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi từ server!");
          return res.json();
        })
        .then(() => {
          alert("Đặt hẹn thành công tại cơ sở y tế.");
          form.reset();
          locationGroup.style.display = "block";
        })
        .catch((err) => {
          console.error("Lỗi khi đặt lịch:", err);
          alert("Không thể gửi yêu cầu đặt hẹn.");
        });

      return;
    }

    if (selectedLocation === "home") {
      addressModal.classList.remove("hidden");
    } else {
      alert("Vui lòng chọn hình thức xét nghiệm.");
    }
  });

  closeButton.addEventListener("click", () => {
    addressModal.classList.add("hidden");
  });

  window.addEventListener("click", function (e) {
    if (e.target === addressModal) {
      addressModal.classList.add("hidden");
    }
  });

  addressForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const recipientName = document.getElementById("recipient-name").value;
    const recipientPhone = document.getElementById("recipient-phone").value;
    const recipientAddress = document.getElementById("recipient-address").value;
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const selectedType = testType.value;
    const selectedPriceRadio = document.querySelector(
      "input[name='priceOption']:checked"
    );
    const username = sessionStorage.getItem("loggedInUsername");

    if (!recipientName || !recipientPhone || !recipientAddress) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    if (!selectedPriceRadio) {
      alert("Vui lòng chọn gói dịch vụ.");
      return;
    }

    const selectedPriceLabel = selectedPriceRadio
      .closest("label")
      .innerText.trim();

    fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        testType: selectedType,
        appointmentDate,
        appointmentTime,
        recipientName,
        recipientPhone,
        recipientAddress,
        selectedPackageLabel: selectedPriceLabel, // Gửi label về BE
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi từ server!");
        return res.json();
      })
      .then(() => {
        alert("Đã xác nhận địa chỉ và đặt lịch nhận kit tại nhà!");
        form.reset();
        addressForm.reset();
        addressModal.classList.add("hidden");
        locationGroup.style.display = "block";
      })
      .catch((err) => {
        console.error("Lỗi khi gửi thông tin:", err);
        alert("Không thể gửi thông tin nhận kit.");
      });
  });
});
