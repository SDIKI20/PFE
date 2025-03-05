var root = document.documentElement;

dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    dark = e.matches
});

if (dark) {toggleDark()} else {toggleLight()}

function toggleDark(){
    try{
        document.querySelector('.docard-sign').style.filter = "invert(1)"
    }catch(error){}
    root.style.setProperty('--bg', '#121212');
    root.style.setProperty('--dark-bg', '#f0eded');
    root.style.setProperty('--bg-lower','#292929');
    root.style.setProperty('--container', '#1E1E1E');
    root.style.setProperty('--txt-black', 'white');
    root.style.setProperty('--txt-white', 'black');
    root.style.setProperty('--text-low', 'rgba(129, 129, 129, 0.3)');
    root.style.setProperty('--text', 'rgb(143, 143, 143)');
    root.style.setProperty('--bg-darker', '#0f0f0f');
    root.style.setProperty('--border', 'rgba(129, 129, 129, 0.247)');
}

function toggleLight(){
    try{
        document.querySelector('.docard-sign').style.filter = "invert(0)"
    }catch(error){}
    root.style.setProperty('--bg', '#f0eded');
    root.style.setProperty('--dark-bg', '#1a1a1a');
    root.style.setProperty('--bg-lower','#f7f7f7');
    root.style.setProperty('--container', 'white');
    root.style.setProperty('--txt-black', 'black');
    root.style.setProperty('--txt-white', 'white');
    root.style.setProperty('--text-low', '#3333334b');
    root.style.setProperty('--text', '#333');
    root.style.setProperty('--bg-darker', '#d3d0d0');
}

