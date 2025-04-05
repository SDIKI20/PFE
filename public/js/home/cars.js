let rangeMin = 100;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");

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

gsap.set(".plat-car-container", {x: 0, opacity: 1, scale: 1})

gsap.from(".plat-car-container", {
    x: 100,
    scale: 0.8,
    stagger: 0.2,
    opacity: 0,
    scrollTrigger: {
        scrub: 1,
        start: "top bottom",
        scroller: ".plat-cars-container"
    }
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