const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const signRoute = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://ayush007arm_db_user:Y5rvqumTzWKGEmbb@cluster0.2t5rbgi.mongodb.net/contact')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
signRoute.use(bodyParser.urlencoded({ extended: true }));

// GET form
signRoute.get('/sign_up', (req, res) => {
  res.send(`
    <h1 style="text-align:center;">Register Yourself</h1>
    <form action="/submit" method="post" style="max-width:400px;margin:30px auto;padding:24px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <label>Name:</label>
        <input type="text" name="name" required style="width:100%;padding:8px;margin-bottom:16px;">
      <label>Email:</label>
        <input type="email" name="email" required style="width:100%;padding:8px;margin-bottom:16px;">
      <label>Phone:</label>
        <input type="text" name="phone" required style="width:100%;padding:8px;margin-bottom:16px;">
        <input type="submit" value="Submit" style="width:100%;padding:10px;background:#007bff;color:#fff;border:none;border-radius:4px;">
    </form>
  `);
});


// POST form
signRoute.post('/submit', (req, res) => {
  const { name, email, phone } = req.body;

  const newContact = new Contact({ name, email, phone });

  newContact.save()
    .then(() => {
      res.send('✅ Contact data saved!');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('❌ Error saving data');
    });
});

module.exports = signRoute;
