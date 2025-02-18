document.querySelectorAll('.selectImage').forEach(img=>{
    img.addEventListener('click',function(e){
        src = e.target.getAttribute('src')
        document.getElementById('prodImage').setAttribute('src',src)
    })
})

