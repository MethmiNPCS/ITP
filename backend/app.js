// MongoDB password = zoPvf0NUih9wBU3F
// Database name = cluster0
// MongoDB project name = farm-systemDB

const express = require("express");
const mongoose = require("mongoose");

// Import Routes
const stockrouter = require("./Routes/StockRoutes");  // Stock


const tasksRoute = require("./Routes/tasksRoute"); // Task
const productRouter = require("./Routes/ProductRoutes"); // Product
const animalrouter = require("./Routes/AnimalRoutes");  // Animal
const treatmentrouter = require("./Routes/TreatmentRoutes"); // Treatment
const employeeRouter = require('./Routes/EmployeeRoutes'); // Employee
const salaryRouter = require('./Routes/SalaryRoutes'); // Salary
const financrouter = require("./Routes/financ"); // Finance

const orderRoutes = require("./Routes/OrderRoutes");
const supplierRoutes = require("./Routes/SupplierRoutes"); 
const orderemailRoutes = require("./Routes/EmailRoutes");

// Middlewear
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/stocks", stockrouter); // Stock


app.use("/tasks", tasksRoute); // Tasks
app.use('/products', productRouter); // Product
app.use("/animals",animalrouter); // Animal
app.use("/treatments",treatmentrouter); // Treatment
app.use('/employees', employeeRouter); //Employee
app.use('/salaries', salaryRouter); // Salary
app.use("/finance", financrouter); // Finance

app.use("/orders",orderRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/orderemails", orderemailRoutes); 

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));
