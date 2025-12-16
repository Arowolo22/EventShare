# EventShare API 📸

## Overview
EventShare is a modern full-stack web application built with Next.js, Firebase, and Cloudinary, designed to facilitate real-time shared photo pools for events. It enables users to create or join events using a unique code, upload photos, and view a collective gallery.

## Features
-   📸 **Event Creation**: Effortlessly set up new events with a name and optional description, generating a unique shareable code.
-   🔗 **Event Joining**: Guests can easily join an event using a simple code, with no signup required.
-   ⬆️ **Photo Uploads**: Seamlessly upload multiple photos to an event's shared gallery.
-   🖼️ **Real-Time Gallery**: Instantly view all shared photos within an event's dedicated gallery.
-   📊 **Organizer Dashboard**: Authenticated organizers can manage their created events, track event statistics, and access galleries.
-   🛡️ **Firebase Authentication**: Secure login system for event organizers.
-   ☁️ **Cloudinary Integration**: Robust cloud storage for efficient photo management and delivery.

## Getting Started
To get the EventShare API and client running locally, follow these steps.

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Arowolo22/EventShare.git
    cd EventShare
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env.local` file in the root directory and add the following environment variables. Replace the placeholder values with your actual credentials.

```
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Firebase Configuration (Next.js Public Variables)
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_firebase_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
```

### Running the Application
To run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Documentation
This section details the backend API endpoints for EventShare.

### Base URL
The API base URL is relative to the Next.js application root, typically `http://localhost:3000` in development.

### Endpoints

#### POST /api/events
Creates a new event with a unique shareable code.

**Request**:
```json
{
  "eventName": "Arowolo's Wedding",
  "description": "Share your favorite moments from our special day!"
}
```

**Response**:
```json
{
  "event": {
    "id": "uuid-event-id",
    "name": "Arowolo's Wedding",
    "description": "Share your favorite moments from our special day!",
    "code": "ABCD123",
    "createdAt": "2023-10-27T10:00:00Z"
  }
}
```

**Errors**:
-   `400 Bad Request`: Event name is required.
    ```json
    { "error": "Event name is required." }
    ```
-   `500 Internal Server Error`: Unable to create event.
    ```json
    { "error": "Unable to create event. Please try again." }
    ```

#### GET /api/events
Retrieves event details either by a specific code or all events for an organizer.

**Query Parameters**:
-   `code`: (Optional) The unique code of the event to retrieve.
-   `all`: (Optional) Set to `true` to fetch all events created by the authenticated organizer.

**Request (by code)**:
`GET /api/events?code=ABCD123`

**Response (single event by code)**:
```json
{
  "event": {
    "id": "uuid-event-id",
    "name": "Arowolo's Wedding",
    "description": "Share your favorite moments from our special day!",
    "code": "ABCD123",
    "createdAt": "2023-10-27T10:00:00Z",
    "photoCount": 5
  }
}
```

**Request (all events)**:
`GET /api/events?all=true`

**Response (all events for organizer)**:
```json
{
  "events": [
    {
      "id": "uuid-event-id-1",
      "name": "Arowolo's Wedding",
      "description": "Share your favorite moments...",
      "code": "ABCD123",
      "createdAt": "2023-10-27T10:00:00Z",
      "photoCount": 5
    },
    {
      "id": "uuid-event-id-2",
      "name": "Birthday Bash",
      "description": "Party photos!",
      "code": "XYZ789",
      "createdAt": "2023-10-20T14:30:00Z",
      "photoCount": 12
    }
  ]
}
```

**Errors**:
-   `400 Bad Request`: Event code is required (if `all` is not specified).
    ```json
    { "error": "Event code is required." }
    ```
-   `404 Not Found`: Event not found.
    ```json
    { "error": "Event not found." }
    ```
-   `500 Internal Server Error`: Unable to fetch events.
    ```json
    { "error": "Unable to fetch events." }
    ```

#### GET /api/photos
Retrieves all photos associated with a specific event code.

**Query Parameters**:
-   `code`: (Required) The unique code of the event to retrieve photos for.

**Request**:
`GET /api/photos?code=ABCD123`

