## TinyBrosBlog — Full-Stack Social Blogging Platform

A modern, full-stack social blogging application where users can share food experiences, follow other users, and engage with content through comments. Features a responsive React frontend with dark/light themes and a robust Express.js backend with MongoDB.

### Website Features
- **Social Feed**: Browse posts from all users or filter to see only posts from users you follow
- **User Profiles**: View user profiles, follow/unfollow users, and see their post history
- **Post Creation**: Create rich posts with text content and image uploads
- **Comments System**: Engage with posts through threaded comments
- **Search & Discovery**: Search for users by username or display name with live previews
- **Responsive Design**: Mobile-first design with collapsible sidebar navigation
- **Theme Support**: Dark and light mode with smooth transitions
- **User Management**: Registration, login, profile settings, and account management
- **Support System**: Contact support and admin message management
- **Real-time Features**: Live search results and dynamic content updates

### Frontend Tech Stack
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7
- **UI Components**: React Bootstrap 2.10 with Bootstrap 5.3
- **Icons**: Bootstrap Icons
- **State Management**: React Context (AuthContext, ThemeContext)
- **HTTP Client**: Axios for API communication
- **Analytics**: Vercel Analytics integration
- **Real-time**: Socket.io client for live updates
- **Build Tool**: Create React App with TypeScript support

### Backend Tech Stack
- **Runtime/Framework**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (bearer tokens) with middleware-based route protection
- **File Storage**: Amazon S3 integration (via SDK) through upload middleware
- **Real-time**: Socket.io server for live features
- **Tooling**: Standard Express routing, modular controllers and middleware

### Data Models (overview)
- **User**: identity, credentials (hashed), profile fields, role; references to following/followers
- **Post**: author reference, title/content, media URLs/keys, timestamps, comments
- **SupportMessage**: user reference (optional), subject/content, status, timestamps

### Request Flow
1. Client sends requests to Express server
2. Middleware stack handles CORS, JSON parsing, auth (where required), and file uploads
3. Route handlers perform validation, call Mongoose models, and return JSON responses
4. Media uploads are processed by `upload` middleware and stored (e.g., S3) with returned public URLs/keys

### API Surface (high-level)
- `Auth` (`/api/auth`)
  - `POST /register` — create account
  - `POST /login` — obtain JWT
  - `GET /me` — current user profile (auth required)

- `Users` (`/api/users`)
  - `GET /:id` — fetch user profile
  - `PATCH /:id` — update profile (auth required)
  - `POST /:id/follow` — follow user (auth required)
  - `DELETE /:id/follow` — unfollow user (auth required)

- `Posts` (`/api/posts`)
  - `GET /` — list feed/posts
  - `POST /` — create post (auth required; supports media upload)
  - `GET /:id` — fetch post detail
  - `PATCH /:id` — update own post (auth required)
  - `DELETE /:id` — delete own post (auth required)
  - `POST /:id/comments` — add comment (auth required)

- `Support` (`/api/support`)
  - `POST /` — submit support message
  - `GET /` — list messages (admin)

Note: Exact routes and shapes are defined in the `routes/` and `models/` directories and may include additional filters, query parameters, or fields.

### Security & Operational Considerations
- JWT validation on protected routes via `middleware/auth.js`
- Input validation and permission checks at route level
- Media uploads constrained by `middleware/upload.js` (size/type policy)
- Environment-driven configuration for database and storage

### Frontend-Backend Integration
The React frontend communicates with the Express backend through RESTful APIs:

- **Authentication Flow**: JWT tokens stored in localStorage, sent with API requests
- **Real-time Updates**: Socket.io connection for live features and notifications
- **File Uploads**: Direct S3 uploads with signed URLs for media content
- **State Management**: React Context for global auth and theme state
- **API Services**: Organized service layers in `frontend/src/services/` for clean separation
- **Type Safety**: Shared TypeScript interfaces between frontend and backend
- **Responsive Design**: Mobile-first approach with Bootstrap components
- **Theme System**: CSS custom properties for consistent dark/light mode theming

### Key User Flows
1. **Registration/Login**: Users create accounts and authenticate via JWT
2. **Content Creation**: Users create posts with text and image uploads
3. **Social Interaction**: Follow users, comment on posts, like content
4. **Discovery**: Search for users, browse feeds, explore content
5. **Profile Management**: Update profiles, manage settings, view activity
6. **Support**: Contact admins, manage support tickets


