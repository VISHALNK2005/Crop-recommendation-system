const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');// ✅ Import progress routes
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('./config/db');

const app = express();
const port = 3000;

app.use(progressRoutes);


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'your-secret-key', // 🔒 Sync with Flask if used
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,        // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Debug logging
app.use((req, res, next) => {
    console.log(`📥 Request: ${req.method} ${req.url}`);
    console.log(`🟢 Session:`, req.session);
    next();
});

// Attach tools (JWT, Axios) to request for use in routes
app.use((req, res, next) => {
    req.jwt = jwt;
    req.axios = axios;
    next();
});

// 👇 ROUTES
app.use('/', authRoutes);
app.use('/api', progressRoutes);  // ✅ Mount crop progress APIs here

// Start server
app.listen(port, () => {
    console.log(`🚀 Node.js server running at http://127.0.0.1:${port}/`);
});
