import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    img: "/img/10.jpg",
    title: "Compassionate Care for Your Family",
    text: "Our dedicated team of healthcare professionals is here to provide the highest standard of care, ensuring your well-being is our top priority.",
    button: { label: "Learn More", link: "/about" },
  },
  {
    img: "/img/8.jpg",
    title: "Our Mission",
    text: "Promoting health and well-being through preventive, promotive, and curative services, guided by our Catholic values.",
    button: { label: "View Services", link: "/services" },
  },
  {
    img: "/img/2.jpg",
    title: "Dedicated Emergency Services, 24/7",
    text: "Our emergency department is staffed around the clock to provide immediate and life-saving care when you need it most.",
    button: { label: "Contact Us", link: "/contact" },
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url(${slides[current].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
            <h2 className="text-3xl text-white md:text-5xl font-bold mb-4 drop-shadow-lg">
              {slides[current].title}
            </h2>
            <p className="max-w-2xl mb-6 text-lg md:text-xl drop-shadow-md">
              {slides[current].text}
            </p>
            <a
              href={slides[current].button.link}
              className="btn-primary"
            >
              {slides[current].button.label}
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

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





