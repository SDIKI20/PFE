document.addEventListener("DOMContentLoaded", async () => {
    const userForm = document.getElementById("signupForm");

    // Function to Fetch Users (Uncomment if needed)
    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost:5000/api/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const users = await response.json();
            console.log(users); // You can display them in `userList`
        } catch (error) {
            console.error("Error fetching users:", error.message);
        }
    }

    // Add User Event
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fname = document.getElementById("Fname").value;
        const lname = document.getElementById("Lname").value;
        const email = "oulhadjoday@gmail.com"
        const address = document.getElementById("addr").value;
        const country = document.getElementById("country").value;
        const wilaya = document.getElementById("state").value;
        const city = document.getElementById("city").value;
        const zipcode = document.getElementById("zcode").value;
        const birthdate = document.getElementById("birthdate").value;
        const phone = document.getElementById("phone-number-input").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = "client";

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, email, password, username, address, country, wilaya, city, zipcode, phone, birthdate, role })
            });

            if (!response.ok) throw new Error("Failed to add user");

            userForm.reset();
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error adding user:", error.message);
        }
    });

    fetchUsers(); // Fetch users on page load
});
