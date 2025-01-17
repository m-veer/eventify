// HeroCarousel.jsx
import React, { useState, useEffect } from "react";

// Define types for slide props
interface Slide {
  image: string;
  title: string;
}

interface HeroCarouselProps {
  slides: Slide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden"
    }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#f05123"
          }} />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "2rem",
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            color: "white"
          }}>
            <h1 style={{
              fontSize: "2.5rem",
              margin: 0,
              fontWeight: "bold"
            }}>{slide.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;