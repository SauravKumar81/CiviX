const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate fields exist
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if username unique
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Check if email unique
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
      role: 'user'
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Authentication
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken, autoRegister = false } = req.body;

    if (!idToken) {
      console.log('Google Auth Error: Missing idToken');
      return res.status(400).json({ success: false, error: 'Google ID token required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('SERVER CONFIG ERROR: GOOGLE_CLIENT_ID is not set in .env');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    console.log('Verifying Google Token...');
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    console.log(`Google Auth attempt for: ${email}`);

    // Check if user exists
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      if (!autoRegister) {
        console.log(`New user detected (${email}), redirecting to signup.`);
        return res.status(404).json({
          success: false,
          newUser: true,
          email,
          name,
          error: 'No account found. Please finish signing up.'
        });
      }

      console.log(`Auto-registering new user: ${email}`);
      // Generate safe username
      // Truncate name to 15 chars to ensure total length <= 20 with suffix
      let baseUsername = (name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
      let randomSuffix = Math.random().toString(36).substring(2, 6);
      let newUsername = `${baseUsername}${randomSuffix}`;

      // Check for collisions
      let collision = await User.findOne({ username: newUsername });
      while (collision) {
        randomSuffix = Math.random().toString(36).substring(2, 6);
        newUsername = `${baseUsername}${randomSuffix}`;
        collision = await User.findOne({ username: newUsername });
      }

      user = await User.create({
        name: name || 'Google User',
        email,
        username: newUsername,
        password: Math.random().toString(36).substring(2, 10) + 'A1!',
        avatar: picture || undefined
      });

      console.log(`User created successfully: ${user.username}`);
      return sendTokenResponse(user, 201, res, true);
    } 

    // Update avatar if missing or generic
    if (picture && (!user.avatar || user.avatar.includes('api.dicebear.com'))) {
      user.avatar = picture;
      await user.save();
      console.log(`Updated avatar for user: ${email}`);
    }

    console.log(`Login successful for user: ${email}`);
    sendTokenResponse(user, 200, res, false);
  } catch (err) {
    console.error('GOOGLE_AUTH_ERROR:', err.message);
    res.status(400).json({ 
      success: false, 
      error: 'Google authentication failed',
      details: err.message 
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};

    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.bio) fieldsToUpdate.bio = req.body.bio;
    if (req.body.location) fieldsToUpdate.location = req.body.location;

    // Check if username is being updated and is unique
    if (req.body.username) {
      if (req.body.username !== req.user.username) {
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'Username already taken' });
        }
        fieldsToUpdate.username = req.body.username;
      }
    }

    // Check for uploaded file
    if (req.file) {
      fieldsToUpdate.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/auth/deleteaccount
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, isNewUser = false) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.status(statusCode).json({
    success: true,
    token,
    newUser: isNewUser
  });
};
