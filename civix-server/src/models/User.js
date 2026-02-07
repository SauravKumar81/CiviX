const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Citizen'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bookmarks: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Report'
  }],
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio can not be more than 500 characters']
  },
  avatar: {
    type: String,
    default: function() {
      // Generate a random avatar based on the user's name or a random string if name isn't set yet
      const seed = this.name || Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
    }
  },
  location: {
    type: String
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
