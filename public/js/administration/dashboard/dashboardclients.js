const wilayaData = [
    { name: "Adrar", value: 12 },
    { name: "Chlef", value: 95 },
    { name: "Laghouat", value: 11 },
    { name: "Oum El Bouaghi", value: 80 },
    { name: "Batna", value: 70 },
    { name: "Béjaïa", value: 90 },
    { name: "Biskra", value: 60 },
    { name: "Béchar", value: 15 },
    { name: "Blida", value: 13 },
    { name: "Bouira", value: 40 },
    { name: "Tamanrasset", value: 75 },
    { name: "Tébessa", value: 10 },
    { name: "Tlemcen", value: 88 },
    { name: "Tiaret", value: 67 },
    { name: "Tizi Ouzou", value: 98 },
    { name: "Algiers", value: 10 },
    { name: "Djelfa", value: 55 },
    { name: "Jijel", value: 73 },
    { name: "Sétif", value: 92 },
    { name: "Saïda", value: 58 },
    { name: "Skikda", value: 60 },
    { name: "Sidi Bel Abbès", value: 30 },
    { name: "Annaba", value: 64 },
    { name: "Guelma", value: 50 },
    { name: "Constantine", value: 47 },
    { name: "Médéa", value: 38 },
    { name: "Mostaganem", value: 42 },
    { name: "M'Sila", value: 33 },
    { name: "Mascara", value: 41 },
    { name: "Ouargla", value: 49 },
    { name: "Oran", value: 10 },
    { name: "El Bayadh", value: 26 },
    { name: "Illizi", value: 22 },
    { name: "Bordj Bou Arréridj", value: 44 },
    { name: "Boumerdès", value: 36 },
    { name: "El Tarf", value: 39 },
    { name: "Tindouf", value: 31 },
    { name: "Tissemsilt", value: 28 },
    { name: "El Oued", value: 34 },
    { name: "Khenchela", value: 29 },
    { name: "Souk Ahras", value: 25 },
    { name: "Tipaza", value: 32 },
    { name: "Mila", value: 21 },
    { name: "Aïn Defla", value: 19 },
    { name: "Naâma", value: 17 },
    { name: "Aïn Témouchent", value: 20 },
    { name: "Ghardaïa", value: 18 },
    { name: "Relizane", value: 16 },
    { name: "Timimoun", value: 14 },
    { name: "Bordj Badji Mokhtar", value: 13 },
    { name: "Ouled Djellal", value: 11 },
    { name: "Béni Abbès", value: 10 },
    { name: "In Salah", value: 9 },
    { name: "In Guezzam", value: 8 },
    { name: "Touggourt", value: 12 },
    { name: "Djanet", value: 15 },
    { name: "El MGhair", value: 7 },
    { name: "El Meniaa", value: 6 }
  ];
  
  fetch('../json/algeria2.geojson')
    .then(response => response.json())
    .then(geojsonData => {
  
      const containerBgColor = getComputedStyle(document.documentElement).getPropertyValue('--container').trim();
  
      const reversedColorScale = 'Blues_r';
  
      var data = [{
        type: 'choroplethmap',
        geojson: geojsonData,
        locations: wilayaData.map(item => item.name),
        z: wilayaData.map(item => item.value),
        colorscale: reversedColorScale,
        colorbar: { title: 'Values' },
        featureidkey: "properties.name"
      }];
      var layout = {
        map: {
          style: containerBgColor === "white" ? "carto-positron" : "carto-darkmatter",
          center: { lon: 3, lat: 28 },
          zoom: 4,
          showland: false,
          showwater: false
        },
        margin: { t: 0, b: 0, l: 0, r: 0 },
        displayModeBar: false,
        showlegend: false,
        xaxis: { showgrid: false, zeroline: false },
        yaxis: { showgrid: false, zeroline: false },
  
        paper_bgcolor: containerBgColor,
        plot_bgcolor: containerBgColor
      };
  
      Plotly.newPlot('algeriaMap', data, layout);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
  
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