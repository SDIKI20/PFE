

const loadingBar = document.createElement('div')
loadingBar.id = "loading"
loadingBar.classList.add("loading", "flex-row", "flex-center")
loadingBar.innerHTML = `<span class="loader"></span>`
document.body.appendChild(loadingBar)

function openLoader(){
    loadingBar.style.display = "flex"
    setTimeout(() => {
        loadingBar.style.opacity = "1"
    }, 100);
}

function closeLoader(){
    loadingBar.style.opacity = "0"
    setTimeout(() => {
        loadingBar.style.display = "none"
    }, 300);
}

function fakeLoading(t){
    openLoader()
    setTimeout(() => {
        closeLoader()
    }, t*1000);
}


document.addEventListener("DOMContentLoaded", function () {
    openLoader()
    window.addEventListener("load", function () {
        closeLoader()
    });
});

try{
    document.getElementById("goTop").addEventListener("click", () =>{
        window.scrollTo(0, 0);
    })
}catch(error){}

const notificationContainer = document.createElement('div')
notificationContainer.id = "notifContainer"
notificationContainer.classList.add("notifications-container", "flex-col")
document.body.appendChild(notificationContainer)

function pushNotif(type, message){
    const notif = document.createElement("div")
    notif.classList.add("notification-container", "flex-row")
    notifIcon = ""
    switch (type){
        case "w":
            notif.classList.add("notif-warning")
            notifIcon = "fa-circle-xmark"
        break;
        case "e":
            notif.classList.add("notif-error")
            notifIcon = "fa-triangle-exclamation"
        break;
        case "s":
            notif.classList.add("notif-success")
            notifIcon = "fa-circle-check"
            break;
        case "i":
            notif.classList.add("notif-info")
            notifIcon = "fa-circle-exclamation"
        break;
    }
    notif.innerHTML = `
        <i class="fa-solid ${notifIcon} notif-type"></i>
        <p class="notif-msg">${message}</p>
    `
    closeBut = document.createElement('i')
    closeBut.classList.add("fa-solid", "fa-xmark", "notif-close", "bt-hover")
    closeBut.addEventListener('click', ()=>{
        notif.style.opacity = "0"
        setTimeout(() => {
            notif.parentElement.removeChild(notif)
        }, 500);
    })
    notif.appendChild(closeBut)
    try{
        document.getElementById("notifContainer").appendChild(notif)
        setTimeout(() => {
            notif.style.opacity = "1"
            notif.style.transform = "translateY(0)"
        }, 100);
        setTimeout(() => {
            notif.style.opacity = "0"
            setTimeout(() => {
                try{notif.parentElement.removeChild(notif)}catch(error){}
            }, 500);
        }, 15000);
    }catch(error){}
}

function validateEmail(email) {
    return !!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
}

/*if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude
            lon = position.coords.longitude
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.address) {
                        try{
                            document.getElementById('userIp').innerText = data.address.state
                        }catch(error){}
                    } else {}
                })
                .catch(error => console.error("Error fetching city:", error));
            },
            (error) => console.error("Error getting location:", error)
    );
} else {
    console.error("Geolocation not supported.");
}*/

document.querySelectorAll('.dtlocal').forEach(inp=>{
    inp.addEventListener('click', ()=>{
        inp.showPicker();
    })
})

document.querySelectorAll(".prevable").forEach(img=>{
    img.addEventListener('click', ()=>{
        imageZoom = img.cloneNode(true)
        imagePrev = document.createElement('div')
        imagePrev.classList.add("preview-image", "flex-col", "flex-center")
        closeBut = document.createElement('i')
        closeBut.classList.add("fa-solid","fa-xmark","bt-hover")
        imagePrev.addEventListener('click', ()=>{
            try{
                document.body.removeChild(imagePrev)
            }catch(error){}
        })
        closeBut.addEventListener('click', ()=>{
            try{
                document.body.removeChild(closeBut.parentElement)
            }catch(error){}
        })
        imagePrev.appendChild(closeBut)
        imagePrev.appendChild(imageZoom)
        document.body.appendChild(imagePrev)
    })
})

const confirm = (isDanger, title, description) => {
    return new Promise((resolve) => {
        const container = document.createElement("div");
        container.classList.add("overtop-conf", "flex-row", "flex-center");
    
        const iconElement = document.createElement("i");
        if (isDanger) {
            iconElement.classList.add("fa-solid", "fa-triangle-exclamation", "icon-danger");
        } else {
            iconElement.classList.add("fa-solid", "fa-circle-info", "icon-confirm");
        }

        const confButton = document.createElement('button')
        confButton.classList.add("desactivate", isDanger?"dBut":"ndBut", "bt-hover")
        confButton.innerText = "Confirm"

        const cancButton = document.createElement('button')
        cancButton.classList.add("cancel", "bt-hover")
        cancButton.innerText = "Cancel"
        
        confButton.addEventListener("click", () => {
            try{
                document.body.removeChild(container)
            }catch(error){}
            resolve(true);
        });
    
        cancButton.addEventListener("click", () => {
            try{
                document.body.removeChild(container)
            }catch(error){}
            resolve(false);
        });

        const card = document.createElement("div");
        card.classList.add("card");

        const header = document.createElement("div");
        header.classList.add("header");

        const image = document.createElement("div");
        image.classList.add("image", isDanger ? "red-trans" : "green-trans");
        image.appendChild(iconElement);

        const content = document.createElement("div");
        content.classList.add("content");

        const titleElement = document.createElement("span");
        titleElement.classList.add("title");
        titleElement.innerText = title;

        const messageElement = document.createElement("p");
        messageElement.classList.add("message");
        messageElement.innerText = description;

        const actions = document.createElement("div");
        actions.classList.add("actions");
        actions.appendChild(confButton);
        actions.appendChild(cancButton);

        content.appendChild(titleElement);
        content.appendChild(messageElement);
        header.appendChild(image);
        header.appendChild(content);
        header.appendChild(actions);
        card.appendChild(header);
        container.appendChild(card);
        document.body.appendChild(container)
    });
};

/*
confirm(false, "Confirm Action", "Are you sure you want to proceed?").then((result) => {
    console.log(result);
});*/


function formatNumber(num) {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

try {
    document.querySelectorAll('.animated-heart').forEach(fb=>{
        fb.addEventListener('click', async (e)=>{
            if(!fb.parentElement.children[0].checked){
                v = parseInt(fb.id.substring(1, fb.id.indexOf('u')));
                u = parseInt(fb.id.substring(fb.id.indexOf('u') + 1));
                openLoader()
                try{
                    const response = await fetch(`${window.location.origin}/api/users/add/favorite`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ u, v }),
                    });
                    const data = await response.json();
                    pushNotif("i", data.message);
                    fb.parentElement.children[0].disabled = true
                    closeLoader()
                }catch(error){
                    pushNotif("e", "Somthing went wrong!");
                    closeLoader()
                }
            }else{
            }
        })
    })
} catch (error) {}
/*
pushNotif("e", "Error Message Notification")
pushNotif("i", "Information Message Notification")
pushNotif("w", "Warning Message Notification")
pushNotif("s", "Success Message Notification")
*/