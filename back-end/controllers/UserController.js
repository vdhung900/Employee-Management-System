const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { 
            userId: user._id, 
            username: user.username,
            email: user.email,
            role: user.role  
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role = 'employee' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email.toLowerCase() ? 
                    'Email already registered' : 
                    'Username already taken' 
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({ 
            username,
            email: email.toLowerCase(), 
            password: hashedPassword, 
            role 
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ 
            $or: [
                { username: username },
                { email: username.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Return tokens and user info in response
        res.json({ 
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find user
        const user = await User.findOne({ 
            _id: decoded.userId,
            refreshToken: refreshToken
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        // Return new tokens
        res.json({ 
            message: 'Token refreshed successfully',
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

exports.logout = async (req, res) => {
    try {
        // Clear refresh token in database
        const user = await User.findById(req.user.userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
