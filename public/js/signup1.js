const userForm = document.getElementById('signupForm')

var input = document.querySelector("#phone-number-input");
var iti = window.intlTelInput(input, {
  initialCountry: "dz",
  separateDialCode: true,
});

document.querySelector("#phone-country-code").value = iti.getSelectedCountryData().dialCode;

input.addEventListener("countrychange", function () {
  var countryCode = iti.getSelectedCountryData().dialCode;
  document.querySelector("#phone-country-code").value = countryCode
});

document.querySelector('.pictChange').addEventListener('click',function(){
  document.getElementById('image').click();
})

var file

document.getElementById("image").addEventListener('change', function() {
    openLoader()
    file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("pictChange").setAttribute('src',e.target.result);
        closeLoader()
    };
    reader.readAsDataURL(file);
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        window.location.href = "login";
        return;
    }

    try {
        openLoader()
        const response = await fetch("http://localhost:4000/api/email/verify-token?token=" + token);
        const data = await response.json();

        if (response.ok) {
            const email = data.email;
            localStorage.setItem("userEmail", email);
            document.getElementById("email").value = email;
            document.getElementById("emailo").value = email;
            closeLoader()
        } else {
            closeLoader()
            throw new Error(data.error || "Invalid token");
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        window.location.href = "login";
        closeLoader()
    }
});
