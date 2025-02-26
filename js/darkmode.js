var root = document.documentElement;

dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    dark = e.matches
});

//if (dark) {toggleDark()} else {toggleLight()}
function toggleDark(){
    root.style.setProperty('--bg', '#0E1621');
    root.style.setProperty('--dark-bg', '#f0eded');
    root.style.setProperty('--container', '#242F3D');
    root.style.setProperty('--txt-black', 'white');
    root.style.setProperty('--txt-white', 'black');
    root.style.setProperty('--text', '#d3d0d0');
    root.style.setProperty('--bg-darker', '#1F2936');
    root.style.setProperty('--border', 'rgba(129, 129, 129, 0.247)');
}

function toggleLight(){
    try{
        document.getElementById("navLogo").style.filter = "invert(0)"
        document.getElementById("navLogoFoot").style.filter = "invert(0)"
    }catch(error){}
    root.style.setProperty('--bg', '#f0eded');
    root.style.setProperty('--dark-bg', '#1a1a1a');
    root.style.setProperty('--container', 'white');
    root.style.setProperty('--txt-black', 'black');
    root.style.setProperty('--txt-white', 'white');
    root.style.setProperty('--text', '#333');
    root.style.setProperty('--bg-darker', '#d3d0d0');
}

