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
function fetchrentals() {
    fetch("http://localhost:4000/orders/getOrders") // استبدل هذا بالرابط الصحيح لواجهة برمجة التطبيقات الخاصة بك
        .then(response => response.json())
        .then( rentals=> { 
            allrentals = rentals; // حفظ جميع الطلبات في متغير عالمي
            displayrentals(allrentals); // عرض جميع الطلبات افتراضيًا
        })
        .catch(error => console.error("Error fetching rentals:", error));
}

// عرض الطلبات في الجدول
function displayrentals(rentals) {
    const tableBody = document.getElementById("rentalsTableBody");
    tableBody.innerHTML = ""; // تفريغ الجدول

    rentals.forEach(rentals => {
        const row = document.createElement("tr");

        // إضافة فئة (class) للحالة لتغيير اللون
        let statusClass = "";
        if (rentals.status === "Completed") statusClass = "status-active";
        else if (rentals.status === "Pending") statusClass = "status-pending";
        else if (rentals.status === "In Progress") statusClass = "status-in-progress";

        row.innerHTML = `
            <td>${rentals.user_id}</td>
            <td>${rentals.vehicle_id}</td>
            <td>${rentals.start_date}</td>
            <td>${rentals.end_date}</td>
            <td class="${statusClass}">${rentals.status}</td>
            <td>${rentals.price || "N/A"}</td>
        `;

        tableBody.appendChild(row);
    });
}

//get all users

document.getElementById("customers-menu-item").addEventListener("click", function () {
    fetchCustomers(); 
});

function fetchCustomers() {
    fetch("http://localhost:4000/api/Users/getUsers") 
        .then(response => response.json())
        .then(customers => {
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
                     <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching customers:", error));
}
let allcustomers = []; // تخزين جميع الطلبات

document.addEventListener("DOMContentLoaded", function () {
    fetchCustomers(); // جلب الطلبات عند تحميل الصفحة

    // إضافة مستمع للأزرار
    document.querySelectorAll(".button_cust").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".button_cust").forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            const role = this.textContent.trim();

            const selectedRole = this.getAttribute("data-role");

            if (selectedRole === "all") {
                displayCustomers(allcustomers);
            } else {
                const filtered = allcustomers.filter(user => user.role.toLowerCase() === selectedRole);
                displayCustomers(filtered);
            }
        });
    });
});

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
