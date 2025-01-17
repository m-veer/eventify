import React from 'react';
import './EventModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventIndex: number;
  event: {
    title: string;
    location: string;
    image: string;
  };
}

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, eventIndex, event }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={event.image} alt={event.title} className="modal-image" />
        <h2>{event.title}</h2>
        <p>Event Index: {eventIndex}</p>
        <p>Location: {event.location}</p>
      </div>
    </div>
  );
};

export default EventModal;