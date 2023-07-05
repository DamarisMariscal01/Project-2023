const carousel = document.querySelector('.carousel');
const carouselInner = carousel.querySelector('.carousel-inner');
const slides = carouselInner.querySelectorAll('.slide');
let currentIndex = 0;
const slideWidth = carousel.clientWidth;
const prevButton = carousel.querySelector('.prev-slide');
const nextButton = carousel.querySelector('.next-slide');

function goToSlide(index) {
  carouselInner.style.transform = `translateX(-${index * slideWidth}px)`;
}

function goToNextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  goToSlide(currentIndex);
}

function goToPrevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  goToSlide(currentIndex);
}

nextButton.addEventListener('click', goToNextSlide);
prevButton.addEventListener('click', goToPrevSlide);