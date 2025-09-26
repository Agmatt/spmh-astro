import { useState, useEffect } from "react";

const slides = [
  {
    img: "/img/6.jpg",
    title: "Compassionate Care for Your Family",
    text: "Our dedicated team of healthcare professionals is here to provide the highest standard of care, ensuring your well-being is our top priority.",
  },
  {
    img: "/img/10.jpg",
    title: "Our Mission",
    text: "Promoting health and well-being through preventive, promotive, and curative services, guided by our Catholic values.",
  },
  {
    img: "/img/2.jpg",
    title: "Dedicated Emergency Services, 24/7",
    text: "Our emergency department is staffed around the clock to provide immediate and life-saving care when you need it most.",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const preload = slides.map((s) => {
      const img = new Image();
      img.src = s.img;
      return img;
    });

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            current === i ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
            <h2 className="text-3xl text-white  md:text-5xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="max-w-2xl mb-6 text-lg md:text-xl drop-shadow-md">
              {slide.text}
            </p>
            
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${
              current === i ? "bg-white" : "bg-gray-400/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
