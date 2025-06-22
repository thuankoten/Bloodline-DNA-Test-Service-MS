document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceType = urlParams.get("service");

  const serviceInfo = {
    paternity: {
      name: "Xét nghiệm DNA huyết thống",
      allowedMethods: ["self", "facility-home", "facility-location"]
    },
    relationship: {
      name: "Xét nghiệm mối quan hệ gia đình",
      allowedMethods: ["self", "facility-home"]
    },
    forensic: {
      name: "Xét nghiệm DNA pháp y",
      allowedMethods: ["facility-location"]
    }
  };

  if (serviceType && serviceInfo[serviceType]) {
    const service = serviceInfo[serviceType];

    // Hiển thị dịch vụ đã chọn
    const serviceDisplay = document.createElement("div");
    serviceDisplay.className = "selected-service";
    serviceDisplay.innerHTML = `
      <h3>Dịch vụ đã chọn</h3>
      <p>${service.name}</p>
    `;
    const form = document.getElementById("appointmentForm");
    form.insertBefore(serviceDisplay, form.firstChild);

    // Hiển thị phần chọn phương thức lấy mẫu
    const collectionSection = document.getElementById("collectionSection");
    collectionSection.style.display = "block";

    const collectionMethod = document.getElementById("collectionMethod");
    const facilityOptions = document.getElementById("facilityOptions");
    const facilityType = document.getElementById("facilityType");
    const addressGroup = document.getElementById("addressGroup");

    function updateOptions() {
      // Reset dropdowns
      collectionMethod.innerHTML = `
        <option value="">-- Chọn phương thức --</option>
      `;
      facilityType.innerHTML = `
        <option value="">-- Chọn hình thức --</option>
      `;

      if (service.allowedMethods.includes("self")) {
        collectionMethod.innerHTML += `<option value="self">Tự thu mẫu tại nhà</option>`;
      }

      if (
        service.allowedMethods.includes("facility-home") ||
        service.allowedMethods.includes("facility-location")
      ) {
        collectionMethod.innerHTML += `<option value="facility">Yêu cầu cơ sở thu mẫu</option>`;
      }

      collectionMethod.addEventListener("change", function () {
        facilityOptions.style.display = "none";
        facilityType.removeAttribute("required");
        addressGroup.style.display = "none";
        addressGroup.querySelector("input").removeAttribute("required");

        if (this.value === "facility") {
          facilityOptions.style.display = "block";
          facilityType.setAttribute("required", "required");

          facilityType.innerHTML = `<option value="">-- Chọn hình thức --</option>`;
          if (service.allowedMethods.includes("facility-home")) {
            facilityType.innerHTML += `<option value="home">Nhân viên đến nhà</option>`;
          }
          if (service.allowedMethods.includes("facility-location")) {
            facilityType.innerHTML += `<option value="at-location">Đến cơ sở xét nghiệm</option>`;
          }
        }

        if (
          this.value === "self" &&
          (serviceType === "paternity" || serviceType === "relationship")
        ) {
          addressGroup.style.display = "block";
          addressGroup.querySelector("input").setAttribute("required", "required");
        }
      });

      facilityType.addEventListener("change", function () {
        if (
          this.value === "home" &&
          (serviceType === "paternity" || serviceType === "relationship")
        ) {
          addressGroup.style.display = "block";
          addressGroup.querySelector("input").setAttribute("required", "required");
        } else {
          addressGroup.style.display = "none";
          addressGroup.querySelector("input").removeAttribute("required");
        }
      });
    }

    updateOptions();
  }

  // Gửi form
  document
    .getElementById("appointmentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Đặt lịch hẹn thành công!");
      window.location.href = "index.html";
    });
});
