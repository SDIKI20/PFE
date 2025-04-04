const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
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

let allOrders = []; // تخزين جميع الطلبات

document.addEventListener("DOMContentLoaded", function () {
    fetchOrders(); // جلب الطلبات عند تحميل الصفحة

    // إضافة مستمع للأزرار
    document.querySelectorAll(".button_ord").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".button_ord").forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const status = this.textContent; // الحصول على نص الزر (الحالة المطلوبة)
            filterOrders(status);
        });
    });
});

// جلب جميع الطلبات من السيرفر
function fetchOrders() {
    fetch("http://localhost:4000/api/getOrders")
        .then(response => response.json())
        .then(orders => { 
            allOrders = orders; // حفظ جميع الطلبات في متغير عالمي
            displayOrders(allOrders); // عرض جميع الطلبات افتراضيًا
        })
        .catch(error => console.error("Error fetching orders:", error));
}

// عرض الطلبات في الجدول
function displayOrders(orders) {
    const tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = ""; // تفريغ الجدول

    orders.forEach(order => {
        const row = document.createElement("tr");

        // إضافة فئة (class) للحالة لتغيير اللون
        let statusClass = "";
        if (order.status === "Completed") statusClass = "status-active";
        else if (order.status === "Pending") statusClass = "status-pending";
        else if (order.status === "In Progress") statusClass = "status-in-progress";

        row.innerHTML = `
            <td>${order.client_id}</td>
            <td>${order.vehicle_id}</td>
            <td>${order.start_date}</td>
            <td>${order.end_date}</td>
            <td class="${statusClass}">${order.status}</td>
            <td>${order.price || "N/A"}</td>
        `;

        tableBody.appendChild(row);
    });
}

// فلترة الطلبات حسب الحالة المختارة
function filterOrders(status) {
    if (status === "AllOrders") {
        displayOrders(allOrders); // عرض جميع الطلبات
    } else {
        const filteredOrders = allOrders.filter(order => order.status === status);
        displayOrders(filteredOrders);
    }
}


//get all users

document.getElementById("customers-menu-item").addEventListener("click", function () {
    fetchCustomers(); 
});

function fetchCustomers() {
    fetch("http://localhost:4000/api/getUsers") 
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
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching customers:", error));
}

