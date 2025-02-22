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
