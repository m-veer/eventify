// utils/dateUtils.ts
import { Event } from '../types/event';

export const segregateEvents = (events: Event[]): { pastEvents: Event[], futureEvents: Event[] } => {
  const currentDate = new Date();
  const pastEvents: Event[] = [];
  const futureEvents: Event[] = [];

  events.forEach(event => {
    const [dayOfWeek, month, day, time, period] = event.time.split(' ');
    const eventDate = new Date(`${month} ${day} ${currentDate.getFullYear()} ${time} ${period}`);

    if (eventDate < currentDate) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};