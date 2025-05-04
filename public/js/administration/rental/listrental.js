const getStats = async (limit, offset) => {
    try {
        openLoader()
        let u = new URL(`${window.location.origin}/api/orders/counts`);

        const response = await fetch(u);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { 
            total,
            pending,
            active,
            completed,
            canceled

        } = await response.json();

        closeLoader()

        return { 
            total,
            pending,
            active,
            completed,
            canceled
         };
    } catch (error) {
        closeLoader()
        console.error("Failed to fetch Rentals:", error);
        pushNotif("e", "Something went wrong!");
        return null;
    }
};

const statTot = document.getElementById('statTot')
const statCld = document.getElementById('statCld')
const statAtv = document.getElementById('statAtv')
const statPdg = document.getElementById('statPdg')
const statCcd = document.getElementById('statCcd')
const rntPgsCc = document.getElementById('rntPgsCc')
const rntPgsC = document.getElementById('rntPgsC')
const rntPgsA = document.getElementById('rntPgsA')
const rntPgsP = document.getElementById('rntPgsP')

const updateStats = async() => {
    try {
        getStats().then(data => {
            total = data.total
            pending = data.pending
            active = data.active
            completed = data.completed
            canceled = data.canceled

            console.log(data)

            animateNumber('statTot', parseInt(statTot.innerText), parseInt(total), 1000);
            animateNumber('statCld', parseInt(statCld.innerText), parseInt(completed), 1000);
            animateNumber('statAtv', parseInt(statAtv.innerText), parseInt(active), 1000);
            animateNumber('statPdg', parseInt(statPdg.innerText), parseInt(pending), 1000);
            animateNumber('statCcd', parseInt(statCcd.innerText), parseInt(canceled), 1000);

            rntPgsC.style.width = `${ completed * 100 / total}%`
            rntPgsA.style.width = `${ active * 100 / total}%`
            rntPgsP.style.width = `${ pending * 100 / total}%`
            rntPgsCc.style.width = `${ canceled * 100 / total}%`

        })
    }catch(error){
        console.error(error)
    }
}

const getData = async (limit, offset) => {
    try {

        let u = new URL(`${window.location.origin}/api/orders/getOrders`);
        let params = u.searchParams;

        params.set("limit", limit);
        params.set("offset", offset);
        params.set("order", "created_at");
        params.set("dire", "DESC");
        params.set("status", "")

        u.search = params.toString();

        const response = await fetch(u);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { 
            orders, 
            total,
            pending,
            active,
            completed,
            canceled

         } = await response.json();
        return { 
            orders, 
            total,
            pending,
            active,
            completed,
            canceled

         };
    } catch (error) {
        console.error("Failed to fetch Rentals:", error);
        pushNotif("e", "Something went wrong!");
        return null;
    }
};

const ordersLoader = document.getElementById('ordersLoader')
const ordersTableBody = document.getElementById('rtBod')
const ordersLimit = document.getElementById('ordersLimit')
const ordersOffset = document.getElementById('ordersOffset')
const ordersCurrentPage = document.getElementById('ordersCurrentPage')

