function generateCouponCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let coupon = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    coupon += characters[randomIndex];
  }
  return coupon;
}

const getData = async (limit, offset) => {
    try {

        let u = new URL(`${window.location.origin}/api/discounts/all`);
        let params = u.searchParams;

        params.set("limit", limit);
        params.set("offset", offset);
        params.set("order", "created_at");

        u.search = params.toString();

        const response = await fetch(u);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { 
            discounts, 
            total
         } = await response.json();
        return { 
            discounts, 
            total
         };
    } catch (error) {
        console.error("Failed to fetch Vehicles:", error);
        pushNotif("e", "Something went wrong!");
        return null;
    }
};

const refrechVehicles = async (limit = parseInt(document.getElementById('vehiclesLimit').value), offset = parseInt(document.getElementById('vehiclesOffset').value)) => {
    try {
        vehiclesLoader.style.opacity = "1";
        Array.from(vehiclesTableBody.children).forEach(child => child.remove());

        getData(limit, offset).then(data => {
            vehiclesLoader.style.opacity = "0";
            if (data && data.discounts) {
                const { discounts, total } = data;
                animateNumber('statTot', parseInt(statTot.innerText), parseInt(total), 1000);
                discounts.forEach(discount => {
                    const tRow = document.createElement("div");
                    const limits = `${discount.uses}/${discount.usage_limit}`
                    tRow.classList.add("rt-row-cd", "rt-row-el");
                    tRow.innerHTML = `
                        <p>${discount.id}</p>
                        <p>${discount.type}</p>
                        <p>${discount.name}</p>
                        <p>${formatFullDate(discount.expire_on)}</p>
                        <p class="coupon-stat ${discount.status=="active"?"dbm-active":"dbm-canceled"}">${capitalizeFirstChar(discount.status)}</p>
                        <div class="flex-row center-start gap-min">
                            <p>${discount.code==""?"_":discount.code}</p>
                            ${discount.code!=""?'<i class="fa-solid fa-copy bt-hover" title="Copy"></i>':''}
                        </div>
                        <p>${discount.discount}% OFF</p>
                        <p>${parseInt(discount.usage_limit)>0?limits:"_"}</p>
                        <p>${formatDate(discount.expire_on)}</p>
                        <div class="flex-row center-spacebet w100 pdv">
                            <i class="cid-${discount.id} ctype-${discount.type} fa-solid fa-pen-to-square edtbt bt-hover"></i>
                            <i class="cid-${discount.id} ctype-${discount.type} fa-solid fa-trash dltbt bt-hover"></i>
                        </div>
                    `
                    vehiclesTableBody.appendChild(tRow);
                });

                document.querySelectorAll('.dltbt').forEach(bt=>{
                    bt.addEventListener('click', ()=>{
                        const ctype = bt.classList[1].substring(6)
                        const cid = bt.classList[0].substring(4)
                        console.log(ctype, cid)
                        confirm(true, "Confirm Action", "Are you sure you want to delete discount?").then((result) => {
                            if(result){
                                if(ctype == "Discount"){
                                    deleteDiscount(cid).then(data=>{
                                        pushNotif('i', data.message)
                                        refrechVehicles()
                                    })
                                }
                                if(ctype == "Coupon"){
                                    deleteCoupon(cid).then(data=>{
                                        pushNotif('i', data.message)
                                        refrechVehicles()
                                    })
                                }
                            }
                        });
                    })
                })

                document.querySelectorAll('.fa-copy').forEach(bt=>{
                    bt.addEventListener('click', ()=>{
                        const code = bt.parentElement.children[0].textContent
                        navigator.clipboard.writeText(code)
                        .then(() => {
                            pushNotif("s", "Code copied to clipboard!");
                        })
                        .catch(err => {
                            pushNotif("e",`Failed to copy: ${err}`);
                        });
                    })
                })

                document.querySelectorAll('.edtbt').forEach(bt=>{
                    bt.addEventListener('click', async ()=>{
                        const ctype = bt.classList[1].substring(5)
                        const cid = bt.classList[0].substring(3)
                    })
                })
    
                gsap.set(".rt-row-el", { x: 100, opacity: 0, rotate:-3 });
                gsap.to(".rt-row-el", { x: 0, stagger: 0.1, opacity: 1,rotate:0 });
    
                const totalPages = Math.ceil(total / limit);
                const currentPage = Math.floor(offset / limit) + 1;
    
                let options = "";
                for (let i = 1; i <= totalPages; i++) {
                    options += `<option value="${i}" ${i === currentPage ? 'selected' : ''}>${i}</option>`;
                }
    
                document.getElementById('rtPagination').innerHTML = `
                    <div class="flex-row center-start gap-lrg">
                        <p class="para-sml">Page: </p>
                        <select class="select-reg" id="vehiclesCurrentPage">
                            ${options}
                        </select>
                        <p class="para-sml">Show per page: </p>
                        <input class="select-reg" type="number" min="0" max="50" value="${limit}" id="vehiclesLimit" style="width: 4em; padding-right: 0; height: 2.5em; text-align: center;">
                        <p class="para-sml">Offset: </p>
                        <input class="select-reg" type="number" value="${offset}" id="vehiclesOffset" style="width: 4em; padding-right: 0; height: 2.5em; text-align: center;">
                    </div>
                    <div class="flex-row center-start gap-lrg" id="vehicleTableFoot">
                        <p class="para-sml">${offset + 1}-${Math.min(offset + limit, total)} of ${total} vehicles</p>
                        <div class="flex-row center-start gap-lrg">
                            <button class="bt bt-hover bt-pagin" id="oPrevB">&lt;</button>
                            <button class="bt bt-hover bt-pagin" id="oNextB">&gt;</button>
                        </div>
                    </div>
                `;

                document.getElementById('vehiclesLimit').addEventListener('change', ()=> {refrechVehicles()})
                document.getElementById('vehiclesOffset').addEventListener('change', ()=> {refrechVehicles()})
    
                const newVehiclesCurrentPage = document.getElementById('vehiclesCurrentPage');
    
                newVehiclesCurrentPage.addEventListener('change', () => {
                    const selectedPage = parseInt(newVehiclesCurrentPage.value);
                    const newOffset = (selectedPage - 1) * limit;
                    vehiclesOffset.value = newOffset; 
                    refrechVehicles(limit, newOffset);
                });
    
                document.getElementById('oPrevB').addEventListener('click', () => {
                    const prevPage = parseInt(newVehiclesCurrentPage.value) - 1;
                    if (prevPage >= 1) {
                        const newOffset = (prevPage - 1) * limit;
                        vehiclesOffset.value = newOffset;
                        refrechVehicles(limit, newOffset);
                    }
                });
    
                document.getElementById('oNextB').addEventListener('click', () => {
                    const nextPage = parseInt(newVehiclesCurrentPage.value) + 1;
                    if (nextPage <= totalPages) {
                        const newOffset = (nextPage - 1) * limit;
                        vehiclesOffset.value = newOffset;
                        refrechVehicles(limit, newOffset);
                    }
                });
            }
        })
        .catch(error => {
            vehiclesLoader.style.opacity = "0";
            pushNotif("e", "Something went wrong!");
            console.error(error);
        });
    } catch (error) {
        console.error(error)
    }
}

