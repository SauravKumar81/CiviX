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
    default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' // Default avatar
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
