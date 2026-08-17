import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Amara Kipchoge',
    role: 'Nursing Student',
    institution: 'Tom Mboya University',
    quote: 'The clinical rotation at SPMH was transformative. Working with experienced preceptors gave me confidence I couldn\'t get from textbooks. I\'m now placed at a regional hospital.',
  },
  {
    id: 2,
    name: 'Peter Omondi',
    role: 'Laboratory Technology',
    institution: 'Kisii Technical College',
    quote: 'SPMH\'s lab setup is state-of-the-art. The hands-on experience with quality assurance and equipment maintenance was exactly what I needed for my career.',
  },
  {
    id: 3,
    name: 'Jane Mwangi',
    role: 'Pharmacy Student',
    institution: 'Sigalagala Technical College',
    quote: 'The pharmacy team was welcoming and invested in my learning. I gained practical knowledge about drug management and patient counseling that\'s invaluable.',
  },
  {
    id: 4,
    name: 'Dr. Naomi Kipkemboi',
    role: 'Nursing Program Director',
    institution: 'Nairobi University',
    quote: 'Our partnership with SPMH has elevated our curriculum integration. Students return from placements with practical skills our classroom simply cannot provide.',
  },
  {
    id: 5,
    name: 'Dr. Robert Mwangi',
    role: 'Executive Director',
    institution: 'YOFAK',
    quote: 'SPMH\'s commitment to youth healthcare training aligns perfectly with YOFAK\'s mission. The research collaboration has yielded insights we\'re implementing across Kenya.',
  },
  {
    id: 6,
    name: 'David Kiptur',
    role: 'Pharmacy Technician',
    institution: 'Mawego Technical College',
    quote: 'Beyond the technical skills, SPMH taught me professionalism and patient care ethics. Every interaction with the team was a learning opportunity.',
  }
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Handle swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setIsAutoPlay(false);
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
    setTimeout(() => setIsAutoPlay(true), 500);
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      } else {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
  };

  // Mouse drag support
  const handleMouseDown = (e) => {
    touchStartX.current = e.clientX;
    setIsAutoPlay(false);
  };

  const handleMouseUp = (e) => {
    touchEndX.current = e.clientX;
    handleSwipe();
    setTimeout(() => setIsAutoPlay(true), 500);
  };

  // Determine visible cards based on screen size
  const getVisibleCards = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const [visibleCards, setVisibleCards] = useState(1);

  useEffect(() => {
    setVisibleCards(getVisibleCards());
    const handleResize = () => setVisibleCards(getVisibleCards());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="relative bg-gradient-to-b from-slate-50 to-white py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            From Students & Partners
          </h2>
          <p className="text-slate-600 text-lg">
            Hear directly from those who've shaped their careers and programs with SPMH.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${current * (100 / visibleCards)}%)`
            }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 ${
                  visibleCards === 3 ? 'w-1/3' :
                  visibleCards === 2 ? 'w-1/2' :
                  'w-full'
                }`}
              >
                <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col hover:shadow-md transition-shadow">
                  {/* Avatar & Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-base">{testimonial.name}</p>
                      <p className="text-sm text-blue-600 font-500">{testimonial.role}</p>
                      <p className="text-xs text-slate-500">{testimonial.institution}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 leading-relaxed flex-grow mb-4 italic text-sm">
                    "{testimonial.quote}"
                  </p>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 5000);
              }}
              className={`transition-all ${
                idx === current
                  ? 'w-8 h-2 bg-blue-600 rounded-full'
                  : 'w-2 h-2 bg-slate-300 rounded-full hover:bg-slate-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Swipe Indicator (Mobile) */}
        <div className="text-center mt-6 lg:hidden">
          <p className="text-xs text-slate-500">← Swipe to see more →</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .flex {
            scroll-snap-type: x mandatory;
          }
        }
      `}</style>
    </div>
  );
}