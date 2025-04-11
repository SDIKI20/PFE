document.addEventListener("DOMContentLoaded", function () {
    fetchVehicles();
});

document.getElementById("vehicles-menu-item").addEventListener("click", function () {
    fetchVehicles(); 
});

function fetchVehicles() {
    openLoader()
    fetch("http://localhost:4000/api/vehicles/all")
        .then(response => response.json())
        .then(vehicles => {
            closeLoader()
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
        .catch(error =>{
            pushNotif("e",`Error fetching vehicles:${error}`)
            closeLoader()
        });
}


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