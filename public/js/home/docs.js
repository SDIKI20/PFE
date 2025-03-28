const verfButton = document.getElementById("verfBut")
const counter =  document.getElementById('countdown')

verfButton.addEventListener('click', ()=>{
  let timeLeft = 30;
  verfButton.disabled = true
  verfButton.style.opacity = "0.2"
  counter.textContent = "30"
  counter.style.display = "flex";
  sendCode()
  const countdown = setInterval(() => {
    counter.textContent = timeLeft;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(countdown);
      counter.classList.remove("counter-active")
      verfButton.style.opacity = "1"
      verfButton.disabled = false
      counter.textContent = "";
      counter.style.display = "none";
    }
  }, 1000);
})

async function sendCode() {
  openLoader();

  const phone = document.getElementById("userPhoneNum").value.trim(); 
  if (!phone) {
      closeLoader();
      pushNotif("e", "Please enter a valid phone number!");
      return;
  }

  try {
      const response = await fetch("http://localhost:4000/api/sms/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      pushNotif("i", data.message);

      if (response.ok) {
          closeLoader();
          createOtpForm();
      } else {
          closeLoader();
          pushNotif("e", "Something went wrong! Try again later.");
      }
  } catch (error) {
      closeLoader();
      pushNotif("e", "Network error! Please check your connection.");
  }
}

function createOtpForm() {
  const verfC = document.createElement("div");
  verfC.classList.add("overtop-conf", "flex-row", "flex-center");
  verfC.innerHTML = `
      <div class="otp-Form">
        <span class="mainHeading">Enter OTP</span>
        <p class="otpSubheading">We have sent a verification code to your mobile number</p>
        <div class="inputContainer">
          ${[1, 2, 3, 4, 5, 6]
            .map((num) => `<input maxlength="1" type="text" class="otp-input" id="otp-input${num}">`)
            .join("")}
        </div>
        <button class="verifyButton bt-hover" id="verifyButton" type="submit">Verify</button>
        <button class="exitBtn">×</button>
        <p class="resendNote">Didn't receive the code? <button class="resendBtn" id="resendBtn">Resend Code</button></p>
      </div>
  `;

  document.body.appendChild(verfC);

  document.querySelectorAll(".otp-input").forEach((oi, index, inputs) => {
      oi.addEventListener("input", (event) => {
          let value = event.target.value;
          if (!/^\d$/.test(value)) {
              event.target.value = "";
              return;
          }

          if (index < inputs.length - 1) {
              inputs[index + 1].focus();
          }
      });

      oi.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" && !oi.value && index > 0) {
              inputs[index - 1].focus();
          }
      });
  });

  document.querySelector(".exitBtn").addEventListener("click", () => {
      document.body.removeChild(verfC);
  });

  document.querySelector(".resendBtn").addEventListener("click", () => {
      document.body.removeChild(verfC);
  });

  document.getElementById("verifyButton").addEventListener("click", verifyCode);
}

const phoneVerIcn = document.getElementById("phoneVerIcn")
const phoneVerfStepP = document.getElementById("phoneVerfStepP")
const verfBut = document.getElementById("verfBut")
const phoneStepCercle = document.getElementById("phoneStepCercle")
const phoneStepCercleI = document.getElementById("phoneStepCercleI")

async function verifyCode() {
  openLoader();
  try{
    const phone = document.getElementById("userPhoneNum").value.trim();
    if (!phone) {
        closeLoader();
        pushNotif("e", "Invalid phone number!");
        return;
    }
  
    let code = "";
    document.querySelectorAll(".otp-input").forEach((oi) => {
        code += oi.value;
    });

    const id = document.getElementById("userId").innerText
  
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        closeLoader();
        pushNotif("e", "Please enter a valid 6-digit OTP.");
        return;
    }
     
    try {
      const response = await fetch("http://localhost:4000/api/sms/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code, id }),
      });

      if (response.ok) {
          closeLoader();
          pushNotif("s", "Verification successful!");
          phoneVerIcn.classList.remove("fa-circle-exclamation", "notVerfE")
          phoneVerIcn.classList.add("fa-circle-check", "VerfE")
          phoneVerIcn.setAttribute('title', "Verified")
          phoneVerfStepP.innerText = "Your phone number has been confirmed."
          verfBut.style.display = "none"
          phoneStepCercle.classList.add("step-completed")
          phoneStepCercle.classList.remove("step-canceled")
          phoneStepCercleI.classList.add('fa-check')
          phoneStepCercleI.classList.remove('fa-xmark')
          document.querySelector('.exitBtn').click()
      } else {
          closeLoader();
          pushNotif("e", "Invalid OTP. Try again.");
      }
    } catch (error) {
        closeLoader();
        pushNotif("e", "Network error! Please check your connection.");
    }
  }catch(error){
    closeLoader()
    pushNotif("e", "Somthing went wrong! try again later")
  }
}

document.getElementById('uploadDocsClose').addEventListener('click', ()=>{
  try{
    document.querySelector('.overtop-conf').style.display = "none"
  }catch(error){}
})

document.querySelector('.custum-file-upload').addEventListener('click', ()=>{
  document.getElementById('upDocsContainer').style.display = "flex"
})

var upfilefront
document.getElementById("upFront").addEventListener('change', function() {
    openLoader()
    upfilefront = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("idFront").setAttribute('src',e.target.result);
        closeLoader()
    };
    reader.readAsDataURL(upfilefront);
});

var upfileback
document.getElementById("upback").addEventListener('change', function() {
    openLoader()
    upfileback = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("idBack").setAttribute('src',e.target.result);
        closeLoader()
    };
    reader.readAsDataURL(upfileback);
});