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
                        <button class="delete-btn">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching vehicles:", error));
}
document.addEventListener("DOMContentLoaded", function () {
    fetchVehicles()});