const refrechRentals = async (limit = parseInt(document.getElementById('ordersLimit').value), offset = parseInt(document.getElementById('ordersOffset').value)) => {
    try {
        ordersLoader.style.opacity = "1";
        Array.from(ordersTableBody.children).forEach(child => child.remove());

        getData(limit, offset).then(data => {
            ordersLoader.style.opacity = "0";
            if (data && data.orders) {
                const { orders, total } = data;
    
                orders.forEach(order => {
                    const tRow = document.createElement("div");
                    tRow.classList.add("rt-row", "rt-row-el");
                    let diffMs = new Date(new Date(order.end_date) - new Date(order.start_date))
                    console.log(order.start_date)

                    if (order.rental_type === "d") {
                        period = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                      } else if (order.rental_type === "h") {
                        period = Math.floor(diffMs / (1000 * 60 * 60))
                      }
                    tRow.innerHTML = `
                        <p>${order.id}</p>
                        <div class="flex-row center-start gap-lrg">
                            <div class="table-user-profile"><img src="${order.image}" alt="Profile"></div>
                            <div class="flex-col">
                                <p>${order.fname} ${order.lname}</p>
                                <span class="username">@${order.username}</span>
                            </div>
                        </div>
                        <div class="flex-row center-start gap-lrg">
                            <div class="table-user-profile"><img src="${order.logo}" alt="Vehicle"></div>
                            <p>${order.brand_name} ${order.model} ${order.fab_year}</p>
                        </div>
                        <p>${formatDate(order.created_at)}</p>
                        <p>${formatDate(order.start_date)}</p>
                        <p>${period} ${order.rental_type == "d"?"Days":"Hours"}</p>
                        <p>${formatMoney(order.total_price + order.fees + order.insurance, 2)} <span class="currence">DZD</span></p>
                        <p class="rt-status rt-${order.status}">${capitalizeFirstChar(order.status)}</p>
                    `
                    ordersTableBody.appendChild(tRow);
                });
    
                gsap.set(".rt-row-el", { x: -100, opacity: 0 });
                gsap.to(".rt-row-el", { x: 0, stagger: 0.1, opacity: 1 });
    
                const totalPages = Math.ceil(total / limit);
                const currentPage = Math.floor(offset / limit) + 1;
    
                let options = "";
                for (let i = 1; i <= totalPages; i++) {
                    options += `<option value="${i}" ${i === currentPage ? 'selected' : ''}>${i}</option>`;
                }
    
                document.getElementById('rtPagination').innerHTML = `
                    <div class="flex-row center-start gap-lrg">
                        <p class="para-sml">Page: </p>
                        <select class="select-reg" id="ordersCurrentPage">
                            ${options}
                        </select>
                        <p class="para-sml">Show per page: </p>
                        <input class="select-reg" type="number" min="0" max="50" value="${limit}" id="ordersLimit" style="width: 4em; padding-right: 0; height: 2.5em; text-align: center;">
                        <p class="para-sml">Offset: </p>
                        <input class="select-reg" type="number" value="${offset}" id="ordersOffset" style="width: 4em; padding-right: 0; height: 2.5em; text-align: center;">
                    </div>
                    <div class="flex-row center-start gap-lrg" id="orderTableFoot">
                        <p class="para-sml">${offset + 1}-${Math.min(offset + limit, total)} of ${total} Orders</p>
                        <div class="flex-row center-start gap-lrg">
                            <button class="bt bt-hover bt-pagin" id="oPrevB">&lt;</button>
                            <button class="bt bt-hover bt-pagin" id="oNextB">&gt;</button>
                        </div>
                    </div>
                `;

                document.getElementById('ordersLimit').addEventListener('change', ()=> {refrechRentals()})
                document.getElementById('ordersOffset').addEventListener('change', ()=> {refrechRentals()})
    
                const newOrdersCurrentPage = document.getElementById('ordersCurrentPage');
    
                newOrdersCurrentPage.addEventListener('change', () => {
                    const selectedPage = parseInt(newOrdersCurrentPage.value);
                    const newOffset = (selectedPage - 1) * limit;
                    ordersOffset.value = newOffset; 
                    refrechRentals(limit, newOffset);
                });
    
                document.getElementById('oPrevB').addEventListener('click', () => {
                    const prevPage = parseInt(newOrdersCurrentPage.value) - 1;
                    if (prevPage >= 1) {
                        const newOffset = (prevPage - 1) * limit;
                        ordersOffset.value = newOffset;
                        refrechRentals(limit, newOffset);
                    }
                });
    
                document.getElementById('oNextB').addEventListener('click', () => {
                    const nextPage = parseInt(newOrdersCurrentPage.value) + 1;
                    if (nextPage <= totalPages) {
                        const newOffset = (nextPage - 1) * limit;
                        ordersOffset.value = newOffset;
                        refrechRentals(limit, newOffset);
                    }
                });
            }
        })
        .catch(error => {
            ordersLoader.style.opacity = "0";
            pushNotif("e", "Something went wrong!");
            console.error(error);
        });
    } catch (error) {
        console.error(error)
    }
}

const refrechContent = async () => {
    updateStats()
    refrechRentals()
}

const downBut = document.getElementById('oDownload')

downBut.addEventListener('click', ()=>{
    try {
        openLoader()
        getData(999999999, 0).then(data => {
            if (!data || !data.orders || data.orders.length === 0) return;
            const headers = [
                "Order ID",
                "Client",
                "Vehicle",
                "Created at",
                "Start at",
                "Period",
                "Total price (dzd)",
                "Status"
            ];
        
            const csvRows = [
                headers.join(",")
            ];

            data.orders.forEach(order => {

                let diffMs = new Date(new Date(order.end_date) - new Date(order.start_date))

                if (order.rental_type === "d") {
                    period = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                } else if (order.rental_type === "h") {
                    period = Math.floor(diffMs / (1000 * 60 * 60))
                }

                const row = [
                    order.id,
                    `${order.fname} ${order.lname}`,
                    `${order.brand_name} ${order.model} ${order.fab_year}`,
                    formatDate(order.created_at),
                    formatDate(order.start_date),
                    `${period} ${order.rental_type == "d"?"Days":"Hours"}`,
                    order.total_price,
                    order.status
                ];
                csvRows.push(row.map(val => `"${val}"`).join(",")); // Escape values in quotes
            });

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            closeLoader()
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `rentals_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .finally(()=>{closeLoader()})
    } catch (error) {
        closeLoader()
        pushNotif("e", "Something went wrong!")
        console.error(error)
    }
})

document.addEventListener('DOMContentLoaded', refrechContent)