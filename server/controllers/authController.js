const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    // Get user details from request
    const { name, email, password, role } = req.body;
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    // Create and save user
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  // Create JWT token
  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
};

// Verify JWT token (for session restoration)
exports.verify = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user in DB (optional, for up-to-date info)
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 