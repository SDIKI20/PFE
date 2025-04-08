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

function startTour() {
  const driver = window.driver.js.driver;

  const tour = driver({
      showProgress: true,
      showButtons: true,
      steps: [
          {
              element: '#navHome',
              popover: {
                  title: 'Home',
                  description: 'Go to the homepage where you can find an overview.',
                  position: 'right'
              }
          },
          {
              element: '#navCars',
              popover: {
                  title: 'Cars',
                  description: 'Explore available cars for rent.',
                  position: 'right'
              }
          },
          {
              element: '#navOrders',
              popover: {
                  title: 'Orders',
                  description: 'Check your current and past rentals.',
                  position: 'right'
              }
          },
          {
              element: '#navFav',
              popover: {
                  title: 'Favorites',
                  description: 'View cars you marked as favorite.',
                  position: 'right'
              }
          },
          {
              element: '#navRencent',
              popover: {
                  title: 'Recent',
                  description: 'View your recent activities.',
                  position: 'right'
              }
          },
          {
              element: '#navDocs',
              popover: {
                  title: 'Documents',
                  description: 'Upload and manage your personal documents.',
                  position: 'right'
              }
          },
          {
              element: '#navHelp',
              popover: {
                  title: 'Help',
                  description: 'Need assistance? Visit our help section.',
                  position: 'right'
              }
          }
      ]
  });

  tour.drive(); // start the tour
}

startTour()