import React from "react";
import { Share2 } from "lucide-react";

interface EventShareProps {
  event: {
    title: string;
    description?: string;
    date: string;
    id: string;
  };
}

const EventShare: React.FC<EventShareProps> = ({ event }) => {
  const shareEvent = async () => {
    // Get the full URL for the event
    const eventUrl = `${window.location.origin}/events/${event.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title} on ${event.date}!`,
          url: eventUrl,
        });
      } catch (error: unknown) {
        // First type check to ensure error is an object with a 'name' property
        if (error && typeof error === "object" && "name" in error) {
          if (error.name === "AbortError") {
            console.log("Share was cancelled");
          } else {
            console.error("Error sharing event:", error);
          }
        } else {
          console.error("An unknown error occurred");
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = encodeURIComponent(eventUrl);
      const shareText = encodeURIComponent(
        `Check out this event: ${event.title} on ${event.date}!`
      );

      // Create sharing links for specific platforms
      const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
        instagram: `instagram://library?AssetPath=${shareUrl}`,
      };

      // Open share links in a new window
      window.open(shareLinks.twitter, "_blank");
    }
  };

  return (
    <button
      onClick={shareEvent}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      aria-label="Share event"
    >
      <Share2 className="w-5 h-5" />
      <span>Share Event</span>
    </button>
  );
};

export default EventShare;
