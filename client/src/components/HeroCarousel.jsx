import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SLIDES = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/festive/1920/1080',
    title: 'The Festive Collection',
    subtitle: 'Celebrate in Style',
    desc: 'Discover our premium range of handpicked ethnic wear.',
    btnText: 'Shop Now',
    link: '/?category=Sarees',
    align: 'left', // text alignment
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/kurti/1920/1080',
    title: 'Designer Kurtis',
    subtitle: 'Comfort Meets Elegance',
    desc: 'Perfect for daily wear and office wear.',
    btnText: 'Explore Kurtis',
    link: '/?category=Kurtis',
    align: 'right',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/wedding/1920/1080',
    title: 'Wedding Specials',
    subtitle: 'Be the Center of Attention',
    desc: 'Exclusive Lehengas and Gowns for the wedding season.',
    btnText: 'View Collection',
    link: '/?category=Lehengas',
    align: 'center',
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent(current === SLIDES.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? SLIDES.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] overflow-hidden bg-gray-900 mt-0">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className={`absolute inset-0 container-max px-6 flex flex-col justify-center ${
            slide.align === 'center' ? 'items-center text-center' : 
            slide.align === 'right' ? 'items-end text-right' : 
            'items-start text-left'
          }`}>
            <p className="text-brand-300 font-medium tracking-[0.2em] uppercase mb-4 animate-fade-in drop-shadow-md">
              {slide.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 animate-slide-up drop-shadow-lg leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg animate-slide-up animation-delay-100 drop-shadow-md">
              {slide.desc}
            </p>
            <Link
              to={slide.link}
              className="btn-primary bg-white text-gray-900 hover:bg-brand-50 hover:text-brand-700 px-8 py-4 text-lg animate-slide-up animation-delay-200"
            >
              {slide.btnText}
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
        aria-label="Previous Slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
        aria-label="Next Slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
