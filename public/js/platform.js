let rangeMin = 100;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          const section = this.getAttribute("data-section");

          fetch(`/${section}`)
              .then(response => response.text())
              .then(html => {
                  document.getElementById("platContent").innerHTML = html;
              });
      });
  });
});


rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    if (maxRange - minRange < rangeMin) {     
      if (e.target.className === "min") {
        rangeInput[0].value = maxRange - rangeMin;        
      } else {
        rangeInput[1].value = minRange + rangeMin;        
      }
    } else {
      rangePrice[0].value = minRange;
      rangePrice[1].value = maxRange;
      range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
    }
  });
});

rangePrice.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = rangePrice[0].value;
    let maxPrice = rangePrice[1].value;
    if (maxPrice - minPrice >= rangeMin && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

const filterSec = document.getElementById('filterSec')

document.getElementById('filterBut4p').addEventListener('click', openFilter)
document.getElementById('platCloseFilter').addEventListener('click', closeFilter)

function openFilter(){
  filterSec.style.display = "flex"
  setTimeout(() => {
    filterSec.style.top = "50%"
  }, 100);
}

function closeFilter(){
    filterSec.style.top = "150%"
  setTimeout(() => {
    filterSec.style.display = "none"
  }, 100);
}

gsap.set(".plat-car-container", {y:0, opacity: 1});

gsap.from(".plat-car-container", {
    y: -100,
    duration: 1,
    opacity: 0,
    stagger: 0.1
});

document.querySelectorAll(".plat-car-image").forEach(carContainer=>{
  carContainer.addEventListener('click', ()=>{
    targetCar = carContainer.parentElement
    var carId = null
    carInfo = getCarInfo(carId)
    openCarDetail(carInfo)
  })
})

function getCarInfo(carId){
  var info = null
  return info
}

const carDetailSec = document.getElementById('carDetail')
const carsContainerSec = document.getElementById('carSecBody')

function openCarDetail(carInfo){
  carDetailSec.style.display = "flex"
  if(screen.width > 820){
    carsContainerSec.style.width = "50%"
    carDetailSec.style.width = "50%"
    carDetailSec.style.minWidth = "500px"
  }else{
    setTimeout(() => {
      carDetailSec.style.top = "50%"
    }, 100);
  }
}

function closeCarDetail(){
  if(screen.width > 820){
    carsContainerSec.style.width = "100%"
    carDetailSec.style.minWidth = "unset"
    carDetailSec.style.width = "0"
  }else{
    carDetailSec.style.top = "150%"
  }
  setTimeout(() => {
    /*Array.from(carDetailSec.children).forEach(ch=>{
      ch.parentElement.removeChild(ch)
    })*/
    carDetailSec.style.display = "none"
  }, 200);
}

document.getElementById('detailsClose').addEventListener('click', closeCarDetail)
document.getElementById('detailsClose4p').addEventListener('click', closeCarDetail)

document.querySelectorAll('.car-det-info-head label').forEach(label => {
  label.addEventListener('click', () => {
      let targetId = label.getAttribute('data-target');
      let contentRadio = document.getElementById(targetId);
      let navRadio = label.querySelector('input[type="radio"]');
      if (contentRadio && navRadio) {
          navRadio.checked = true;
          contentRadio.checked = true;
      }
  });
});
/*
mapboxgl.accessToken = 'pk.eyJ1Ijoib2RheWRpZDAwMiIsImEiOiJjbTdjZ3pzOGgwdW5oMmlzOGxubDF5d3ByIn0.zGe8aXHfdUvVGecjXwJ5Ow'; // Replace with your Mapbox token

const coords = [3.685660, 32.483643];

const map = new mapboxgl.Map({
    container: 'cordMap',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coords,
    zoom: 13
});

const customMarkerEl = document.createElement('div');
customMarkerEl.className = 'logo-map-mark';

new mapboxgl.Marker(customMarkerEl)
    .setLngLat(coords)
    .setPopup(new mapboxgl.Popup().setHTML('<h3>DZRentCar</h3><p>The car is available at this office..</p>'))
    .addTo(map);*/

const today = new Date();

formattedDateTime = today.getFullYear() + '-' +
String(today.getMonth() + 1).padStart(2, '0') + '-' +
String(today.getDate()).padStart(2, '0') + 'T' +
String(today.getHours()).padStart(2, '0') + ':' +
String(today.getMinutes()).padStart(2, '0');
document.getElementById("pickdate").value = formattedDateTime;

formattedDateTime = today.getFullYear() + '-' +
String(today.getMonth() + 1).padStart(2, '0') + '-' +
String(today.getDate() + 1).padStart(2, '0') + 'T' +
String(today.getHours()).padStart(2, '0') + ':' +
String(today.getMinutes()).padStart(2, '0');
document.getElementById("dropdate").value = formattedDateTime;

document.querySelectorAll('.plat-nav-element').forEach(el=>{
  el.addEventListener("click", ()=>{
    document.querySelectorAll('.plat-nav-element').forEach(ell=>{
      ell.classList.remove('plat-nav-selected')
    })
    el.classList.add('plat-nav-selected')
  })
})

let dtrtoday = new Date();

// Get the date 30 days ago
let pastDate = new Date();
pastDate.setDate(dtrtoday.getDate() - 30);

// Format date to YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Initialize Flatpickr with a custom display format
flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d", // Backend format (invisible)
    altInput: true, // Show alternative display
    altFormat: "d M", // Custom display format: "01 Fev - 03 Mar"
    defaultDate: [formatDate(pastDate), formatDate(dtrtoday)]
});


const rentsSelectAll = document.getElementById('rentsSelectAll')
rentsSelectAll.addEventListener('change', ()=>{
  document.querySelectorAll('.rentCheckB').forEach(cb=>{
    cb.checked = rentsSelectAll.checked
  })
})

document.querySelectorAll(".ordTf").forEach(el=>{
  el.addEventListener('click', ()=>{
    document.querySelector(".orders-type-f").style.setProperty('--after-transform', `translateY(-50%) translateX(calc((30em / 5.1)*${el.classList[1]}))`);
  })
})

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

