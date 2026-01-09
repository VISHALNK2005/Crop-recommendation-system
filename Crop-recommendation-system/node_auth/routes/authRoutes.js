const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('../config/db');
const axios = require('axios');

const router = express.Router();

router.use((req, res, next) => {
    console.log("🟢 Session Data:", req.session);
    next();
});

// Show login page
router.get('/', (req, res) => {
    res.render('login');
});

// Show register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register handler
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password required.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('❌ Registration error:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send("Username already exists.");
                }

                return res.status(500).send("Error registering user.");
            }

            res.send("Registered successfully");
        });
    } catch (err) {
        console.error("❌ Hashing error:", err);
        res.status(500).send("Server error.");
    }
});

// Login handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('❌ Login error:', err);
            return res.status(500).send('Login error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).send('Invalid password');

        // ✅ Store session data
        req.session.id = user.id;
        req.session.username = user.username;

        req.session.save(err => {
            if (err) {
                console.error('❌ Session save error:', err);
                return res.status(500).send('Session error');
            }

            // If crop previously saved, return it
            return res.json({
                success: true,
                crop: user.crop_name || null,
                step: user.current_step || 1,
                redirectTo: 'http://127.0.0.1:5000/index'
            });
        });
    });
});

// Logout route
router.get('/logout', (req, res) => {
    const username = req.session.username;

    req.session.destroy(err => {
        if (err) {
            console.error('❌ Session destroy error:', err);
        }

        axios.get('http://127.0.0.1:5000/logout', { withCredentials: true })
            .then(() => console.log(`✅ Flask session cleared for ${username}`))
            .catch(error => console.error('❌ Flask logout failed:', error.message))
            .finally(() => res.redirect('/'));
    });
});

// API to get crop progress
router.get('/api/get_progress', (req, res) => {
    const id = req.session.id;

    if (!id) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    db.query('SELECT crop_name, current_step FROM users WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: 'DB error or user not found' });
        }

        const { crop_name, current_step } = results[0];
        res.json({ crop_name, current_step: step || 1 });
    });
});

// API to update crop progress
router.post('/api/update_progress', (req, res) => {
    const id = req.session.id;

    if (!id) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const { crop_name, current_step } = req.body;

    const sql = 'UPDATE users SET crop_name = ?, step = ? WHERE id = ?';
    db.query(sql, [crop_name, current_step, id], (err, result) => {
        if (err) {
            console.error('❌ Failed to update crop/step:', err);
            return res.status(500).json({ error: 'Update failed' });
        }

        res.json({ success: true });
    });
});

// API to test session
router.get('/api/check-session', (req, res) => {
    res.json({
        loggedIn: !!req.session.id,
        session: req.session
    });
});

module.exports = router;
