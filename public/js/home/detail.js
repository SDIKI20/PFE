try {
    const pickupInput = document.getElementById('pickupInput');
    const pickupText = document.getElementById('pickupText');
    const pickupIcon = document.getElementById('pickupIcon');
    
    const returnInput = document.getElementById('returnInput');
    const returnText = document.getElementById('returnText');
    const returnIcon = document.getElementById('returnIcon');
    
    [pickupText, pickupIcon].forEach(el =>
      el.addEventListener('click', () => pickupInput.showPicker?.() || pickupInput.focus())
    );
    [returnText, returnIcon].forEach(el =>
      el.addEventListener('click', () => returnInput.showPicker?.() || returnInput.focus())
    );
    
    pickupInput.addEventListener('change', () => {
      pickupText.textContent = formatDateTime(pickupInput.value);
    });
    returnInput.addEventListener('change', () => {
      returnText.textContent = formatDateTime(returnInput.value);
    });
    
} catch (error) {}

function formatDateTime(val) {
    try {
        const date = new Date(val);
        if (isNaN(date)) return val;
        return date.toDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {}
}

function showBookInfo(){
    try {
        BIcontainer = document.querySelector('.car-det-rentprice')
        BIcontainer.style.display = "inline"
        document.getElementById('showContSec').style.display = "none"
        setTimeout(() => {
            BIcontainer.style.top = "50%"
        }, 100);
    } catch (error) {}
}

function hideBookInfo(){
    try {
        BIcontainer = document.querySelector('.car-det-rentprice')
        BIcontainer.style.top = "200%"
        document.getElementById('showContSec').style.display = "flex"
        setTimeout(() => {
            BIcontainer.style.display = "none"
        }, 100);
    } catch (error) {}
}


document.getElementById('showContSec').addEventListener('click', showBookInfo)
document.getElementById('detCloseBut').addEventListener('click', hideBookInfo)

const reportContainer = document.getElementById('reportContainer')
const reportBut = document.getElementById('reportBut')

const reportPrio = document.getElementById('repPrio')
const colorBox = document.getElementById("repColorBox")

const repColorBox = document.getElementById('repColorBox')
const prio = document.getElementById('repPrio')
const desc = document.getElementById('repDesc')
const type = document.getElementById('repType')

const uid = document.getElementById('uidInp')
const uidVal = uid.value == ""?null:parseInt(uid.value)
const vid = document.getElementById('vidInp')
const vidVal = vid.value == ""?null:parseInt(vid.value)

const openReporter = () => {
  reportContainer.style.visibility = 'visible'

  reportPrio.addEventListener('change', ()=> {
      const rv = reportPrio.value
      colorBox.style.backgroundColor = rv === "hight"?"rgb(211, 73, 73)":rv === "low"?"rgba(133, 133, 133, 0.41)":"rgb(231, 127, 62)"
  })

  gsap.set(".report-container", { opacity: 0, y:100 });
  gsap.to(".report-container", { stagger: 0.1, opacity: 1,y:0 });
  const newElement = reportBut.cloneNode(true);
  reportBut.parentNode.replaceChild(newElement, reportBut);
  newElement.addEventListener('click', ()=> {
      confirm(false, "Confirm Action", "Are you sure you want to send report?").then((result) => {
          if(result){
              submitReport(uidVal, vidVal, prio.value, type.value, desc.value).then(data=>{
                  pushNotif('i', data.message)
                  closeReporter()
              })
          }
      });
  })
}

const closeReporter = () => {
    gsap.to(".report-container", { stagger: 0.1, opacity: 0,y:-100 });
    setTimeout(() => {
      colorBox.style.backgroundColor = "rgb(211, 73, 73)"
      type.value = "Car"
      prio.value = "hight"
      desc.value = ""
      reportContainer.style.visibility = 'hidden'
    }, 200);
}

const submitReport = async (uid, vid, prio, type, desc) => {
  try {
      openLoader()
      const response = await fetch(`${window.location.origin}/api/feedback/report`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              uid: uid,
              vid: vid,
              prio: prio,
              type: type,
              desc: desc
          })
      });
      closeLoader()
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const { message } = await response.json();
      return { message };

  } catch (error) {
      closeLoader()
      console.error("Failed to submit report:", error);
      pushNotif("e", "Something went wrong!");
      return null;
  }
}

document.getElementById('reportClose').addEventListener('click', closeReporter)
document.getElementById('reportCancel').addEventListener('click', closeReporter)
document.getElementById('reportCar').addEventListener('click', openReporter)