import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import API_URLS from "../../constants/apiUrls";

export interface Event {
  name: string;
  location: string;
  date: string;
  type: string[];
}

interface Message {
  type: "user" | "bot";
  content: string;
  events?: Event[];
  timestamp: Date;
}

interface EventChatbotProps {
  events: Event[];
}

const EventChatbot: React.FC<EventChatbotProps> = ({ events }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content:
            "👋 Hi! I can help you find events. Try asking about events by type, location, or date!",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const processUserInput = async (userInput: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.CHATBOT_SUGGEST_EVENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data: { events: Event[] } = await response.json();

      setMessages((prev) => [
        ...prev,
        { type: "user", content: userInput, timestamp: new Date() },
        {
          type: "bot",
          content:
            data.events.length > 0
              ? `I found ${data.events.length} event${
                  data.events.length === 1 ? "" : "s"
                } that might interest you:`
              : "I couldn't find any events matching your criteria. Try adjusting your search or ask about different types of events!",
          events: data.events,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "user", content: userInput, timestamp: new Date() },
        {
          type: "bot",
          content:
            "Sorry, I encountered an error. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const userInput = inputRef.current?.value.trim();
    if (userInput) {
      processUserInput(userInput);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div className="flex h-[600px] w-96 flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Event Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-blue-700"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-md"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.events && msg.events.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.events.map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className="rounded-lg bg-white p-3 shadow-sm"
                        >
                          <h4 className="font-semibold text-gray-800">
                            {event.name}
                          </h4>
                          <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <p>📍 {event.location}</p>
                            <p>
                              📅 {new Date(event.date).toLocaleDateString()}
                            </p>
                            <p>🏷️ {event.type.join(", ")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Searching events...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t bg-white p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about events..."
                className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventChatbot;
