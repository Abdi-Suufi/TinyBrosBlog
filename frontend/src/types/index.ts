export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  followers: (string | { _id: string; username: string; displayName: string; profilePicture?: string })[];
  following: (string | { _id: string; username: string; displayName: string; profilePicture?: string })[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  author: User;
  title: string;
  body: string;
  image: string;
  rating: number;
  restaurantName?: string;
  location?: string;
  likes: string[];
  comments: Comment[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  onlineUsers: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
} 