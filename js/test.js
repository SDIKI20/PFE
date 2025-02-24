document.addEventListener("DOMContentLoaded", async () => {
  const userList = document.getElementById("userList");
  const userForm = document.getElementById("userForm");

  // Fetch Users
  async function fetchUsers() {
      const response = await fetch("http://localhost:5000/api/users");
      const users = await response.json();
      userList.innerHTML = users.map(user => `<li>${user.name} - ${user.email}</li>`).join("");
  }

  // Add User
  userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;

      await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email })
      });

      userForm.reset();
      fetchUsers();
  });

  fetchUsers();
});
