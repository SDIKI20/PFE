let dtrtoday = new Date();

// Get the date 30 days ago
let pastDate = new Date();
dtrtoday.setDate(dtrtoday.getDate() + 10);

// Format date to YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d M",
    defaultDate: [formatDate(pastDate), formatDate(dtrtoday)]
});

gsap.set(".title", { y: 0, opacity: 1 });

gsap.from(".title", {
    y: -200,
    duration: 0.5,
    opacity: 0,
    stagger: 0.1
});
gsap.set(".options label", {
     y: 0,
     opacity: 1 
});

gsap.from(".options label", {
    y: -200,
    duration: 1,
    opacity: 0,
    stagger: 0.1
});

gsap.set(".pop-car-container", { y: 0, opacity: 1});

gsap.from(".pop-car-container", {
    y: 100,
    stagger: 0.2,
    opacity: 0,
    delay: 0.5
});

gsap.set(".clc-car-container", { y: 0, opacity: 1});

gsap.from(".clc-car-container", {
    y: 100,
    stagger: 0.2,
    opacity: 0,
    scrollTrigger: {
        scrub: 1,
        start: "center center",
        scroller: "#homeDoc"
    }
});

gsap.set(".review-container", { scale: 1, opacity: 1});

gsap.from(".review-container", {
    scale: 0,
    stagger: 0.5,
    opacity: 0,
    delay: 1,
    scrollTrigger: {
        scrub: 1,
        start: "bottom top",
        scroller: "#homeDoc"
    }
});

const content = document.querySelector(".reviews-container");
let distance = content.scrollWidth /2;

gsap.to(".review-container", {
    x: -distance,
    duration: 15,
    ease: "linear",
    repeat: -1,
    onRepeat: function() {
    gsap.set(".review-container", { x: 0 }); 
    }
});