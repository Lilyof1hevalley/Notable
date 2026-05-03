const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserController {
  // Get current user profile
  static getProfile(req, res) {
    try {
      const user = User.findPublicById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update current user profile
  static updateProfile(req, res) {
    try {
      const { name, display_name, gcal_url } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required!' });
      }
      const user = User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      User.updateProfile(req.userId, name, display_name, gcal_url || null);
      res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      if (!current_password || !new_password) {
        return res.status(400).json({ message: 'Current password and new password are required!' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters!' });
      }

      const user = User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      const isValid = await bcrypt.compare(current_password, user.password_hash);
      if (!isValid) {
        return res.status(400).json({ message: 'Current password is incorrect!' });
      }

      const passwordHash = await bcrypt.hash(new_password, 10);
      User.updatePassword(req.userId, passwordHash);
      res.json({ message: 'Password updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = UserController;
