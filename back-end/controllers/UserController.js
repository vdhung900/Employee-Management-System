const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const users = await User.find();

        // Find the user by username
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing password' });

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create a JWT token
            const token = jwt.sign({ userId: user._id, username: user.username, role: user.role  }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie("token", token, {
                httpOnly: true,   // Prevent access from JavaScript
                secure: true,     // Use only in HTTPS, set to false when in development to test in thunder client 
                sameSite: "Strict", // Prevent CSRF attacks
              });
            res.json({ message: 'Login successful' });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    try{
        res.cookie("token", "", { 
            httpOnly: true, 
            secure: true, // Use in production with HTTPS
            sameSite: "Strict", 
            expires: new Date(0) // Expire the cookie immediately
          });
          res.status(200).json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
  };

  exports.getUserProfile = async (req, res) => {
    try {
        const id = req.user.userId;
        const user = await User.findById(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  };
  

exports.register = async (req, res) => {
    try {
        const { username, password, role} = req.body;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({ username, password: hashedPassword, role});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
