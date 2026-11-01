const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'ratna-user',
    password: 'ratna123',
    database: 'ecommerce'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
        return;
    }
    console.log('✅ Connected to the "ecommerce" database!');
});

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Password does not meet requirements.' });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email is already registered.' });
                return res.status(500).json({ message: 'Database error.' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// --- LOGIN ROUTE ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(400).json({ message: 'Email not found' });

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        res.status(200).json({ 
            message: 'Login successful!', 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    });
});

// --- UPDATE PROFILE ROUTE ---
app.put('/api/update-profile', (req, res) => {
    const { userId, newUsername } = req.body;
    if (!userId || !newUsername) return res.status(400).json({ message: "Missing required fields" });

    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    db.query(sql, [newUsername, userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(200).json({ message: 'Profile updated successfully!' });
    });
});

// --- GET ALL ADDRESSES FOR A USER ---
app.get('/api/addresses/:userId', (req, res) => {
    db.query('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY id DESC', [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(200).json(results);
    });
});

// --- SAVE OR UPDATE ADDRESS ---
app.post('/api/save-address', (req, res) => {
    const { id, userId, name, phone, city, street, postal } = req.body;

    if (!userId) return res.status(401).json({ message: 'User not logged in' });

    if (id) {
        // UPDATE
        const sql = `UPDATE user_addresses SET name=?, phone=?, city=?, street=?, postal=? WHERE id=? AND user_id=?`;
        db.query(sql, [name, phone, city, street, postal, id, userId], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating address' });
            res.status(200).json({ message: 'Address updated successfully!' });
        });
    } else {
        // INSERT NEW
        const sql = `INSERT INTO user_addresses (user_id, name, phone, city, street, postal) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sql, [userId, name, phone, city, street, postal], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error saving address' });
            res.status(201).json({ message: 'Address saved successfully!' });
        });
    }
});

// --- DELETE ADDRESS ---
app.delete('/api/delete-address/:id', (req, res) => {
    db.query('DELETE FROM user_addresses WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting address' });
        res.status(200).json({ message: 'Address deleted' });
    });
});
// --- CHECK CURRENT PASSWORD (For Live Validation) ---
app.post('/api/check-password', (req, res) => {
    const { userId, password } = req.body;
    
    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ isValid: false });
        
        const valid = await bcrypt.compare(password, results[0].password);
        res.json({ isValid: valid });
    });
});

// --- CHANGE PASSWORD ROUTE ---
app.put('/api/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1. Check if new password is same as old password
    if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
    }

    // 2. Validate new password rules
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'New password does not meet requirements.' });
    }

    // 3. Get the current user from the database
    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!validPassword) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // 4. Hash and save
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
            db.query(updateSql, [hashedNewPassword, userId], (err) => {
                if (err) return res.status(500).json({ message: 'Error updating password' });
                res.status(200).json({ message: 'Password changed successfully!' });
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });
});
// Start the server (MUST BE AT THE VERY BOTTOM)
app.listen(3000, () => {
    console.log('🚀 Backend server running on http://localhost:3000');
});