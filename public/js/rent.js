const stepMax = document.querySelectorAll('.rent-step-sect').length;
const stepPrev = document.getElementById('stepPrev');
const stepNext = document.getElementById('stepNext');

const updateSteps = (current, target, direction) => {
  const currentEl = document.getElementById(`step${current}`);
  const targetEl = document.getElementById(`step${target}`);

  targetEl.style.display = "flex";

  gsap.set(currentEl, { opacity: 1 });
  gsap.to(currentEl, { opacity: 0, stagger: 0.1 });

  gsap.set(targetEl, { x: direction * 100, opacity: 0 });
  gsap.to(targetEl, { x: 0, opacity: 1, stagger: 0.1 });

  currentEl.style.display = "none";

  document.querySelector(`input[value="${current}"]`).checked = false;
  document.querySelector(`input[value="${target}"]`).checked = true;
  document.getElementById(`rentStep${current}`).checked = false;
  document.getElementById(`rentStep${target}`).checked = true;

  stepNext.disabled = target >= stepMax;
  stepPrev.disabled = target <= 1;
};

const nextStep = () => {
  const current = parseInt(document.querySelector('input[name="stepsect"]:checked').value);
  const target = current + 1;
  if (target <= stepMax) updateSteps(current, target, 1);
};

const prevStep = () => {
  const current = parseInt(document.querySelector('input[name="stepsect"]:checked').value);
  const target = current - 1;
  if (target > 0) updateSteps(current, target, -1);
};

const pickupInput = document.getElementById('pickupInput');
const pickupText = document.getElementById('pickupText');
const pickupIcon = document.getElementById('pickupIcon');

const returnInput = document.getElementById('returnInput');
const returnText = document.getElementById('returnText');
const returnIcon = document.getElementById('returnIcon');

const rentalType = pickupInput.dataset.rentalType;

let pickupDateString = '';
let returnDateString = '';

let now = new Date();
let fullPickupDate = new Date(now);

if (rentalType === 'h') {
  // Round to next hour
  fullPickupDate.setMinutes(0, 0, 0);
  const fullReturnDate = new Date(fullPickupDate.getTime() + 60 * 60 * 1000);

  pickupInput.value = formatTime(fullPickupDate);
  returnInput.value = formatTime(fullReturnDate);

  pickupInput.min = formatTime(now);
  returnInput.min = formatTime(fullPickupDate);

  pickupText.textContent = formatDateTime(fullPickupDate);
  returnText.textContent = formatDateTime(fullReturnDate);

  pickupDateString = formatToSqlDateTime(fullPickupDate);
  returnDateString = formatToSqlDateTime(fullReturnDate);

} else {
  const pickupDate = new Date(now.setHours(0, 0, 0, 0));
  const returnDate = new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000);

  pickupInput.value = formatDate(pickupDate);
  returnInput.value = formatDate(returnDate);

  pickupInput.min = formatDate(pickupDate);
  returnInput.min = formatDate(pickupDate);

  pickupText.textContent = formatDateTime(pickupDate);
  returnText.textContent = formatDateTime(returnDate);

  pickupDateString = formatToSqlDateTime(pickupDate);
  returnDateString = formatToSqlDateTime(returnDate);
}

[pickupText, pickupIcon].forEach(el =>
  el.addEventListener('click', () => pickupInput.showPicker?.() || pickupInput.focus())
);
[returnText, returnIcon].forEach(el =>
  el.addEventListener('click', () => returnInput.showPicker?.() || returnInput.focus())
);

pickupInput.addEventListener('change', () => {
  const val = pickupInput.value;

  if (rentalType === 'h') {
    const [hour, minute] = val.split(':');
    fullPickupDate.setHours(hour, minute, 0, 0);
  } else {
    fullPickupDate = new Date(val);
  }

  pickupText.textContent = formatDateTime(fullPickupDate);
  pickupDateString = formatToSqlDateTime(fullPickupDate);

  const returnDate = getFullDate(returnInput.value);
  if (returnDate <= fullPickupDate) {
    const adjusted = new Date(fullPickupDate.getTime() + (rentalType === 'h' ? 3600000 : 86400000));
    returnInput.value = rentalType === 'h' ? formatTime(adjusted) : formatDate(adjusted);
    returnText.textContent = formatDateTime(adjusted);
    returnDateString = formatToSqlDateTime(adjusted);
  }

  returnInput.min = rentalType === 'h' ? formatTime(fullPickupDate) : formatDate(fullPickupDate);
});

returnInput.addEventListener('change', () => {
  const returnDate = getFullDate(returnInput.value);
  returnText.textContent = formatDateTime(returnDate);
  returnDateString = formatToSqlDateTime(returnDate);
});

function formatDateTime(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  return `${date.toDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

function formatToSqlDateTime(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getFullDate(val) {
  if (rentalType === 'h') {
    const [hour, minute] = val.split(':');
    const base = new Date(fullPickupDate);
    base.setHours(hour, minute, 0, 0);
    return base;
  } else {
    return new Date(val);
  }
}

const vid = document.getElementById('vid')

const avLoader = document.getElementById('avLoader')

const avai = document.querySelector(".avai")
const avDot = document.querySelector(".av-dot")
const avTxt = document.querySelector(".av-txt")

const checkBut = document.getElementById('checkCarAv')

const checkCarAv = async (vid, start_date, end_date) => {
  try {
    avLoader.style.visibility = "visible"
    let u = new URL(`${window.location.origin}/api/vehicles/check/available`);
    let params = u.searchParams;

    params.set("vid", vid);
    params.set("start_date", start_date);
    params.set("end_date", end_date);

    u.search = params.toString();

    const response = await fetch(u);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const { 
      availability
    } = await response.json();
  
    avLoader.style.visibility = "hidden"

    return { 
      availability
    };

} catch (error) {
    console.error("Failed to fetch Vehicle:", error);
    pushNotif("e", "Something went wrong!");
    avLoader.style.visibility = "hidden"
    return null;
}
}

const updateStat = async ()=>{
  checkCarAv(vid.value, pickupDateString, returnDateString).then(data=>{
    if(data){
      avTest = data.availability || false
      avai.classList.remove('avd', 'nvd')
      avDot.classList.remove('avd', 'nvd')
      avTxt.classList.remove('avd', 'nvd')
      avai.classList.add(avTest?'avd':"nvd")
      avDot.classList.add(avTest?'avd':"nvd")
      avTxt.classList.add(avTest?'avd':"nvd")
      avTxt.textContent = avTest?'Available':"Not Available"
    }
  })
}

stepNext.addEventListener('click', nextStep);
stepPrev.addEventListener('click', prevStep);

checkBut.addEventListener('click', updateStat)

updateStat()