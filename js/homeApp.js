/*document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".doc-section");
    let isAnimating = false; // Flag to track animation state

    // Disable default scrolling
    window.addEventListener("wheel", (e) => {
        e.preventDefault();
    }, { passive: false });

    // Handle wheel event for snapping
    window.addEventListener("wheel", (e) => {
        if (isAnimating) return; // Exit if animation is in progress

        const deltaY = e.deltaY;
        const currentSection = Array.from(sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        let targetSection;

        if (deltaY > 0) {
        // Scroll down
        targetSection = Math.min(currentSection + 1, sections.length - 1);
        } else if (deltaY < 0) {
        // Scroll up
        targetSection = Math.max(currentSection - 1, 0);
        }

        // Lock scrolling during animation
        isAnimating = true;

        // Animate to the target section
        gsap.to(window, {
        duration: 1,
        scrollTo: { y: sections[targetSection], autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
            // Unlock scrolling after animation completes
            isAnimating = false;
        },
        });
    });

    // Optional: Handle keyboard events (arrow keys)
    window.addEventListener("keydown", (e) => {
        if (isAnimating) return; // Exit if animation is in progress

        const currentSection = Array.from(sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        let targetSection;

        if (e.key === "ArrowDown") {
        // Scroll down
        targetSection = Math.min(currentSection + 1, sections.length - 1);
        } else if (e.key === "ArrowUp") {
        // Scroll up
        targetSection = Math.max(currentSection - 1, 0);
        }

        // Lock scrolling during animation
        isAnimating = true;

        // Animate to the target section
        gsap.to(window, {
        duration: 1,
        scrollTo: { y: sections[targetSection], autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
            // Unlock scrolling after animation completes
            isAnimating = false;
        },
        });
    });
});*/

gsap.from(".about-title", {
    y: -100,
    opacity: 0,
    duration: 1,
    scrollTrigger:{
        trigger:"#aboutSection",
        scroller: "body",
        markers: true,
        repeatRefresh: true
    }
})
    
var tl = gsap.timeline()

gsap.from(".cars-logo", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    scrollTrigger:{
        trigger:"#aboutSection",
        scroller: "body",
        markers: true,
        repeatRefresh: true
    }
})

gsap.from(".cars-logo .car-logo", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger:{
        trigger:"#aboutSection",
        scroller: "body"
    }
})