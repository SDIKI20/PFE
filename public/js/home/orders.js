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