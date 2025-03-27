

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
    if (!(userInput === captchaText)) {
      generateCaptcha();
    }
}

generateCaptcha();

document.getElementById("signUpForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from reloading the page
  const userInput = document.getElementById("captchaInput").value;
  if (userInput === captchaText) {
    generateCaptcha();
    const email = document.getElementById("email").value;
    if(!validateEmail(email)){pushNotif("e", "invalid email")}else
    try {
        openLoader()
        const response = await fetch("https://pfeserver-odaydid002s-projects.vercel.app/api/email/send-login-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
            pushNotif("i", "Verification link sent! Check your email.")
            closeLoader()
        } else {
            closeLoader()
            throw new Error(data.error || "Failed to send email");
        }
    } catch (error) {
        pushNotif("e", "Somthing went wrong! Try again later")
        closeLoader()
    }
  } else {
      pushNotif("e", "Wrong CAPTCHA. Try again!")
      generateCaptcha();
  }
});

const passwordInp = document.getElementById('logPass')
const emailInp = document.getElementById('logMail')
const logBut = document.getElementById('signinBut')

logBut.addEventListener("click", async () => {
  try {
      const response = await fetch("https://pfeserver-odaydid002s-projects.vercel.app/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInp.value, password: passwordInp.value }),
          credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
          alert("Login successful!");

      } else {
          alert(data.msg || "Login failed");
      }
  } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong! Try again later.");
  }
});

