document.querySelectorAll('li').forEach(li=>{
  li.addEventListener('click',()=>{
    document.querySelectorAll('li').forEach(l=>{
      l.classList.remove('selected')
    })
    
    li.classList.add('selected')
  })
})