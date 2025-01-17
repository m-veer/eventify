import React from 'react';
import HeroCarousel from '../HeroCarousel/HeroCarousel';
import event1 from "../../../assets/event-1.webp";
import event2 from "../../../assets/event2.webp";
import event3 from "../../../assets/event3.webp";
interface HeroSlide {
  image: string;
  alt: string;
  title: string;
}

const Hero: React.FC = () => {
  const heroSlides: HeroSlide[] = [
    {
      image: event1,
      alt: "Escape Explore Experience",
      title: "Escape, Explore, Experience"
    },
    {
      image: event2,
      alt: "Join The Festival",
      title: "Join The Festival"
    },
    {
      image: event3,
      alt: "Create Memories",
      title: "Create Memories"
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#f05123',
      width: '100%',
      height: '600px',
    }}>
      <HeroCarousel slides={heroSlides} />
    </div>
  );
};

export default Hero;