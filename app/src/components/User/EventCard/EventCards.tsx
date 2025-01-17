import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./EventCards.css";
import event1 from "../../../assets/event-1.webp";
import event2 from "../../../assets/event2.webp";
import event3 from "../../../assets/event3.webp";
import EventModal from "../EventModal/EventModal"
import { useNavigate } from "react-router-dom";
import API_URLS from "../../../constants/apiUrls";

interface Event {
  _id: string;
  name: string;
  title: string;
  location: string;
  description: string;
  image: string;
  date: string;
  organizer: {
    email: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    _id: string;
  }
  eventTypes: string[];
  tags: string[];
  eventPhotoURL: string;
}
interface ProcessedEvent {
  id: string;
  name: string;
  description: string;
  image: string;
  title: string;
  location: string;
  date: string;
  organizerName: string;
  organizerCreatedAt: string;
  eventTypes: string[];
  tags: string[];
  eventPhotoURL: string;
}
interface CategoryGroup  {
  title: string;
  icon: string;
  events: ProcessedEvent[];
}

export interface EventCardProps {
  id: number;
  title: string;
  location: string;
  image: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventIndex: number;
  event: ProcessedEvent;
}

const EventCards: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(-1);

  useEffect(() => {
    fetchEvents();
  }, []);

  let comedyEvents: CategoryGroup = { title: t("COMEDY EVENTS"), icon: "🎭", events: [] };
  let techEvents: CategoryGroup = { title: t("TECH EVENTS"), icon: "💻", events: [] };
  let musicEvents: CategoryGroup = { title: t("MUSIC EVENTS"), icon: "🎵", events: [] };
  let festivalEvents: CategoryGroup = { title: t("FESTIVAL EVENTS"), icon: "🎪", events: [] };

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URLS.USER_FILTER_EVENTS, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure we're accessing the events array correctly
      const events: Event[] = data.data || [];
      
      if (!Array.isArray(events)) {
        throw new Error('Events data is not an array');
      }

      // Reset category events arrays
      comedyEvents.events = [];
      techEvents.events = [];
      musicEvents.events = [];
      festivalEvents.events = [];

      // Create Sets to track unique event IDs for each category
      const comedyIds = new Set<string>();
      const techIds = new Set<string>();
      const musicIds = new Set<string>();
      const festivalIds = new Set<string>();

      // data.data.forEach((item: Event) => {
      events.forEach((item: Event) => {
        const processedEvent: ProcessedEvent = {
          id: item._id,
          name: item.name,
          description: item.description,
          image: item.image,
          title: item.name,
          location: item.location,
          date: item.date,
          organizerName: `${item.organizer.firstName} ${item.organizer.lastName}`,
          organizerCreatedAt: item.organizer.createdAt,
          eventTypes: item.eventTypes,
          tags: item.tags,
          eventPhotoURL: item.eventPhotoURL
        };
      
        if (item.eventTypes.includes('Comedy') && !comedyIds.has(item._id)) {
          comedyIds.add(item._id);
          comedyEvents.events.push(processedEvent);
        } else if (item.eventTypes.includes('Technology') && !techIds.has(item._id)) {
          techIds.add(item._id);
          techEvents.events.push(processedEvent);
        } else if (item.eventTypes.includes('Music') && !musicIds.has(item._id)) {
          musicIds.add(item._id);
          musicEvents.events.push(processedEvent);
        } else if (item.eventTypes.includes('Festival') && !festivalIds.has(item._id)) {
          festivalIds.add(item._id);
          festivalEvents.events.push(processedEvent);
        }
      });
      setCategories([comedyEvents, techEvents, musicEvents, festivalEvents].filter(category => category.events.length > 0));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleScroll = (direction: "left" | "right", categoryId: number) => {
    const container = document.getElementById(`category-${categoryId}`);
    if (!container) return;

    const containerWidth = container.clientWidth;
    const cardWidth = container.querySelector(".event-card")?.clientWidth || 0;
    const gap = 20;
    const cardsPerView = 4;
    const scrollDistance = (cardWidth + gap) * cardsPerView;
    const maxScroll = container.scrollWidth - containerWidth;

    let newPosition;
    if (direction === "left") {
      newPosition =
        Math.floor(container.scrollLeft / scrollDistance) * scrollDistance -
        scrollDistance;
    } else {
      newPosition =
        Math.ceil(container.scrollLeft / scrollDistance) * scrollDistance +
        scrollDistance;
    }

    newPosition = Math.max(0, Math.min(newPosition, maxScroll));

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const touchStart = useRef<number>(0);
  const touchEnd = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (categoryId: number) => {
    const swipeThreshold = 50;
    const difference = touchStart.current - touchEnd.current;

    if (Math.abs(difference) > swipeThreshold) {
      handleScroll(difference > 0 ? "right" : "left", categoryId);
    }
  };

  const handleEventClick = (event: ProcessedEvent, index: number) => {
    navigate('/event', {
      state: {
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        date: event.date,
        organizerName: event.organizerName,
        organizerCreatedAt: event.organizerCreatedAt
      }
    });
  };

  return (
    <div className="events-container">
      {categories.map((category, categoryIndex) => (
        <section key={categoryIndex} className="category-section">
          <h1 className="category-title">
            {category.title} {category.icon}
          </h1>
          <div className="cards-wrapper">
            <button
              className="scroll-button left"
              onClick={() => handleScroll("left", categoryIndex)}
            >
              ←
            </button>
            <div
              id={`category-${categoryIndex}`}
              className="cards-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(categoryIndex)}
            >
              {category.events.map((event, index) => (
                <div key={index} className="event-card">
                  <img
                    src={event.eventPhotoURL}
                    alt={event.title}
                    className="event-image"
                  />
                  <h2 
                    className="event-title"
                    onClick={() => handleEventClick(event, index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {event.title}
                  </h2>
                  <div className="event-location">
                    <span className="location-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="scroll-button right"
              onClick={() => handleScroll("right", categoryIndex)}
            >
              →
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default EventCards;
