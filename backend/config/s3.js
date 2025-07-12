const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Check if AWS credentials are configured
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET) {
  console.warn('⚠️  AWS S3 credentials not configured. Image uploads will not work.');
  console.warn('Please set up your .env file with AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET');
}

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-2'
});

// Create S3 instance
const s3 = new AWS.S3();

// Configure multer for S3 upload
let upload;

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET) {
  // S3 configuration
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // Generate unique filename
        const fileName = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, fileName);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
} else {
  // Fallback to local storage when S3 is not configured
  console.log('📁 Using local file storage (uploads/ folder)');
  upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, fileName);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
}

// Function to delete file from S3
const deleteFileFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey
    };
    
    await s3.deleteObject(params).promise();
    console.log(`File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
  }
};

// Function to get file URL (S3 or local)
const getFileUrl = (fileKey) => {
  if (!fileKey) return null;
  
  // If it's already a full URL, return as is
  if (fileKey.startsWith('http')) {
    return fileKey;
  }
  
  // If S3 is configured, return S3 URL
  if (process.env.AWS_S3_BUCKET) {
    const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'eu-west-2'}.amazonaws.com/${fileKey}`;
    console.log('🔗 Generated S3 URL:', s3Url);
    return s3Url;
  }
  
  // Otherwise, return local file URL
  const localUrl = `/uploads/${fileKey}`;
  console.log('🔗 Generated local URL:', localUrl);
  return localUrl;
};

module.exports = {
  upload,
  s3,
  deleteFileFromS3,
  getFileUrl
}; 