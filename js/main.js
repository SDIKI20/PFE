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
