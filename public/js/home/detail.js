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