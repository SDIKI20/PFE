const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      brentalsWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
})


// جلب جميع الطلبات من السيرفر
// عند الضغط على عنصر "Orders" في الـ navbar
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
        displayOrders(rentals);
      })
      .catch(error => console.error("Error fetching orders:", error));
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
        <td>${rental.start_date}</td>
        <td>${rental.end_date}</td>
        <td class="${statusClass}">${statusIcon} ${rental.status}</td>
        <td>${rental.total_price}</td>
      `;
  
      tableBody.appendChild(row);
    });
  }
  
    
//get all users

let allcustomers = [];

document.addEventListener("DOMContentLoaded", function () {
    fetchCustomers("all"); // أول تحميل يعرض الجميع
});

document.getElementById("customers-menu-item").addEventListener("click", function () {
    fetchCustomers("all");
});

document.querySelectorAll(".button_cust").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll(".button_cust").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        
        const selectedRole = this.getAttribute("data-role");
        fetchCustomers(selectedRole);
    });
});

function fetchCustomers(role) {
    let url;

    switch (role) {
        case "Client":
            url = "http://localhost:4000/api/Users/getClients";
            break;
        case "Admin":
            url = "http://localhost:4000/api/Users/getAdmins";
            break;
        case "Employe":
            url = "http://localhost:4000/api/Users/getEmployees";
            break;
        default:
            url = "http://localhost:4000/api/Users/getUsers";
    }

    fetch(url)
        .then(response => response.json())
        .then(customers => {
            if (role === "all") {
                allcustomers = customers; // نخزنهم مرة واحدة
            }
            displayCustomers(customers);
        })
        .catch(error => console.error("Error fetching customers:", error));
}

function displayCustomers(customers) {
    const tableBody = document.getElementById("customersTableBody");
    tableBody.innerHTML = "";

    customers.forEach(customer => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.fname}</td>
            <td>${customer.lname}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.country}</td>
            <td>${customer.role}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        tableBody.appendChild(row);
    });
}

document.getElementById("customersTableBody").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();

        const row = e.target.closest("tr");
        const userId = row.querySelector("td").textContent.trim();

        if (!userId) {
            alert("User ID is missing");
            return;
        }

      

        fetch(`http://localhost:4000/api/Users/deleteuser/${userId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                row.remove();
            } else {
                alert("Failed to delete user: " + (data.error || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    fetchVehicles();
});

document.getElementById("vehicles-menu-item").addEventListener("click", function () {
    fetchVehicles(); 
});

function fetchVehicles() {
    fetch("http://localhost:4000/api/vehicles/all")
        .then(response => response.json())
        .then(vehicles => {
            const tableBody = document.getElementById("vehiclesTableBody");
            tableBody.innerHTML = "";

            vehicles.forEach(vehicle => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${vehicle.id}</td>
                    <td>${vehicle.fab_year}</td>
                    <td>${vehicle.model}</td>
                    <td>
                        <button 
                            type="button" 
                            class="delete-btn" 
                            data-id="${vehicle.id}" 
                            data-model="${vehicle.model}">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            attachDeleteEvents(); // <--- مهم: ربط الأحداث بعد توليد الأزرار
        })
        .catch(error => console.error("Error fetching vehicles:", error));
}
document.addEventListener("DOMContentLoaded", function () {
    fetchVehicles();
});

document.getElementById("vehiclesTableBody").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();

        const row = e.target.closest("tr");
        const vehicleId = row.querySelector("td").textContent.trim();

        if (!vehicleId) {
            alert("Vehicle ID is missing");
            return;
        }

            fetch(`http://localhost:4000/api/vehicles/delete/${vehicleId}`, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        row.remove();
                    } else {
                        alert("Failed to delete vehicle: " + (data.error || "Unknown error"));
                    }
                })
                .catch(error => {
                    console.error("Error deleting vehicle:", error);
                    alert("An error occurred while deleting the vehicle.");
                });
        }
    }
);
