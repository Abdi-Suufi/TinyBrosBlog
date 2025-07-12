const { upload: s3Upload, getFileUrl } = require('../config/s3');

// Export the S3 upload middleware
module.exports = s3Upload;

// Export the getFileUrl function for use in routes
module.exports.getFileUrl = getFileUrl; 