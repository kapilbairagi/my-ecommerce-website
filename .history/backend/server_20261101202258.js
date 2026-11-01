const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// ADD THESE TWO IMPORTS FOR IMAGE UPLOADING
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// --- SERVE UPLOADED IMAGES PUBLICLY ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MULTER SETUP (FOR PRODUCT IMAGES) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        // Create a unique filename so images don't overwrite each other
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

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

// ... [KEEP ALL YOUR EXISTING USER ROUTES HERE: /api/register, /api/login, /api/addresses, etc.] ...

/* =========================================
   ADD THESE NEW PRODUCT ROUTES AT THE BOTTOM
   ========================================= */

// --- UPLOAD NEW PRODUCT ---
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        
        // 1. Add old_price here
        const { title, price, old_price, category, badge, description } = req.body;
        
        const image_url = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : '';
        const targets = Array.isArray(req.body.targets) ? req.body.targets.join(',') : (req.body.targets || '');

        // 2. Add old_price to the SQL query
        const sql = `INSERT INTO products (title, price, old_price, category, badge, description, image_url, targets) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // 3. Add old_price to the values array (send null if empty)
        db.query(sql, [title, price, old_price || null, category, badge, description, image_url, targets], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json({ message: "Product added successfully", id: result.insertId });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// --- GET ALL PRODUCTS (For the frontend to render) ---
app.get('/api/products', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const sql = `SELECT * FROM products ORDER BY id DESC`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        // Convert the comma-separated 'targets' string back into an array for the frontend
        const formattedProducts = results.map(p => ({
            ...p,
            targets: p.targets ? p.targets.split(',') : []
        }));
        
        res.status(200).json(formattedProducts);
    });
});

// Start the server (MUST BE AT THE VERY BOTTOM)
app.listen(3000, () => {
    console.log('🚀 Backend server running on http://localhost:3000');
});