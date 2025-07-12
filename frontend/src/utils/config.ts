// Backend URL configuration
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Helper function to get full URL for backend assets (images, etc.)
export const getBackendAssetUrl = (path: string): string => {
  if (!path) return '';
  
  // If path already starts with http, return as is (S3 URLs)
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's an S3 key (starts with 'uploads/'), construct S3 URL
  if (path.startsWith('uploads/')) {
    const s3BucketUrl = process.env.REACT_APP_S3_BUCKET_URL;
    if (s3BucketUrl) {
      return `${s3BucketUrl}/${path}`;
    }
    // Fallback if S3_BUCKET_URL is not set
    const bucketName = process.env.REACT_APP_AWS_S3_BUCKET_NAME;
    const region = process.env.REACT_APP_AWS_REGION || 'us-east-1';
    if (bucketName) {
      return `https://${bucketName}.s3.${region}.amazonaws.com/${path}`;
    }
  }
  
  // Fallback to backend URL for local development
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BACKEND_URL}/${cleanPath}`;
};

// Helper function to get API URL
export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || `${BACKEND_URL}/api`;
}; 