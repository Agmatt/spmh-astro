import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PartnerCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={40}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
      autoplay={{ delay: 2500 }}
      loop={true}
      
    >
      <SwiperSlide>
        <img src="/logos/kccb.png" alt="NGO A" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/aar.png" alt="NGO B" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/jubilee.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/apa.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/britam.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/aon.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/sha.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/nps.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/logos/cic.png" alt="NGO C" className="h-16 mx-auto" />
      </SwiperSlide>
    </Swiper>
  );
}
