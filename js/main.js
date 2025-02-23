const loadingBar = document.createElement('div')
loadingBar.id = "loading"
loadingBar.classList.add("loading", "flex-row", "flex-center")
loadingBar.innerHTML = `<span class="loader"></span>`
document.body.appendChild(loadingBar)

function openLoader(){
    loadingBar.style.zIndex = "90"
    setTimeout(() => {
        loadingBar.style.opacity = "1"
    }, 100);
}

function closeLoader(){
    loadingBar.style.opacity = "0"
    setTimeout(() => {
        loadingBar.style.zIndex = "-1"
    }, 100);
}

document.querySelectorAll('.selectImage').forEach(img=>{
    img.addEventListener('click',function(e){
        src = e.target.getAttribute('src')
        document.getElementById('prodImage').setAttribute('src',src)
    })
})

try{
    document.getElementById("goTop").addEventListener("click", () =>{
        window.scrollTo(0, 0);
    })
}catch(error){}
