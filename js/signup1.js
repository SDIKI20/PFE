document.addEventListener("DOMContentLoaded", async () => {
    const userList = document.getElementById("userList");
    const userForm = document.getElementById("signupForm");
  
    /* Fetch Users
    async function fetchUsers() {
        const response = await fetch("http://localhost:5000/api/users");
        const users = await response.json();
    }*/
  
    // Add User
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fname = document.getElementById("Fname").value;
        const lname = document.getElementById("Lname").value;
        const email = "oulhadjoday@gmail.com";
        const address = document.getElementById("addr").value;
        const country = document.getElementById("country").value;
        const wilaya = document.getElementById("state").value;
        const city = document.getElementById("city").value;
        const zipcode = document.getElementById("zcode").value;
        const birthdate = document.getElementById("birthdate").value;
        const phone = document.getElementById("phone-number-input").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = "client"
  
        await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fname, lname, email, password, username, address, country, wilaya, city, zipcode, phone, birthdate, role })
        });
  
        userForm.reset();
        //fetchUsers();
    });
  
    //fetchUsers();
  });
  