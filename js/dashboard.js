const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
  var sections = document.querySelectorAll('.content-section');
  var menuItems = document.querySelectorAll('.dashboard-menu ul li a');

  function hideAllSections() {
      sections.forEach(function(section) {
          section.style.display = 'none';
      });
  }

  function removeActiveClass() {
      menuItems.forEach(function(item) {
          item.classList.remove('active');
      });
  }

  menuItems.forEach(function(item) {
      item.addEventListener('click', function(event) {
          event.preventDefault();
          hideAllSections();
          removeActiveClass();
          item.classList.add('active');
          var targetId = item.parentElement.id.replace('-menu-item', '-content');
          var targetSection = document.getElementById(targetId);
          if (targetSection) {
              targetSection.style.display = 'block';
          }
      });
  });

  // Show the dashboard content by default
  hideAllSections();
  document.getElementById('dash-content').style.display = 'block';
  document.querySelector('#dashboard-menu-item a').classList.add('active');
});
