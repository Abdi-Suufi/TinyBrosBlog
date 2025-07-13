import api from './api';
import { Post, Comment, Reply } from '../types';

export const postService = {
  async getPosts(page = 1, limit = 10): Promise<{
    posts: Post[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  }> {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPost(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(formData: FormData): Promise<Post> {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async likePost(id: string): Promise<Post> {
    const response = await api.put(`/posts/${id}/like`);
    return response.data;
  },

  async addComment(postId: string, text: string): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },

  async likeComment(postId: string, commentId: string): Promise<Comment> {
    const response = await api.put(`/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  },

  async addReply(postId: string, commentId: string, text: string): Promise<Reply> {
    const response = await api.post(`/posts/${postId}/comments/${commentId}/replies`, { text });
    return response.data;
  },

  async likeReply(postId: string, commentId: string, replyId: string): Promise<Reply> {
    const response = await api.put(`/posts/${postId}/comments/${commentId}/replies/${replyId}/like`);
    return response.data;
  },

  async deleteReply(postId: string, commentId: string, replyId: string): Promise<void> {
    await api.delete(`/posts/${postId}/comments/${commentId}/replies/${replyId}`);
  },

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<{
    posts: Post[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  }> {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUserFeed(page = 1, limit = 10): Promise<{
    posts: Post[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  }> {
    const response = await api.get(`/users/feed?page=${page}&limit=${limit}`);
    return response.data;
  }
}; 