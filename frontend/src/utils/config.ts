// Backend URL configuration
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Helper function to get full URL for backend assets (images, etc.)
export const getBackendAssetUrl = (path: string): string => {
  if (!path) return '';
  
  // If path already starts with http, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BACKEND_URL}/${cleanPath}`;
};

// Helper function to get API URL
export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || `${BACKEND_URL}/api`;
}; 