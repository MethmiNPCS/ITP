// MongoDB password = zoPvf0NUih9wBU3F
// Database name = cluster0
// MongoDB project name = farm-systemDB

const express = require("express");
const mongoose = require("mongoose");

// Import Routes
const emprouter = require("./Routes/EmployeeRoutes");
const stockrouter = require("./Routes/StockRoutes");
const animalrouter = require("./Routes/AnimalRoutes");
const treatmentrouter = require("./Routes/TreatmentRoutes");

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImgModel = require('./Model/ImgModel'); 
const productRouter = require("../backend/Routes/ProductRoutes");

const orderRoutes = require("./Routes/OrderRoutes");
const supplierRoutes = require("./Routes/SupplierRoutes"); 

const financrouter = require("./Routes/financ");
const employeeRouter = require('./Routes/EmployeeRoutes');
const salaryRouter = require('./Routes/SalaryRoutes');

// Dhi
const tasksRoute = require("./Routes/tasksRoute");


// Visu



const app = express();
const cors = require("cors");

// Middlewear
app.use(express.json());
app.use(cors());
app.use("/stocks", stockrouter);
app.use("/animals",animalrouter);
app.use("/treatments",treatmentrouter);
app.use('/products', productRouter); 
app.use("/orders",orderRoutes);
app.use("/suppliers", supplierRoutes);

app.use("/finance", financrouter);
app.use('/employees', employeeRouter);
app.use('/salaries', salaryRouter);

//Dhi
app.use("/tasks", tasksRoute);

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));

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


