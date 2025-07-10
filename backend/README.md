# TinyBrosBlog Backend API

A RESTful API for TinyBrosBlog - A food blog platform where users can share their dining experiences.

## Features

- User authentication (register, login, JWT)
- Blog post management (CRUD operations)
- Image uploads for posts and profile pictures
- Like and comment system
- User following system
- User profiles and settings
- Search functionality

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tinybrosblog
   JWT_SECRET=your_secure_jwt_secret_here
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Posts

#### Create Post
- **POST** `/api/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data`
  - `title`: string (required)
  - `body`: string (required)
  - `image`: file (required)
  - `rating`: number 1-5 (required)
  - `restaurantName`: string (optional)
  - `location`: string (optional)
  - `tags`: string (comma-separated, optional)

#### Get All Posts
- **GET** `/api/posts?page=1&limit=10`

#### Get Single Post
- **GET** `/api/posts/:id`

#### Get Posts by User
- **GET** `/api/posts/user/:userId`

#### Update Post
- **PUT** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "body": "Updated content",
    "rating": 4,
    "restaurantName": "Updated Restaurant",
    "location": "Updated Location",
    "tags": "pizza, italian, dinner"
  }
  ```

#### Delete Post
- **DELETE** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Like/Unlike Post
- **PUT** `/api/posts/:id/like`
- **Headers:** `Authorization: Bearer <token>`

#### Add Comment
- **POST** `/api/posts/:id/comments`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "text": "Great post! The food looks amazing."
  }
  ```

#### Remove Comment
- **DELETE** `/api/posts/:id/comments/:commentId`
- **Headers:** `Authorization: Bearer <token>`

### Users

#### Get User Profile
- **GET** `/api/users/:id`

#### Update Profile
- **PUT** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data`
  - `displayName`: string (optional)
  - `bio`: string (optional)
  - `profilePicture`: file (optional)

#### Follow/Unfollow User
- **PUT** `/api/users/:id/follow`
- **Headers:** `Authorization: Bearer <token>`

#### Get User's Posts
- **GET** `/api/users/:id/posts?page=1&limit=10`

#### Get User's Feed (Posts from followed users)
- **GET** `/api/users/feed?page=1&limit=10`
- **Headers:** `Authorization: Bearer <token>`

#### Search Users
- **GET** `/api/users/search/:query`

## Data Models

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  displayName: String,
  profilePicture: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  title: String,
  body: String,
  image: String,
  rating: Number (1-5),
  restaurantName: String,
  location: String,
  likes: [ObjectId (ref: User)],
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Responses

All endpoints return error responses in the following format:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned upon successful login/registration and expire after 7 days. 