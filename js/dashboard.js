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

document.addEventListener("DOMContentLoaded", function () {
    fetchOrders(); 
});

function fetchOrders() {
    fetch("http://localhost:5000/api/getOrders") 
        .then(response => response.json())
        .then(orders => {
            const tableBody = document.getElementById("ordersTableBody");
            tableBody.innerHTML = "";

            orders.forEach(order => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${order.client_id}</td>
                    <td>${order.vehicle_id}</td>
                    <td>${order.start_date}</td>
                    <td>${order.end_date}</td>
                    <td>${order.status}</td>
                    <td>${order.price || "N/A"}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching orders:", error));
}
