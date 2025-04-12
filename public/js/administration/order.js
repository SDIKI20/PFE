document.addEventListener("DOMContentLoaded", function () {
    fetchOrders(); // أول تحميل يعرض جميع الطلبات
  });
  
  // مستمع لزر "Orders"
document.getElementById("orders-menu-item").addEventListener("click", function () {
    // منع الانتقال الافتراضي
    // إزالة active من كل الأزرار
    document.querySelectorAll(".button_ord").forEach(btn => btn.classList.remove("active"));
  
    // تفعيل زر AllOrders (الافتراضي)
    const allOrdersButton = document.querySelector('.button_ord[data-role="all"]');
    if (allOrdersButton) {
      allOrdersButton.classList.add("active");
    }
  
    // جلب كل الطلبات
    fetchOrders();
  });
  
  // مستمع للأزرار الأخرى حسب role
  document.querySelectorAll(".button_ord").forEach(button => {
    button.addEventListener("click", function () {
      // تفعيل الزر المحدد فقط
      document.querySelectorAll(".button_ord").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
  
      const role = this.dataset.role;
      let url;
  
      switch (role) {
        case "pending":
          url = "http://localhost:4000/api/orders/getOrders/pending";
          break;
        case "completed":
          url = "http://localhost:4000/api/orders/getOrders/completed";
          break;
        case "canceled":
          url = "http://localhost:4000/api/orders/getOrders/canceled";
          break;
        case "active":
          url = "http://localhost:4000/api/orders/getOrders/active";
          break;
        default:
          url = "http://localhost:4000/api/orders/getOrders";
      }
  
      fetch(url)
        .then(response => response.json())
        .then(rentals => {
          displayOrders(rentals);
        })
        .catch(error => console.error("Error fetching orders:", error));
    });
  });
  
  // جلب كل الطلبات
  function fetchOrders() {
    fetch("http://localhost:4000/api/orders/getOrders")
      .then(response => response.json())
      .then(rentals => {
        closeLoader()
        displayOrders(rentals);
      })
      .catch(pushNotif("e",`Error fetching orders:${error}`))
      
  }

  
  // عرض الطلبات في الجدول
  function displayOrders(rentals) {
    const tableBody = document.getElementById("rentalsTableBody");
    tableBody.innerHTML = "";
  
    rentals.forEach(rental => {
      const row = document.createElement("tr");
  
      let statusClass = "";
      let statusIcon = "";
  
      switch (rental.status.toLowerCase()) {
        case "completed":
          statusClass = "status-completed";
          statusIcon = "✅";
          break;
        case "pending":
          statusClass = "status-pending";
          statusIcon = "⏳";
          break;
        case "canceled":
          statusClass = "status-canceled";
          statusIcon = "❌";
          break;
        case "active":
          statusClass = "status-active";
          statusIcon = "🟢";
          break;
      }
  
      row.innerHTML = `
        <td>${rental.user_id}</td>
        <td>${rental.vehicle_id}</td>
        <td>${new Date(rental.start_date).toDateString()}</td>
        <td>${new Date(rental.end_date).toDateString()}</td>
        <td class="${statusClass}">${statusIcon} ${rental.status}</td>
        <td>${rental.total_price} <span class="currence">DZD</span></td>
      `;
  
      tableBody.appendChild(row);
    });
  }