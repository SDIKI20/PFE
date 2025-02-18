const container = document.getElementById("loginContainer");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

let captchaText = "";

        function generateCaptcha() {
            const canvas = document.getElementById("captchaCanvas");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            captchaText = Math.random().toString(36).substring(2, 8); // Generate a random 6-character string
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(captchaText, 20, 35);
        }

        function validateCaptcha() {
            const userInput = document.getElementById("captchaInput").value;
            if (userInput === captchaText) {
                document.getElementById("result").innerText = "CAPTCHA correct!";
            } else {
                document.getElementById("result").innerText = "Wrong CAPTCHA. Try again!";
                generateCaptcha(); // Refresh CAPTCHA
            }
        }

        // Generate CAPTCHA on page load
        generateCaptcha();