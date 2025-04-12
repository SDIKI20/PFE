document.addEventListener("DOMContentLoaded", function () {
    fetchOrders(); // أول تحميل يعرض جميع الطلبات
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




