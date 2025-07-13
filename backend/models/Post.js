const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  body: {
    type: String,
    required: true,
    maxlength: 5000
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  restaurantName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true,
        maxlength: 500
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }]
}, {
  timestamps: true
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Ensure virtuals are serialized and ObjectIds are converted to strings
postSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Convert ObjectIds to strings in likes arrays
    if (ret.likes) {
      ret.likes = ret.likes.map(like => like.toString());
    }
    if (ret.comments) {
      ret.comments = ret.comments.map(comment => {
        if (comment.likes) {
          comment.likes = comment.likes.map(like => like.toString());
        }
        if (comment.replies) {
          comment.replies = comment.replies.map(reply => {
            if (reply.likes) {
              reply.likes = reply.likes.map(like => like.toString());
            }
            return reply;
          });
        }
        return comment;
      });
    }
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema); 