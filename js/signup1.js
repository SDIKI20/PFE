const userForm = document.getElementById('signupForm')
document.getElementById("Fname").value = "Oudai"
document.getElementById("Lname").value = "Oulhadj"
document.getElementById("addr").value = "110 Log"
document.getElementById("country").value = "Algeria"
document.getElementById("state").value = "Ghardaia"
document.getElementById("city").value = "Ghardaia"
document.getElementById("zcode").value = "47000"
document.getElementById("birthdate").value = "2002-04-29"
document.getElementById("phone-number-input").value = "0553728440"
document.getElementById("username").value = "odaydid002"
document.getElementById("password").value = "123"
document.getElementById("rePassword").value = "123"
document.getElementById("agreeTerms").checked = true

var input = document.querySelector("#phone-number-input");
var iti = window.intlTelInput(input, {
  initialCountry: "dz",
  separateDialCode: true,
});

input.addEventListener("countrychange", function () {
  var countryCode = iti.getSelectedCountryData().dialCode;
});

document.querySelector('.pictChange').addEventListener('click',function(){
  document.getElementById('image').click();
})

var file

document.getElementById("image").addEventListener('change', function() {
    file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("pictChange").setAttribute('src',e.target.result);
    };
    reader.readAsDataURL(file);
});

async function uploadImage(file, category) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`http://localhost:5000/api/upload/${category}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("pictChange").setAttribute("src", result.src);
            alert("Image uploaded successfully:", result.src);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("File upload failed.");
    }
}

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    uploadImage(file, "users");
})

/*

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/email/verify-token?token=" + token);
        const data = await response.json();

        if (response.ok) {
            const email = data.email;
            localStorage.setItem("userEmail", email);
            document.getElementById("email").value = email;

            // Add User Event
            userForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const fname = document.getElementById("Fname").value;
                const lname = document.getElementById("Lname").value;
                const address = document.getElementById("addr").value;
                const country = document.getElementById("country").value;
                const wilaya = document.getElementById("state").value;
                const city = document.getElementById("city").value;
                const zipcode = document.getElementById("zcode").value;
                const birthdate = document.getElementById("birthdate").value;
                const phone = document.getElementById("phone-number-input").value;
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;

                try {
                    const response = await fetch("http://localhost:5000/api/users/adduser", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fname, lname, email, password, username, address, country, wilaya, city, zipcode, phone, birthdate })
                    });

                    if (!response.ok) throw new Error("Failed to add user");

                    userForm.reset();
                } catch (error) {
                    console.error("Error adding user:", error.message);
                }
            });
        } else {
            throw new Error(data.error || "Invalid token");
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        window.location.href = "login.html";
    }
});
*/