const container = document.getElementById("loginContainer");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signup = document.getElementById("dhaa");
const login = document.getElementById("dhai");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

signup.addEventListener("click", () => {
  container.classList.add("active");
  document.querySelector('.sign-up').style.transform = "translateX(0)"
});

login.addEventListener("click", () => {
  document.querySelector('.sign-up').style.transform = "translateX(100%)"
  container.classList.remove("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});



let captchaText = "";
function generateCaptcha() {
    const canvas = document.getElementById("captchaCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    captchaText = Math.random().toString(36).substring(2, 8);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#D9D9D9";
    ctx.fillText(captchaText, 20, 35);
}

function validateCaptcha() {
    const userInput = document.getElementById("captchaInput").value;
    if (userInput === captchaText) {
        document.getElementById("result").innerText = "CAPTCHA correct!";
    } else {
        document.getElementById("result").innerText = "Wrong CAPTCHA. Try again!";
        generateCaptcha();
    }
}

generateCaptcha();

document.getElementById("signUpForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from reloading the page
  const userInput = document.getElementById("captchaInput").value;
  if (userInput === captchaText) {
    const email = document.getElementById("email").value;
    const messageElement = document.getElementById("message");
    try {
        const response = await fetch("http://localhost:5000/api/email/send-login-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
            messageElement.style.color = "green";
            messageElement.textContent = "Verification link sent! Check your email.";
        } else {
            throw new Error(data.error || "Failed to send email");
        }
    } catch (error) {
        messageElement.style.color = "red";
        messageElement.textContent = error.message;
    }
  } else {
      document.getElementById("result").innerText = "Wrong CAPTCHA. Try again!";
      generateCaptcha();
  }
});
