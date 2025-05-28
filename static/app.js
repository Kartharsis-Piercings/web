document.addEventListener('DOMContentLoaded', () => {
    const carouselSlide = document.querySelector('.carousel-slide');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 1; // Comenzamos en el primer slide real
    const totalSlides = slides.length;
    const slideWidth = slides[0].clientWidth;
    let autoSlideInterval;
    let isTransitioning = false;

    // Clonar slides para efecto infinito
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);
    carouselSlide.insertBefore(lastClone, carouselSlide.firstChild);
    carouselSlide.appendChild(firstClone);

    // Configuración inicial
    carouselSlide.style.transform = `translateX(-${slideWidth}px)`;

    function moveToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        carouselSlide.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        carouselSlide.style.transform = `translateX(-${index * slideWidth}px)`;
        currentIndex = index;
    }

    function handleTransitionEnd() {
        isTransitioning = false;
        
        // Manejar bucle infinito sin saltos visibles
        if (currentIndex === 0) {
            carouselSlide.style.transition = 'none';
            carouselSlide.style.transform = `translateX(-${totalSlides * slideWidth}px)`;
            currentIndex = totalSlides;
        }
        else if (currentIndex === totalSlides + 1) {
            carouselSlide.style.transition = 'none';
            carouselSlide.style.transform = `translateX(-${slideWidth}px)`;
            currentIndex = 1;
        }
    }

    function nextSlide() {
        moveToSlide(currentIndex + 1);
    }

    function prevSlide() {
        moveToSlide(currentIndex - 1);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        clearInterval(autoSlideInterval);
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        clearInterval(autoSlideInterval);
        prevSlide();
        startAutoSlide();
    });

    carouselSlide.addEventListener('transitionend', handleTransitionEnd);

    // Auto deslizamiento
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (!isTransitioning) nextSlide();
        }, 5000);
    }

    startAutoSlide();

    // Pausar al interactuar
    const container = carouselSlide.parentElement;
    container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    container.addEventListener('mouseleave', startAutoSlide);

    // Ajustar en redimensionamiento
    window.addEventListener('resize', () => {
        slideWidth = slides[0].clientWidth;
        carouselSlide.style.transition = 'none';
        carouselSlide.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    });
});