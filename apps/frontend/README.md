# CharchaManch - Progressive Web App

A modern progressive web app for community messaging and local area exploration, built with Next.js and Tailwind CSS.

## Features

### 🏠 Home Page
- **Centered Logo Header**: Clean, professional branding with the CharchaManch logo
- **Dropdown Search Bar**: Vertically and horizontally centered search with smart suggestions
- **Quick Actions**: Start Chat and Explore buttons for immediate engagement

### 💬 Message Page
- **Conversation List**: View all your active conversations
- **Search Conversations**: Find specific chats quickly
- **New Message**: Start new conversations with community members
- **Real-time Updates**: See message timestamps and previews

### 🗺️ Your Area Page
- **Location Services**: Current location display and update functionality
- **Community Stats**: Active members and monthly events count
- **Local Events**: Upcoming community activities and meetups
- **Local Businesses**: Nearby shops and services
- **Community Join**: Easy access to join local groups

### 📱 Progressive Web App Features
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker caching for offline functionality
- **Responsive Design**: Optimized for all device sizes
- **Bottom Navigation**: Fixed navigation bar for easy access
- **Fast Loading**: Optimized performance and caching

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd charchamanch

# Install dependencies
npm install

# Run development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## PWA Installation

### Mobile Devices
1. Open the app in your mobile browser
2. Look for the "Add to Home Screen" prompt
3. Tap "Add" to install the PWA
4. The app will now appear on your home screen

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Click "Install" to add to your desktop
4. The app will launch in its own window

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Heroicons (SVG)
- **Build Tool**: Next.js with Turbopack

## Project Structure

```
charchamanch/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with bottom navigation
│   │   ├── page.tsx            # Home page
│   │   ├── message/
│   │   │   └── page.tsx        # Message page
│   │   └── your-area/
│   │       └── page.tsx        # Your Area page
│   └── components/
│       └── ServiceWorkerRegistration.tsx
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icon-*.png             # App icons
└── package.json
```

## Customization

### Colors and Theme
The app uses Tailwind CSS with a blue-based color scheme. You can customize colors in the `tailwind.config.js` file.

### Icons
Replace the placeholder icon files in the `public/` directory with your actual app icons:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

### Content
Update the content in each page component to match your community's needs and branding.

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 11.1+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
