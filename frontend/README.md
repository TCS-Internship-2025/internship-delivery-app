# SwiftParcel: Delivery App Frontend

A modern, responsive frontend application for a delivery service platform, developed as part of the TCS Internship Program 2025.

## 🚀 Overview

This frontend application provides a user-friendly interface for customers to create, receive and track parcels. Built with modern web technologies to ensure optimal performance and user experience, the backend was built with Spring boot under ``/backend`` folder

## ✨ Features

### Customer Features

- **User Authentication** - Login, registration,
- **Profile management** - Change email, password, phone number
- **Order Management** - Place orders, view order history, track delivery status, change address conditionally
- **Real-time Tracking through a trusted API** - `Live` order status updates and delivery tracking
- **Responsive Design & Dark theme** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **Framework**: React.js
- **State Management**: [Redux / Vuex / NgRx]
- **Styling**: CSS3 / MUI
- **Build Tool**: Vite
- **HTTP Client**: [TansQuery / Fetch API]
- **Maps Integration**: Mapbox
- **Testing**: ...

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (latest version or 18.0 or higher)
- **pnpm** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TCS-Internship-2025/internship-delivery-app.git
cd internship-delivery-app/frontend
```

### 2. Install Dependencies

```bash
# Using npm
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# MapBox API
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiY2ltcGEyMDA0IiwiYSI6ImNtZG11Y3c1YzFsbzkya3F5NDk5OWVxZHoifQ.-jsNPKj1k2ujkiD0L-d9Ag

```

### 4. Start the Development Server

```bash
# Using npm
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── __redirects        # For Netlify deployment
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── LandingPage/
    |   ├── Register/
    |   ├── Login/
│   │   ├── ProfileInfo/
│   │   ├── Parcels/
│   │   └── ParcelDetails/
        .......
│   ├── hooks/             # Custom React hooks
│   ├── services/          # HTTP requests service
│   ├── apis/              # API calls and management with tansQuery
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│
├── index.html
├── package.json
├── README.md
└── .env
```

## 🚀 Deployment

This project is hosted in Netlify and uses the built in CI/CD offered by the platform, and can be found in:
[SwiftParcel Link](https://swift-parcel-internship.netlify.app/)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.


### Docker Deployment

```bash
# Build Docker image
docker build -t delivery-app-frontend .

# Run container
docker run -p 3000:3000 delivery-app-frontend
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)



## 📝 Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Code reviews


## 📄 License

This project is part of the TCS Internship Program 2025. All rights reserved.

## 👥 Team

**TCS Internship 2025 Team**

- Frontend Developers & Mentors


---

**Note**: This is an internship project developed for educational purposes as part of the TCS Internship Program 2025.