const deleteCoupon = async (cid) => {
    try {
        openLoader()
        let u = new URL(`${window.location.origin}/api/discounts/delete/coupon/${cid}`);

        const response = await fetch(u);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { 
            message
        } = await response.json();
        closeLoader()
        return { 
            message
        };
    } catch (error) {
        closeLoader()
        console.error("Failed to delete coupon:", error);
        pushNotif("e", "Something went wrong!");
        return null;
    }
}

const deleteDiscount = async (did) => {
    try {
        openLoader()
        let u = new URL(`${window.location.origin}/api/discounts/delete/discount/${did}`);

        const response = await fetch(u);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { 
            message
        } = await response.json();
        closeLoader()
        return { 
            message
        };
    } catch (error) {
        closeLoader()
        console.error("Failed to delete discount:", error);
        pushNotif("e", "Something went wrong!");
        return null;
    }
}

const vehiclesLoader = document.getElementById('vehiclesLoader')
const vehiclesTableBody = document.getElementById('rtBod')
const vehiclesLimit = document.getElementById('vehiclesLimit')
const vehiclesOffset = document.getElementById('vehiclesOffset')
const vehiclesCurrentPage = document.getElementById('vehiclesCurrentPage')
const statTot = document.getElementById('statTot')

document.addEventListener("DOMContentLoaded", ()=>{
    refrechVehicles()
})