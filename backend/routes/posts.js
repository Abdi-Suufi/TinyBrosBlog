const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getFileUrl } = require('../config/s3');

const router = express.Router();

// Create a new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, body, rating, restaurantName, location, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const post = new Post({
      author: req.user._id,
      title,
      body,
      image: req.file.key, // S3 file key
      rating: parseInt(rating),
      restaurantName,
      location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await post.save();
    
    // Populate author info
    await post.populate('author', 'username displayName profilePicture');
    
    // Convert S3 keys to URLs for response
    const postResponse = post.toObject();
    postResponse.image = getFileUrl(post.image);
    if (postResponse.author.profilePicture) {
      postResponse.author.profilePicture = getFileUrl(postResponse.author.profilePicture);
    }
    
    res.status(201).json(postResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username displayName profilePicture')
      .populate('comments.user', 'username displayName profilePicture')
      .populate('comments.replies.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    // Convert S3 keys to URLs for all posts
    const postsWithUrls = posts.map(post => {
      const postObj = typeof post.toObject === 'function' ? post.toObject({ virtuals: true }) : post;
      postObj.image = getFileUrl(postObj.image);
      if (postObj.author.profilePicture) {
        postObj.author.profilePicture = getFileUrl(postObj.author.profilePicture);
      }
      if (postObj.comments) {
        postObj.comments = postObj.comments.map(comment => ({
          ...comment,
          user: {
            ...comment.user,
            profilePicture: comment.user.profilePicture ? getFileUrl(comment.user.profilePicture) : null
          }
        }));
      }
      return postObj;
    });

    res.json({
      posts: postsWithUrls,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username displayName profilePicture')
      .populate('comments.user', 'username displayName profilePicture')
      .populate('comments.replies.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    // Convert S3 keys to URLs for all posts
    const postsWithUrls = posts.map(post => {
      const postObj = typeof post.toObject === 'function' ? post.toObject({ virtuals: true }) : post;
      postObj.image = getFileUrl(postObj.image);
      if (postObj.author.profilePicture) {
        postObj.author.profilePicture = getFileUrl(postObj.author.profilePicture);
      }
      if (postObj.comments) {
        postObj.comments = postObj.comments.map(comment => ({
          ...comment,
          user: {
            ...comment.user,
            profilePicture: comment.user.profilePicture ? getFileUrl(comment.user.profilePicture) : null
          }
        }));
      }
      return postObj;
    });

    res.json(postsWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username displayName profilePicture')
      .populate('comments.user', 'username displayName profilePicture')
      .populate('comments.replies.user', 'username displayName profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Convert S3 keys to URLs
    const postResponse = typeof post.toObject === 'function' ? post.toObject() : post;
    postResponse.image = getFileUrl(postResponse.image);
    if (postResponse.author.profilePicture) {
      postResponse.author.profilePicture = getFileUrl(postResponse.author.profilePicture);
    }
    if (postResponse.comments) {
      postResponse.comments = postResponse.comments.map(comment => ({
        ...comment,
        user: {
          ...comment.user,
          profilePicture: comment.user.profilePicture ? getFileUrl(comment.user.profilePicture) : null
        }
      }));
    }

    res.json(postResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, body, rating, restaurantName, location, tags } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.body = body || post.body;
    post.rating = rating ? parseInt(rating) : post.rating;
    post.restaurantName = restaurantName || post.restaurantName;
    post.location = location || post.location;
    post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;

    await post.save();
    
    await post.populate('author', 'username displayName profilePicture');
    await post.populate('comments.user', 'username displayName profilePicture');
    await post.populate('comments.replies.user', 'username displayName profilePicture');
    
    // Convert S3 keys to URLs
    const postResponse = typeof post.toObject === 'function' ? post.toObject() : post;
    postResponse.image = getFileUrl(postResponse.image);
    if (postResponse.author.profilePicture) {
      postResponse.author.profilePicture = getFileUrl(postResponse.author.profilePicture);
    }
    if (postResponse.comments) {
      postResponse.comments = postResponse.comments.map(comment => ({
        ...comment,
        user: {
          ...comment.user,
          profilePicture: comment.user.profilePicture ? getFileUrl(comment.user.profilePicture) : null
        }
      }));
    }
    
    res.json(postResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    
    // Populate author and comments for the response
    await post.populate('author', 'username displayName profilePicture');
    await post.populate('comments.user', 'username displayName profilePicture');
    await post.populate('comments.replies.user', 'username displayName profilePicture');
    
    // Convert S3 keys to URLs
    const postResponse = typeof post.toObject === 'function' ? post.toObject() : post;
    postResponse.image = getFileUrl(postResponse.image);
    if (postResponse.author.profilePicture) {
      postResponse.author.profilePicture = getFileUrl(postResponse.author.profilePicture);
    }
    if (postResponse.comments) {
      postResponse.comments = postResponse.comments.map(comment => ({
        ...comment,
        user: {
          ...comment.user,
          profilePicture: comment.user.profilePicture ? getFileUrl(comment.user.profilePicture) : null
        }
      }));
    }
    
    res.json(postResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.unshift({
      user: req.user._id,
      text,
      likes: [],
      replies: []
    });

    await post.save();
    
    // Populate the new comment's user info
    await post.populate('comments.user', 'username displayName profilePicture');
    
    // Convert the comment's user profile picture URL
    const commentResponse = typeof post.comments[0].toObject === 'function' ? post.comments[0].toObject() : post.comments[0];
    commentResponse.user = {
      ...commentResponse.user,
      profilePicture: commentResponse.user.profilePicture ? getFileUrl(commentResponse.user.profilePicture) : null
    };
    
    res.json(commentResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike comment
router.put('/:id/comments/:commentId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user._id);
    }

    await post.save();
    
    // Populate comment user info
    await post.populate('comments.user', 'username displayName profilePicture');
    await post.populate('comments.replies.user', 'username displayName profilePicture');
    
    const updatedComment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );
    
    // Convert URLs
    const commentResponse = typeof updatedComment.toObject === 'function' ? updatedComment.toObject() : updatedComment;
    commentResponse.user = {
      ...commentResponse.user,
      profilePicture: commentResponse.user.profilePicture ? getFileUrl(commentResponse.user.profilePicture) : null
    };
    
    if (commentResponse.replies) {
      commentResponse.replies = commentResponse.replies.map(reply => ({
        ...reply,
        user: {
          ...reply.user,
          profilePicture: reply.user.profilePicture ? getFileUrl(reply.user.profilePicture) : null
        }
      }));
    }
    
    res.json(commentResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to comment
router.post('/:id/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.unshift({
      user: req.user._id,
      text,
      likes: []
    });

    await post.save();
    
    // Populate reply user info
    await post.populate('comments.replies.user', 'username displayName profilePicture');
    
    const updatedComment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );
    
    const newReply = updatedComment.replies[0];
    
    // Convert URLs
    const replyResponse = typeof newReply.toObject === 'function' ? newReply.toObject() : newReply;
    replyResponse.user = {
      ...replyResponse.user,
      profilePicture: replyResponse.user.profilePicture ? getFileUrl(replyResponse.user.profilePicture) : null
    };
    
    res.json(replyResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike reply
router.put('/:id/comments/:commentId/replies/:replyId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.find(
      reply => reply._id.toString() === req.params.replyId
    );

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const likeIndex = reply.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      reply.likes.splice(likeIndex, 1);
    } else {
      // Like
      reply.likes.push(req.user._id);
    }

    await post.save();
    
    // Populate reply user info
    await post.populate('comments.replies.user', 'username displayName profilePicture');
    
    const updatedComment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );
    
    const updatedReply = updatedComment.replies.find(
      reply => reply._id.toString() === req.params.replyId
    );
    
    // Convert URLs
    const replyResponse = typeof updatedReply.toObject === 'function' ? updatedReply.toObject() : updatedReply;
    replyResponse.user = {
      ...replyResponse.user,
      profilePicture: replyResponse.user.profilePicture ? getFileUrl(replyResponse.user.profilePicture) : null
    };
    
    res.json(replyResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment (only comment author can delete)
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.commentId);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove reply
router.delete('/:id/comments/:commentId/replies/:replyId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.find(
      reply => reply._id.toString() === req.params.replyId
    );

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user owns the reply (only reply author can delete)
    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const removeIndex = comment.replies
      .map(reply => reply._id.toString())
      .indexOf(req.params.replyId);

    comment.replies.splice(removeIndex, 1);
    await post.save();

    res.json({ message: 'Reply removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 