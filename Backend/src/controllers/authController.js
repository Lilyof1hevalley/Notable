const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../repositories/userRepository');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    display_name: user.display_name
  };
}

function issueToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

class AuthController {
// Register a new user
  static async register(req, res) {
    try {
      const { name, email, password, display_name } = req.body;

// Check if email is already registered
      const existingUser = User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered!' });
      }

// Hash the password before saving
      const passwordHash = await bcrypt.hash(password, 10);

// Save user to database
      const userId = User.create(name, email, passwordHash, display_name);

      res.status(201).json({ message: 'Registration successful!', userId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

// Login an existing user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

// Check if user exists
      const user = User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password!' });
      }

// Validate password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid email or password!' });
      }

// Generate JWT token
      const token = issueToken(user);

      res.json({
        message: 'Login successful!',
        token,
        user: buildUserPayload(user)
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async google(req, res) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ message: 'Google credential is required!' });
      }

      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ message: 'Google authentication is not configured.' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload?.email || payload.email_verified === false) {
        return res.status(400).json({ message: 'Google account email is not verified.' });
      }

      const googleId = payload.sub;
      const email = payload.email.toLowerCase();
      const name = payload.name || email.split('@')[0];
      let user = User.findByGoogleId(googleId) || User.findByEmail(email);

      if (!user) {
        const userId = User.createGoogleUser(name, email, googleId, name);
        user = User.findById(userId);
      } else if (!user.google_id) {
        User.attachGoogleId(user.id, googleId);
        user = { ...user, google_id: googleId };
      }

      res.json({
        message: 'Google authentication successful!',
        token: issueToken(user),
        user: buildUserPayload(user)
      });
    } catch (error) {
      res.status(401).json({ message: 'Google authentication failed.', error: error.message });
    }
  }
}

module.exports = AuthController;
