/*document.addEventListener("DOMContentLoaded", async () => {
    const userForm = document.getElementById("signupForm");

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
            const response = await fetch("http://localhost:5000/api/users/adduser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, email, password, username, address, country, wilaya, city, zipcode, phone, birthdate, role })
            });

            if (!response.ok) throw new Error("Failed to add user");

            userForm.reset();
        } catch (error) {
            console.error("Error adding user:", error.message);
        }
    });

});
*/

document.addEventListener("DOMContentLoaded", async () => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        // No token found, redirect to login
        window.location.href = "login.html";
        return;
    }

    try {
        // Send token to the backend for verification
        const response = await fetch("http://localhost:5000/api/email/verify-token?token=" + token);
        const data = await response.json();

        if (response.ok) {
            // Token is valid, extract email
            const email = data.email;
            console.log("User Email:", email);

            // Store email in localStorage (optional)
            localStorage.setItem("userEmail", email);

            // Use email in signup form if needed
            document.getElementById("email").innerText = `Email: ${email}`;
        } else {
            // Token invalid/expired, redirect to login
            throw new Error(data.error || "Invalid token");
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        window.location.href = "login.html"; // Redirect to login if token is invalid
    }
});
