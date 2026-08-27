const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection state
let isMockMode = false;

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.warn("⚠️ WARNING: MONGO_URI is not defined in the .env file.");
    console.warn("🚀 Server will run in MOCK DATABASE mode. Data will not persist.");
    isMockMode = true;
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log("🔌 MongoDB Cloud connected successfully!"))
        .catch(err => {
            console.error("❌ MongoDB connection error:", err.message);
            console.warn("🚀 Falling back to MOCK DATABASE mode.");
            isMockMode = true;
        });
}

// Mongoose Schema & Model
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// In-memory array for mock database mode
const mockContacts = [];

// API Route: Submit Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address." });
        }

        if (isMockMode) {
            const newContact = {
                _id: new mongoose.Types.ObjectId().toString(),
                name,
                email,
                message,
                createdAt: new Date()
            };
            mockContacts.unshift(newContact); // Add to beginning of mock array
            console.log("💾 [Mock DB Saved]:", newContact);
            return res.json({ success: true, message: "Message received (Mock Database Mode)." });
        }

        const contact = new Contact({ name, email, message });
        await contact.save();
        console.log("💾 [DB Saved]: Message from", name);
        res.json({ success: true, message: "Your message has been received! Thank you." });

    } catch (err) {
        console.error("Error saving contact:", err.message);
        res.status(500).json({ error: "Failed to submit message: " + err.message });
    }
});

// API Route: Get All Contact Submissions (Admin)
app.get('/api/contacts', async (req, res) => {
    try {
        const clientPasscode = req.query.passcode || req.headers['x-admin-passcode'];
        const adminPasscode = process.env.ADMIN_PASSCODE || 'RajeshSecurePasscode2026';

        if (clientPasscode !== adminPasscode) {
            return res.status(401).json({ error: "Unauthorized. Invalid passcode." });
        }

        if (isMockMode) {
            return res.json(mockContacts);
        }

        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages: " + err.message });
    }
});

// API Route: Delete a Contact Submission (Admin)
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const clientPasscode = req.query.passcode || req.headers['x-admin-passcode'];
        const adminPasscode = process.env.ADMIN_PASSCODE || 'RajeshSecurePasscode2026';

        if (clientPasscode !== adminPasscode) {
            return res.status(401).json({ error: "Unauthorized. Invalid passcode." });
        }

        const contactId = req.params.id;

        if (isMockMode) {
            const index = mockContacts.findIndex(c => c._id === contactId);
            if (index !== -1) {
                mockContacts.splice(index, 1);
                return res.json({ success: true, message: "Contact message deleted (Mock DB)." });
            }
            return res.status(404).json({ error: "Message not found." });
        }

        const result = await Contact.findByIdAndDelete(contactId);
        if (!result) {
            return res.status(404).json({ error: "Message not found." });
        }

        res.json({ success: true, message: "Contact message deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete message: " + err.message });
    }
});

// Fallback Route: Serve main site
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`==================================================`);
    console.log(`🚀 Rajesh IT Solutions server running on port ${port}`);
    console.log(`🌐 Open in browser: http://localhost:${port}`);
    console.log(`==================================================`);
});


