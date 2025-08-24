import React, { useState } from 'react';
import { IoChatbubbleEllipses, IoStar, IoChevronBack, IoChevronForward } from 'react-icons/io5';

/**
 * A professional component showcasing patient testimonials
 * as a responsive carousel. Each card displays a quote, rating,
 * and the patient's name and service, and the user can navigate
 * through them one at a time.
 */
const App = () => {
  // Define the testimonials data. Each object contains the quote, name, and service.
  const testimonials = [
    {
      quote: "The doctors and nurses were incredibly kind and caring. I felt heard and supported every step of the way during my treatment.",
      name: "Jane Doe",
      service: "Medical Services",
      rating: 5
    },
    {
      quote: "My experience at the maternity ward was exceptional. The staff made me feel safe and comfortable, and they took wonderful care of my new baby.",
      name: "Sarah Lee",
      service: "Maternity Services",
      rating: 5
    },
    {
      quote: "The diagnostics team was efficient and professional. They gave me a clear understanding of my results, and the whole process was very smooth.",
      name: "Michael Chen",
      service: "Diagnostics",
      rating: 4
    },
    {
      quote: "I am grateful for the general surgery team. Their expertise and attention to detail gave me confidence, and my recovery has been seamless.",
      name: "David Smith",
      service: "General Surgery",
      rating: 5
    },
    {
      quote: "The pharmacy staff was very helpful and knowledgeable. They answered all my questions and ensured I had the right medications for my recovery.",
      name: "Emily White",
      service: "Pharmaceuticals",
      rating: 5
    },
  ];

  // State to track the current active testimonial in the carousel.
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * Navigates to the next testimonial in the carousel.
   */
  const goToNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
  };

  /**
   * Navigates to the previous testimonial in the carousel.
   */
  const goToPrevious = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + testimonials.length) % testimonials.length);
  };

  /**
   * Renders the star rating icons based on the rating value.
   * @param {number} rating The star rating (1-5).
   * @returns {JSX.Element[]} An array of star icons.
   */
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IoStar
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <section className="py-20 bg-white" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#074351] mb-4">What Our Patients Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our patients about their experiences at St. Paul’s Mission Hospital. Their stories are our greatest motivation.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Testimonial Cards */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            // We use a 50% transform to move two cards at a time on larger screens
            style={{ transform: `translateX(-${currentSlide * 50}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                // The md:w-1/2 class makes each card take up half the width on medium screens and up
                className="w-full flex-shrink-0 md:w-1/2 p-4"
              >
                <div className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col justify-between h-full">
                  <div>
                    <IoChatbubbleEllipses className="w-10 h-10 text-[#074351] opacity-20 mb-4" />
                    <p className="italic text-gray-700 leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    <h4 className="font-semibold text-lg text-[#074351]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-[#074351] focus:outline-none"
            aria-label="Previous testimonial"
          >
            <IoChevronBack size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-[#074351] focus:outline-none"
            aria-label="Next testimonial"
          >
            <IoChevronForward size={24} />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-[#074351]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
