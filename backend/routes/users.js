const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getFileUrl } = require('../config/s3');

const router = express.Router();

// Get user's feed (posts from followed users) - must come before /:id routes
router.get('/feed', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    
    const posts = await Post.find({
      author: { $in: user.following }
    })
      .populate('author', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      author: { $in: user.following }
    });

    // Convert S3 keys to URLs for posts
    const postsWithUrls = posts.map(post => {
      const postObj = post.toObject();
      postObj.image = getFileUrl(postObj.image);
      if (postObj.author.profilePicture) {
        postObj.author.profilePicture = getFileUrl(postObj.author.profilePicture);
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

// Get user's following list - must come before /:id routes
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username displayName profilePicture followers')
      .select('following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert profile picture URLs for following users
    const followingWithUrls = user.following.map(followingUser => {
      const userObj = followingUser.toObject();
      if (userObj.profilePicture) {
        userObj.profilePicture = getFileUrl(userObj.profilePicture);
      }
      return userObj;
    });
    
    res.json(followingWithUrls);
  } catch (error) {
    console.error('Error in following endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts - must come before /:id routes
router.get('/:id/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: req.params.id });

    // Convert S3 keys to URLs for posts
    const postsWithUrls = posts.map(post => {
      const postObj = post.toObject();
      postObj.image = getFileUrl(postObj.image);
      if (postObj.author.profilePicture) {
        postObj.author.profilePicture = getFileUrl(postObj.author.profilePicture);
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

// Search users - must come before /:id routes
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
      .select('username displayName profilePicture')
      .limit(10);

    // Convert profile picture URLs for search results
    const usersWithUrls = users.map(user => {
      const userObj = user.toObject();
      if (userObj.profilePicture) {
        userObj.profilePicture = getFileUrl(userObj.profilePicture);
      }
      return userObj;
    });
    
    res.json(usersWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile - general route comes last
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username displayName profilePicture')
      .populate('following', 'username displayName profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert profile picture URLs for user profile
    const userResponse = user.toObject();
    if (userResponse.profilePicture) {
      userResponse.profilePicture = getFileUrl(userResponse.profilePicture);
    }
    if (userResponse.followers) {
      userResponse.followers = userResponse.followers.map(follower => {
        const followerObj = follower.toObject();
        if (followerObj.profilePicture) {
          followerObj.profilePicture = getFileUrl(followerObj.profilePicture);
        }
        return followerObj;
      });
    }
    if (userResponse.following) {
      userResponse.following = userResponse.following.map(followingUser => {
        const followingObj = followingUser.toObject();
        if (followingObj.profilePicture) {
          followingObj.profilePicture = getFileUrl(followingObj.profilePicture);
        }
        return followingObj;
      });
    }
    
    res.json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const { displayName, bio } = req.body;
    
    const updateFields = {};
    if (displayName) updateFields.displayName = displayName;
    if (bio !== undefined) updateFields.bio = bio;
    if (req.file) {
      updateFields.profilePicture = req.file.key; // S3 file key
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    // Convert S3 key to URL for response
    const userResponse = user.toObject();
    if (userResponse.profilePicture) {
      userResponse.profilePicture = getFileUrl(userResponse.profilePicture);
    }

    res.json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.put('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      following: !isFollowing,
      message: isFollowing ? 'Unfollowed' : 'Followed'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router; 