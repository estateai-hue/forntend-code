import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

interface Props {
  images?: string[];
}

export default function PropertyGallery({ images = [] }: Props) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl">
      <div className="w-full">
        <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop
              className="rounded-2xl overflow-hidden"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-[500px] object-cover"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
      </div>
    </div>
    
  );
}