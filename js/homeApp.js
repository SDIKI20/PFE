gsap.set(".about-title span", { y: 0, opacity: 1 });
gsap.set(".cars-logo", { y: 0, opacity: 1 });
gsap.set(".cars-logo .car-logo", { y: 0, opacity: 1 });
gsap.set(".car-svg", { x: "0%" });
gsap.set("#wheel", { rotate: 0 });
gsap.set(".frame1", { x:-300, rotate: -20, y: -200, opacity: 1 });
gsap.set(".frame2", { x:-180, rotate: 10, y: -350, opacity: 1 });
gsap.set(".app-desc h1", { y: 0, opacity: 1 });
gsap.set(".app-desc p", { y: 0, opacity: 1 });
gsap.set(".app-but", { y: 0, opacity: 1 });
gsap.set(".type-image", { scale: 1, opacity: 1});
gsap.set(".type-image-s", { scale: 1, opacity: 1});
gsap.set(".feature-container", { scale: 1, y: 0, opacity: 1});
gsap.set(".features-desc", { scale: 1, y: 0, opacity: 1});

gsap.to(".about-title span", {
    y: -200,
    duration: 1,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.to(".cars-logo", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.to(".cars-logo .car-logo", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.to(".car-svg", {
    x: "100%",
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.to("#wheel", {
    rotate: 360,
    svgOrigin: "266 602",
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.from(".phone-frame", {
    rotate: 10,
    y: -50,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.from(".app-desc h1", {
    y: 100,
    opacity: 0,
    delay: 0.2,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.from(".app-desc p", {
    y: 100,
    opacity: 0,
    delay: 0.3,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.from(".app-but", {
    y: 50,
    opacity: 0,
    delay: 0.5,
    stagger: 0.1,
    scrollTrigger: {
        scrub: 2,
        start: "top top",
        trigger: "#aboutSection",
    }
});

gsap.from(".car-type", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#appSection",
    }
});

gsap.from(".cars-desc", {
    y: 50,
    opacity: 0,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#appSection",
    }
});

gsap.from(".type-image", {
    scale: 0.5,
    stagger: 0.1,
    opacity: 0,
    delay: 0.2,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#appSection",
    }
});

gsap.from(".type-image-s", {
    scale: 0.5,
    stagger: 0.2,
    delay: 0.3,
    opacity: 0,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#appSection",
    }
});

gsap.from(".feature-container", {
    scale: 1.5,
    y: 100,
    stagger: 0.5,
    opacity: 0,
    delay: 1,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#carsSection",
    }
});

gsap.from(".features-desc", {
    scale: 1.5,
    y: 100,
    stagger: 0.2,
    opacity: 0,
    delay: 0.3,
    scrollTrigger: {
        scrub: 2,
        start: "center center",
        trigger: "#carsSection",
    }
});




window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    window.scrollTo(document.body.clientHeight*4, document.body.clientHeight*4);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});
document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show"); 
            } else {
                entry.target.classList.remove("show"); 
            }
        });
    }, { threshold: 0.2 }); 

    document.querySelectorAll(".scroll-animation").forEach(el => observer.observe(el));
});
