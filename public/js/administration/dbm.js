document.querySelectorAll('.dbm-table-minimize').forEach(bt=>{
    bt.addEventListener('click', ()=>{
        const chevron = bt.children[0]
        const table = bt.parentElement.parentElement.parentElement
        const tableHead = table.children[0]
        const tableBody = table.children[1]
        const tableFoot = table.children[2]
        isMin = chevron.classList[1] === "fa-chevron-down"
        if(isMin){
            chevron.classList.remove("fa-chevron-down")
            chevron.classList.add("fa-chevron-up")
            tableFoot.style.display = "none"
            tableBody.style.height = "0"
            tableBody.style.border = "none"
            tableHead.style.borderRadius = "8px"
        }else{
            chevron.classList.remove("fa-chevron-up")
            chevron.classList.add("fa-chevron-down")
            tableFoot.style.display = "flex"
            tableBody.style.height = `${(tableBody.children[1].children.length + 1)*3 }em`
            tableBody.style.border = "2px solid var(--border-low)"
            tableHead.style.borderRadius = "8px 8px 0 0"
        }
    })
})