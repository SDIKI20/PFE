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
                    <td>${vehicle.color}</td>
                    <td>${vehicle.fuel}</td>
                    <td>${vehicle.price}<span class="currence">DZD</span></td>
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

       
          
            fetch(`http://localhost:4000/api/vehicles/delete/${vehicleId}`, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        pushNotif("i", data.message)
                        row.remove();
                    } else {
                        pushNotif("e",`Error deleting vehicles:${error}`)
                        closeLoader()                    }
                })
                .catch(error => {
                    pushNotif("e",`Error deleting vehicles:${error}`)
                    closeLoader()
                });
        }
    }
);