
document.addEventListener("DOMContentLoaded", function () {
    // HERO SLIDER
    const slides = document.querySelectorAll(".slide");
    if (slides.length > 0) {
        let index = 0;
        function showSlide(i) {
            index = (i + slides.length) % slides.length;
            slides.forEach((s, idx) =>
                s.classList.toggle("is-active", idx === index)
            );
        }
        const nextBtn = document.getElementById("next");
        const prevBtn = document.getElementById("prev");
        if (nextBtn) nextBtn.onclick = () => showSlide(index + 1);
        if (prevBtn) prevBtn.onclick = () => showSlide(index - 1);
        setInterval(() => showSlide(index + 1), 6000);
    }

    // PROJECT SWIPER
    // Using standard Carousel with Loop (123123)
    if (typeof Swiper !== 'undefined') {
        var swiper = new Swiper(".mySwiper", {
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            spaceBetween: 30, // Space between cards
            loop: true, // Infinite loop
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            // Note: Coverflow removed to ensure standard "123123" loop first, 
            // but can be re-enabled if user insisted on "3D".
            // The user said "Movement has a problem... I want it to loop".
            // A standard centered loop is safer for correctness.
        });
    }
});
