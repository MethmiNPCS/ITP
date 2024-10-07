// MongoDB password = zoPvf0NUih9wBU3F
// Database name = cluster0
// MongoDB project name = farm-systemDB

// Import required modules and libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const twilio = require('twilio');

// Import Routes
const stockrouter = require("./Routes/StockRoutes");  // Stock
const orderRoutes = require("./Routes/OrderRoutes"); // Order
const supplierRoutes = require("./Routes/SupplierRoutes");// Supplier
const orderemailRoutes = require("./Routes/EmailRoutes"); // Email
const tasksRoute = require("./Routes/tasksRoute"); // Task
const productRouter = require("../backend/Routes/ProductRoutes"); // Product
const animalrouter = require("./Routes/AnimalRoutes");  // Animal
const treatmentrouter = require("./Routes/TreatmentRoutes"); // Treatment
const employeeRouter = require('./Routes/EmployeeRoutes'); // Employee
const financrouter = require("./Routes/financ"); // Finance

// Models
const ImgModel = require('./Model/ImgModel'); 
const Treatment = require('./Model/TreatmentModel');

// Middleware and Configurations
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 

// Serve static files from the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Set up Multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Connect Database and Start Server
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
})
.catch((err) => console.log(err));

// Use routes
app.use("/stocks", stockrouter); // Stock
app.use("/orders", orderRoutes); // Orders
app.use("/suppliers", supplierRoutes); // Supplier
app.use("/orderemails", orderemailRoutes);  // EmailOrder
app.use("/tasks", tasksRoute); // Tasks
app.use('/products', productRouter); // Product
app.use("/animals", animalrouter); // Animal
app.use("/treatments", treatmentrouter); // Treatment
app.use('/employees', employeeRouter); //Employee
app.use("/finance", financrouter); // Finance

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Get SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Get Auth Token from .env
const client = twilio(accountSid, authToken);

// Routes for Image Upload and Retrieval
app.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded!' });
    }
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ status: 'error', message: 'Name and price are required!' });
    }
    const newImage = new ImgModel({
      image: req.file.filename,
      name,
      price
    });
    await newImage.save();
    res.json({ status: 'ok', message: 'Image uploaded successfully!' });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ status: 'error', message: 'Image upload failed!' });
  }
});

// Fetch all images from the database
app.get('/getImage', async (req, res) => {
  try {
    const images = await ImgModel.find();
    res.json({ status: 'ok', data: images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve images' });
  }
});

// Register route
require("./Model/Register");
const User = mongoose.model("Register");
app.post("/register", async (req, res) => {
  const { name, gmail, password } = req.body;
  try {
    await User.create({ name, gmail, password });
    res.send({ status: "ok" });
  } catch (err) {
    res.send({ status: "error" });
  }
});

// Delete an image
app.delete('/deleteImage/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedImage = await ImgModel.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ status: 'error', message: 'Image not found!' });
    }
    res.json({ status: 'ok', message: 'Image deleted successfully!' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete image' });
  }
});

// Function to Send WhatsApp Message via Twilio
const sendWhatsAppMessage = (treatment) => {
    const messageBody = `Reminder for Treatment ID: ${treatment.treatmentID}\n` +
                        `Description: ${treatment.planDescription}\n` +
                        `Animals: ${treatment.animalIDs.join(', ')}\n` +
                        `Medicines: ${treatment.medicines.map(med => `${med.name} (${med.dose})`).join(', ')}` +
                        `\nScheduled at: ${treatment.treatmentTime.join(', ')}`;
    
    console.log('Attempting to send message:', messageBody);

    client.messages
        .create({
            body: messageBody,
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.TEST_WHATSAPP_TO,
        })
        .then(message => console.log('WhatsApp message sent:', message.sid))
        .catch(err => console.error('Error sending WhatsApp message:', err));
};

// Cron Job for Treatment Notifications
cron.schedule('* * * * *', async () => { 
    const treatments = await Treatment.find();
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    console.log(`Current Time: ${currentTime}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    treatments.forEach(treatment => {
        const treatmentStartDate = new Date(treatment.startDate);
        const treatmentEndDate = new Date(treatment.endDate);
        treatmentStartDate.setHours(0, 0, 0, 0);
        treatmentEndDate.setHours(0, 0, 0, 0);

        console.log(`Checking treatment: ${treatment.planDescription}`);

        if (today >= treatmentStartDate && today <= treatmentEndDate) {
            if (treatment.treatmentTime.includes(currentTime)) {
                console.log(`Sending WhatsApp message for treatment: ${treatment.planDescription}`);
                sendWhatsAppMessage(treatment);
            }
        }
    });
});

// Login route
app.post("/login", async (req, res) => {
    const { gmail, password } = req.body;
    try {
      const user = await User.findOne({ gmail });
      if (!user) {
        return res.json({ status: "error", message: "User not found" });
      }
      if (user.password === password) {
        return res.json({ status: "ok" });
      } else {
        return res.json({ status: "error", message: "Incorrect Password" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Server Error" });
    }
});
