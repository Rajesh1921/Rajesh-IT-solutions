const express = require('express');
const sql = require('mssql');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
// Remove the 'const config' line entirely
app.post('/submit-contact', async (req, res) => {
    try {
        // This force-feeds the string directly to the driver
        let pool = await sql.connect(process.env.DB_CONNECTION_STRING); 
        const request = new sql.Request(pool);
        await pool.request()
            .input('FullName', sql.NVarChar, req.body.name)
            .input('Email', sql.NVarChar, req.body.email)
            .input('Message', sql.NVarChar, req.body.message)
            .query('INSERT INTO Contacts (FullName, Email, Message) VALUES (@FullName, @Email, @Message)');
        res.send("<h1>Message Received, Mawa!</h1>");
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
