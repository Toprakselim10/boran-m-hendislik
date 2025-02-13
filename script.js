// Sayfa yüklendiğinde en üste çık ve header'ı ayarla
window.onload = function() {
    window.scrollTo(0, 0);
    const header = document.querySelector('header');
    if (header) {
        header.style.background = '#ffffff';
    }
}

// Sayfa yenilendiğinde en üste çık
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    // Header scroll efekti
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.9)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.5)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Hero Slider
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && slides.length) {
        let currentSlide = 0;
        let slideInterval;
        const slideDelay = 6000; // 6 saniye

        // Nokta navigasyonunu oluştur
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSlideShow();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            slides[currentSlide].classList.add('active');
            updateDots();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1 >= slides.length ? 0 : currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1);
        }

        function startSlideShow() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            slideInterval = setInterval(nextSlide, slideDelay);
        }

        function resetSlideShow() {
            clearInterval(slideInterval);
            startSlideShow();
        }

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlideShow();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideShow();
            });
        }

        // Klavye kontrolü
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetSlideShow();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetSlideShow();
            }
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetSlideShow();
            }
        }

        // Başlangıçta slider'ı başlat
        startSlideShow();
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Proje kartları için tıklama işlevselliği
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Diğer kartların active sınıfını kaldır
            projectCards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Tıklanan kartın active sınıfını toggle et
            this.classList.toggle('active');
        });
    });

    // Sayfa herhangi bir yerine tıklandığında detayları kapat
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card')) {
            projectCards.forEach(card => card.classList.remove('active'));
        }
    });

    // Tamamlanan Projeler için JavaScript
    const projectItems = document.querySelectorAll('.project-item');
    const projectPreview = document.getElementById('projectPreview');
    const previewImage = document.getElementById('previewImage');
    const previewInfo = document.querySelector('.preview-info');
    const closeBtn = document.querySelector('.close-btn');

    // Proje görüntüleme fonksiyonu
    function showProject(projectItem) {
        const imagePath = projectItem.getAttribute('data-image');
        const projectInfo = projectItem.querySelector('.project-info').cloneNode(true);
        
        previewImage.src = imagePath;
        previewInfo.innerHTML = '';
        previewInfo.appendChild(projectInfo);
        projectInfo.style.display = 'block';
        
        projectPreview.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Proje önizlemeyi kapatma fonksiyonu
    function closePreview() {
        projectPreview.classList.remove('active');
        document.body.style.overflow = '';
        previewImage.src = '';
        previewInfo.innerHTML = '';
    }

    // Event Listeners
    projectItems.forEach(item => {
        const viewButton = item.querySelector('.view-project');
        viewButton.addEventListener('click', () => showProject(item));
    });

    closeBtn.addEventListener('click', closePreview);

    // Dışarı tıklandığında kapatma
    projectPreview.addEventListener('click', (e) => {
        if (e.target === projectPreview) {
            closePreview();
        }
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectPreview.classList.contains('active')) {
            closePreview();
        }
    });

    // Mobil Menü İşlevselliği
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
});

// Scroll offset hesaplama
function getHeaderOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight + 20 : 0; // 20px extra boşluk
}

// Smooth scroll fonksiyonu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.getAttribute('href') === '#top') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - getHeaderOffset();
                window.scrollTo({
                    top: offsetTop,
            behavior: 'smooth'
        });
            }
        }
    });
});