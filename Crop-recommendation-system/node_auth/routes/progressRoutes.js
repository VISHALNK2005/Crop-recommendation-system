const express = require('express');
const db = require('../config/db');

const router = express.Router();

// View crop progress page
router.get('/crop-progress', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/');
    }

    const sql = 'SELECT crop, step FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error("❌ Error fetching crop progress:", err);
            return res.status(500).send("Error loading crop progress.");
        }

        const { crop, step } = results[0];

        res.render('crop_progress', {
            username: req.session.username,
            cropName: crop || 'No Crop Selected Yet',
            currentStep: step || 1
        });
    });
});

// API: get current crop + step (for frontend)
router.get('/api/crop-progress', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const sql = 'SELECT crop, step FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('❌ DB error fetching progress:', err);
            return res.status(500).json({ error: 'Failed to get progress' });
        }

        const { crop, step } = results[0];
        res.json({ crop, currentStep: step });
    });
});

// API: update progress (optional if not handled from authRoutes)
router.post('/api/crop-progress', (req, res) => {
    const userId = req.session.userId;
    const { crop, currentStep } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const sql = 'UPDATE users SET crop = ?, step = ? WHERE id = ?';
    db.query(sql, [crop, currentStep, userId], (err) => {
        if (err) {
            console.error('❌ Error updating crop progress:', err);
            return res.status(500).json({ error: 'Update failed' });
        }

        res.json({ success: true });
    });
});

module.exports = router;
