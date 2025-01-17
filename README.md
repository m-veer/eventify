# Eventify API

A robust REST API system for managing events and ticket bookings. This system allows users to create, manage, and book events, with comprehensive admin controls and user management features.

## Features

- User Authentication & Authorization
- Event Management
- Ticket Booking System
- Admin Dashboard
- Event Reporting System
- Secure API Endpoints
- MongoDB Integration
- JWT Authentication

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT for Authentication
- Various NPM packages for security and functionality

## Project Structure

```
📦 eventify
 ┣ 📂 api
 ┃ ┣ 📂 docs
 ┃ ┃ ┗ 📂 openapi
 ┃ ┣ 📂 service
 ┃ ┃ ┣ 📂 controllers
 ┃ ┃ ┣ 📂 models
 ┃ ┃ ┣ 📂 routers
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┗ 📜 app.js
 ┃ ┣ 📜 .env
 ┃ ┣ 📜 .gitignore
 ┃ ┗ 📜 server.js
```

## Setup Instructions

1. Clone the repository

```bash
git clone <repository-url>
cd eventify
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```env
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
```

4. Start the server

```bash
# Development mode
npm run dev
```

## API Documentation

The API is documented using OpenAPI specification. You can find the full documentation in the `/api/docs/openapi` directory.

### Key Endpoints

- `/api/users/signup` - User registration
- `/api/users/login` - User authentication
- `/api/events` - Event management
- `/api/admin/*` - Admin endpoints
- `/api/events/:eventId/register` - Event registration

## Security Features

- JWT Authentication
- Password Hashing
- Rate Limiting
- CORS Protection
- Security Headers
- Request Validation

## Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes and error messages.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

```mermaid
---
Title: Eventify Model
---

classDiagram
    class User {
        <<Entity>>
        +UUID id
        +String email
        +String password
        +String firstName
        +String lastName
        +String phoneNumber
        +DateTime createdAt
        +DateTime updatedAt
        +Boolean isActive
        +login()
        +logout()
        +purchaseTicket(Event event)
        +createEvent()
        +registerForEvent()
        +updateProfile()
    }

    class Event {
        <<Entity>>
        +UUID id
        +String title
        +String description
        +Address location
        +DateTime startTime
        +DateTime endTime
        +EventType type
        +Money ticketPrice
        +int capacity
        +EventStatus status
        +boolean isBlockedByAdmin
        +updateEvent()
        +publishEvent()
    }

    class Ticket {
        <<Entity>>
        +UUID id
        +Event event
        +TicketType type
        +Money price
        +TicketStatus status
        +DateTime purchaseDate
        +validateTicket()
        +cancelTicket()
    }

    class Address {
        <<Value Object>>
        +String street
        +String city
        +String state
        +String zipCode
        +String country
    }

    class reportedEvents{
        <<Value Object>>
        +UUID userId
        +UUID eventId
        +String message
        +DateTime reportedOn
    }

    class registeredEvents{
        <<Value Object>>
        +UUID userId
        +UUID eventId
    }

    class Admin {
        <<Entity>>
        +List~Permission~ permissions
        +DateTime lastAdminAction
        +manageUsers()
        +manageEvents()
        +handleReports()
    }

    class Payment {
        <<Service>>
        +UUID id
        +UUID userId
        +UUID eventId
        +Money amount
        +PaymentStatus status
        +DateTime paymentDate
        +processPayment()
        +refundPayment()
    }

    class EventType {
        <<enumeration>>
        CONFERENCE
        WORKSHOP
        CONCERT
        SPORTS_MATCH
        NETWORKING
        SEMINAR
        EXHIBITION
        FESTIVAL
        CHARITY
        VIRTUAL_MEETING
        HYBRID_EVENT
        TRADE_SHOW
        CEREMONY
        PERFORMANCE
        PRIVATE_PARTY
    }

    class EventStatus{
        <<enumeration>>
        UPCOMING
        COMPLETED
        IN_PROGRESS
    }

    class PaymentStatus{
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }

    User "*" -- "*" registeredEvents : participates
    User "1" -- "*" Ticket : purchases
    Ticket "1" -- "1" User : owns
    User "1" -- "*" Event : mayOrganize
    User <|-- Admin
    User "1" -- "1" Address : has
    Event "1" -- "*" Ticket : has
    Event "1" -- "*" Payment : generates
    User "1" -- "*" Payment : makes
    User "1" -- "*" reportedEvents : reports
    Admin "*" -- "*" User : manages
    Admin "*" -- "*" Event : oversees

```
STREAM LINK - https://northeastern-my.sharepoint.com/:v:/r/personal/darji_ru_northeastern_edu/Documents/Recordings/Microsoft%20Teams%20meeting-20241207_232709-Meeting%20Recording.mp4?csf=1&web=1&e=YKEqod&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D
