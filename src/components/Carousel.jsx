import { useState, useEffect } from 'react';

const slides = [
  {
    img: '/img/6.jpg',
    title: 'Compassionate Care for Your Family',
    text: 'Our dedicated team of healthcare professionals is here to provide the highest standard of care, ensuring your well-being is our top priority.',
  },
  {
    img: '/img/10.jpg',
    title: 'Our Mission',
    text: 'Promoting health and well-being through preventive, promotive, and curative services, guided by our Catholic values.',
  },
  {
    img: '/img/2.jpg',
    title: 'Emergency Services, 24/7',
    text: 'Our emergency department is staffed around the clock to provide immediate and life-saving care when you need it most.',
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000); // 7s feels more professional/less rushed
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='relative w-full h-[85vh] bg-slate-900 overflow-hidden'>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-transform duration-[1500ms] ease-in-out ${
            current === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}>
          {/* THE IMAGE: Using <img> for better performance and fetch priority */}
          <img
            src={slide.img}
            alt={slide.title}
            className='absolute inset-0 w-full h-full object-cover grayscale-[30%] brightness-[0.5]'
            loading={i === 0 ? 'eager' : 'lazy'} // Eager load only the first slide
            fetchPriority={i === 0 ? 'high' : 'low'}
          />

          {/* CONTENT LAYER */}
          <div className='absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-32'>
            <div
              className={`transition-all duration-1000 delay-300 transform ${
                current === i
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}>
              <span className='text-blue-500 font-mono text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block'>
                {slide.label}
              </span>
              <h2 className='text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] max-w-4xl mb-6'>
                {slide.title.split(' ').map((word, index) =>
                  index === 2 ? (
                    <span
                      key={index}
                      className='text-slate-400 italic font-serif lowercase md:uppercase md:not-italic font-light'>
                      {word}{' '}
                    </span>
                  ) : (
                    word + ' '
                  ),
                )}
              </h2>
              <p className='text-white text-lg md:text-xl font-light max-w-xl leading-relaxed border-l border-white pl-6'>
                {slide.text}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* DASH INDICATORS: Modernized from dots */}
      <div className='absolute bottom-10 right-10 flex items-center space-x-4 z-20'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className='group py-4 focus:outline-none'>
            <div
              className={`h-[2px] transition-all duration-500 ${
                current === i
                  ? 'w-12 bg-blue-600'
                  : 'w-6 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
