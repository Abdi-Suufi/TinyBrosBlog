import api from './api';
import { User } from '../types';

export const userService = {
  async getUserProfile(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(formData: FormData): Promise<User> {
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async followUser(userId: string): Promise<{ following: boolean; message: string }> {
    const response = await api.put(`/users/${userId}/follow`);
    return response.data;
  },

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<{
    posts: any[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  }> {
    const response = await api.get(`/users/${userId}/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUserFeed(page = 1, limit = 10): Promise<{
    posts: any[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  }> {
    const response = await api.get(`/users/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(`/users/search/${query}`);
    return response.data;
  },

  async getFollowing(userId: string): Promise<User[]> {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  }
}; 