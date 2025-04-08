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

try {
    document.getElementById('applyFilter').addEventListener('click', () => {
        let search = document.getElementById('filterSearch').value.trim();
        let rentalType = "";
        let availableOnly = document.getElementById('stch').checked ? '1' : "";
        let Pricem = document.getElementById("pricem").value.trim();
        let PriceM = document.getElementById("priceM").value.trim();
        let transm = "";
        let cap = "";
        let brands = [];
        let fuelTypes = [];
        let bodyStyles = [];

        // Capacity
        document.querySelectorAll('input[name="cap"]').forEach(radioButton => {
            if (radioButton.checked && radioButton.id !== "personeA") {
                cap = radioButton.id.substring(7);
            }
        });

        // Transmission
        document.querySelectorAll('input[name="transm"]').forEach(radioButton => {
            if (radioButton.checked && radioButton.id !== "transAny") {
                transm = radioButton.value;
            }
        });

        // Rental type
        document.querySelectorAll('input[name="rnt"]').forEach(radioButton => {
            if (radioButton.checked && radioButton.id !== "rentalA") {
                rentalType = radioButton.id === "rentalD" ? "d" : "h";
            }
        });

        // Body styles
        document.querySelectorAll('.filter-body-style').forEach(st => {
            if (st.checked) bodyStyles.push(st.id.substring(8));
        });

        // Fuel types
        document.querySelectorAll('.filter-fuel-type').forEach(st => {
            if (st.checked) fuelTypes.push(st.id.substring(8));
        });

        // Brands
        document.querySelectorAll('.filter-brand-inp').forEach(st => {
            if (st.checked) brands.push(st.id.substring(5));
        });

        // Build query string
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (rentalType) params.append("rtype", rentalType);
        if (availableOnly) params.append("availability", availableOnly);
        if (Pricem) params.append("pricem", Pricem);
        if (PriceM) params.append("priceM", PriceM);
        if (transm) params.append("trans", transm);
        if (cap) params.append("capacity", cap);
        if (brands.length) params.append("brand", brands.join(","));
        if (fuelTypes.length) params.append("fuel", fuelTypes.join(","));
        if (bodyStyles.length) params.append("body", bodyStyles.join(","));

        // params.append("limit", 15);
        // params.append("offset", 0);

        const finalUrl = `/cars?${params.toString()}`;

        window.location.href = finalUrl;
    });
} catch (error) {}

try {
    const searchInput = document.querySelectorAll('.filter-search-inp');
    searchInput.forEach(inp=>{
        inp.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                let search = inp.value.trim();
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                const finalUrl = `/cars?${params.toString()}`;
                window.location.href = finalUrl;
            }
        });
    })
} catch (error) {}