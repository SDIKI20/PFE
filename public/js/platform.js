document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          const section = this.getAttribute("data-section");

          fetch(`/${section}`)
              .then(response => response.text())
              .then(html => {
                  document.getElementById("platContent").innerHTML = html;
              });
      });
  });
});

document.querySelectorAll('.plat-nav-element').forEach(el=>{
  el.addEventListener("click", ()=>{
    document.querySelectorAll('.plat-nav-element').forEach(ell=>{
      ell.classList.remove('plat-nav-selected')
    })
    el.classList.add('plat-nav-selected')
  })
})

