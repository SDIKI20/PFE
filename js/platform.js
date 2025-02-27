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
  if(screen.width > 820){
    carsContainerSec.style.width = "40%"
    carDetailSec.style.width = "60%"
  }else{
    carDetailSec.style.display = "flex"
    setTimeout(() => {
      carDetailSec.style.top = "50%"
    }, 100);
  }
}