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


// Middlewear and Configurations
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));


// Use routes
app.use("/stocks", stockrouter); // Stock
app.use("/orders",orderRoutes); // Orders
app.use("/suppliers", supplierRoutes); // Supplier
app.use("/orderemails", orderemailRoutes);  // EmailOrder
app.use("/tasks", tasksRoute); // Tasks
app.use('/products', productRouter); // Product
app.use("/animals",animalrouter); // Animal
app.use("/treatments",treatmentrouter); // Treatment
app.use('/employees', employeeRouter); //Employee
app.use("/finance", financrouter); // Finance

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Get SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Get Auth Token from .env
const client = twilio(accountSid, authToken);

//visu img
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up Multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes for Image Upload and Retrieval
app.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded!' });
    }

    // Extract additional fields (name and price) from the request body
    const {name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ status: 'error', message: 'Name and price are required!' });
    }

    // Create a new image record in the database with image, name, and price
    const newImage = new ImgModel({
      image: req.file.filename, // Save the filename in the database
      name,                     // Save the name
      price                     // Save the price
    });

    await newImage.save();

    res.json({ status: 'ok', message: 'Image uploaded successfully!' });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ status: 'error', message: 'Image upload failed!' });
  }
});

app.get('/getImage', async (req, res) => {
  try {
    // Fetch all images from the database
    const images = await ImgModel.find();
    res.json({ status: 'ok', data: images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve images' });
  }
});

// Register route (as per your original app.js)
require("./Model/Register");
const User = mongoose.model("Register");

app.post("/register", async (req, res) => {
  const { name, gmail, password } = req.body;
  try {
    await User.create({
      name,
      gmail,
      password,
    });
    res.send({ status: "ok" });
  } catch (err) {
    res.send({ status: "error" });
  }
});

app.delete('/deleteImage/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the image ID from the request parameters

    // Find and delete the image document by its ID
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
    
    console.log('Attempting to send message:', messageBody); // Log the message being sent

    client.messages
        .create({
            body: messageBody,
            from: process.env.TWILIO_WHATSAPP_FROM,  // Get Twilio 'from' number from .env
            to: process.env.TEST_WHATSAPP_TO,        // Get test WhatsApp number from .env
        })
        .then(message => console.log('WhatsApp message sent:', message.sid))
        .catch(err => console.error('Error sending WhatsApp message:', err));
};

// Cron Job for Treatment Notifications
cron.schedule('* * * * *', async () => { // Runs every minute
    const treatments = await Treatment.find();
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    console.log(`Current Time: ${currentTime}`); // Log current time for debugging

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    treatments.forEach(treatment => {
        const treatmentStartDate = new Date(treatment.startDate);
        const treatmentEndDate = new Date(treatment.endDate);

        treatmentStartDate.setHours(0, 0, 0, 0);
        treatmentEndDate.setHours(0, 0, 0, 0);

        console.log(`Checking treatment: ${treatment.planDescription}`); // Log treatment details

        if (today >= treatmentStartDate && today <= treatmentEndDate) {
            if (treatment.treatmentTime.includes(currentTime)) {
                console.log(`Sending WhatsApp message for treatment: ${treatment.planDescription}`);
                sendWhatsAppMessage(treatment);
            }
        }
    });
});

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));

//LOGIN
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