**Response**:
```json
{
  "photos": [
    {
      "id": "uuid-photo-id-1",
      "publicId": "event-share/ABCD123/photo123",
      "url": "https://res.cloudinary.com/.../photo123.jpg",
      "width": 1920,
      "height": 1080,
      "bytes": 500000,
      "format": "jpg",
      "uploadedAt": "2023-10-27T10:05:00Z"
    },
    {
      "id": "uuid-photo-id-2",
      "publicId": "event-share/ABCD123/photo456",
      "url": "https://res.cloudinary.com/.../photo456.png",
      "width": 1280,
      "height": 720,
      "bytes": 800000,
      "format": "png",
      "uploadedAt": "2023-10-27T10:07:00Z"
    }
  ]
}
```

**Errors**:
-   `400 Bad Request`: Event code is required.
    ```json
    { "error": "Event code is required." }
    ```
-   `404 Not Found`: Event not found.
    ```json
    { "error": "Event not found." }
    ```
-   `500 Internal Server Error`: Unable to load photos.
    ```json
    { "error": "Unable to load photos." }
    ```

#### POST /api/photos
Uploads a new photo to an event. The photo is stored in Cloudinary, and a record is kept in the application's storage.

**Request**:
Multipart Form Data:
-   `eventCode`: (Required) The unique code of the event.
-   `file`: (Required) The image file to upload.

**Response**:
```json
{
  "photo": {
    "id": "uuid-new-photo-id",
    "publicId": "event-share/ABCD123/new_upload",
    "url": "https://res.cloudinary.com/.../new_upload.jpg",
    "width": 1500,
    "height": 1000,
    "bytes": 650000,
    "format": "jpg",
    "uploadedAt": "2023-10-27T10:15:00Z"
  }
}
```

**Errors**:
-   `400 Bad Request`: Event code is required or a valid file is required.
    ```json
    { "error": "Event code is required." }
    ```
    ```json
    { "error": "A valid file is required." }
    ```
-   `404 Not Found`: Event not found.
    ```json
    { "error": "Event not found." }
    ```
-   `500 Internal Server Error`: Cloudinary not configured on the server or unable to upload photo.
    ```json
    { "error": "Cloudinary is not configured on the server." }
    ```
    ```json
    { "error": "Unable to upload photo. Please try again." }
    ```

## Usage
Once the application is running:

1.  **Create an Event**:
    -   Navigate to the homepage and click "Create Event".
    -   Fill in the event name and an optional description.
    -   Upon creation, you'll receive a unique event code. Share this code with your guests.

2.  **Join an Event**:
    -   Navigate to the homepage and click "Join Event".
    -   Enter the event code and your name (optional).
    -   You will be redirected to the event's gallery.

3.  **Upload Photos**:
    -   From an event's gallery page, click the `+` or upload button.
    -   Select one or more photos from your device.
    -   Photos will be uploaded and appear in the gallery for everyone.

4.  **Organizer Dashboard**:
    -   Login as an organizer via `/auth/login`.
    -   The dashboard provides an overview of all your created events, including total events, active events, and total photos.
    -   You can view individual event galleries from here.

## Technologies Used
| Category        | Technology          | Description                                    |
| :-------------- | :------------------ | :--------------------------------------------- |
| **Framework**   | [Next.js](https://nextjs.org/)     | React framework for production.                |
| **Frontend**    | [React](https://react.dev/)        | JavaScript library for building user interfaces. |
| **Styling**     | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for rapid UI development. |
| **Auth**        | [Firebase Authentication](https://firebase.google.com/docs/auth) | Google's authentication service for user management. |
| **Storage**     | [Cloudinary](https://cloudinary.com/)  | Cloud-based image and video management.        |
| **Fonts**       | [Geist Font](https://vercel.com/font) | Modern, variable typeface by Vercel.           |
| **Icons**       | [Lucide React](https://lucide.dev/)    | Beautiful & consistently designed icons.       |
| **Feedback**    | [React Hot Toast](https://react-hot-toast.com/) | Lightweight and customizable toast notifications. |

## Contributing
We welcome contributions to EventShare! To contribute:

1.  🍴 Fork the repository.
2.  🌿 Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  ✨ Make your changes and ensure the code adheres to the project's style.
4.  🧪 Write tests for new features or bug fixes.
5.  ✅ Commit your changes with a clear and concise message.
6.  🚀 Push your branch to your forked repository.
7.  📬 Open a pull request to the `main` branch of the original repository.

## Author Info
**Emmanuel Arowolo**
-   LinkedIn: [https://linkedin.com/in/emmanuel-arowolo](https://www.linkedin.com/in/emmanuel-arowolo/)
-   Twitter: [https://twitter.com/your_twitter_handle](https://twitter.com/your_twitter_handle)
-   Portfolio: [https://your-portfolio.com](https://your-portfolio.com)

---
[![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)