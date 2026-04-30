const User = require('../models/userModel');

class UserController {
  // Get current user profile
  static getProfile(req, res) {
    try {
      const user = User.findById(req.userId);
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
      const { name, display_name } = req.body;

      // Check if user exists
      const user = User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      User.updateProfile(req.userId, name, display_name);

      res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = UserController;