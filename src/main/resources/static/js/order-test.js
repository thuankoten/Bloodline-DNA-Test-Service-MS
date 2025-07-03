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

    
    if (!options) {
      testPriceOptions.innerHTML =
        '<p style="color: #888;">Vui lòng chọn loại xét nghiệm</p>';
      return;
    }

    testPriceOptions.innerHTML = options
      .map(
        (opt, index) => `
        <label>
          <input type="radio" name="priceOption" value="${opt.value}" ${index === 0 ? "required" : ""} />
          ${opt.label} - ${parseInt(opt.value).toLocaleString()} VNĐ
        </label>
      `
      )
      .join("");

    const locationGroup = document.getElementById("location-group");
    if (selected === "dna-phap-y") {
      locationGroup.style.display = "none";
      locationGroup.querySelectorAll("input[name='location']").forEach((input) => {
        input.required = false;
        input.checked = false;
      });
    } else {
      locationGroup.style.display = "block";
      locationGroup.querySelectorAll("input[name='location']").forEach((input) => {
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
  const addressGroup = document.getElementById("recipient-address").closest(".form-group");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedType = testType.value;
    const selectedLocation = form.querySelector("input[name='location']:checked")?.value;
    const selectedPriceRadio = document.querySelector("input[name='priceOption']:checked");
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;

    if (!selectedType) return alert("Vui lòng chọn loại xét nghiệm.");
    if (!selectedPriceRadio) return alert("Vui lòng chọn gói dịch vụ.");
    if (!appointmentDate || !appointmentTime) return alert("Vui lòng chọn ngày và giờ hẹn.");

    // Hiển thị modal nhập thông tin người nhận
    addressModal.classList.remove("hidden");

    // Ẩn địa chỉ nếu không phải "Tại nhà"
    if (selectedType === "dna-phap-y" || selectedLocation === "clinic") {
      addressGroup.style.display = "none";
    } else {
      addressGroup.style.display = "block";
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
    const recipientAddressField = document.getElementById("recipient-address");
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const selectedType = testType.value;
    const selectedPriceRadio = document.querySelector("input[name='priceOption']:checked");
    const selectedLocation = form.querySelector("input[name='location']:checked")?.value;
    const username = sessionStorage.getItem("loggedInUsername");

    const recipientAddress =
      selectedType === "dna-phap-y" || selectedLocation === "clinic"
        ? null
        : recipientAddressField.value;

    if (!recipientName || !recipientPhone) {
      return alert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
    }

    if (recipientAddressField.closest(".form-group").style.display !== "none" && !recipientAddress) {
      return alert("Vui lòng nhập địa chỉ nhận kit.");
    }

    const selectedPriceLabel = selectedPriceRadio.closest("label").innerText.trim();

    fetch("http://localhost:8080/api/orders", {
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
        selectedPackageLabel: selectedPriceLabel,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi từ server!");
        return res.json();
      })
      .then(() => {
        alert("Đặt lịch thành công!");
        form.reset();
        addressForm.reset();
        addressModal.classList.add("hidden");
        locationGroup.style.display = "block";
      })
      .catch((err) => {
        console.error("Lỗi khi gửi thông tin:", err);
        alert("Không thể gửi thông tin.");
      });
  });
});
