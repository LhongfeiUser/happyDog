import React from 'react';
import { Carousel } from 'antd';

interface ServiceCarouselProps {
  images: string[];
  title: string;
  subtitle: string;
}

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  images,
  title,
  subtitle,
}) => {
  return (
    <Carousel autoplay autoplaySpeed={5000} style={{ borderRadius: 16, overflow: 'hidden' }}>
      {images.map((image, index) => (
        <div key={index}>
          <div
            style={{
              height: 300,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <h2 style={{ fontSize: 36, marginBottom: 16, color: 'white' }}>{title}</h2>
              <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.9)' }}>{subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default ServiceCarousel;
