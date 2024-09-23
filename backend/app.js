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

const productRouter = require("./Routes/ProductRoutes");

const orderRoutes = require("./Routes/OrderRoutes");
const supplierRoutes = require("./Routes/SupplierRoutes"); 

const financrouter = require("./Routes/financ");
const employeeRouter = require('./Routes/EmployeeRoutes');
const salaryRouter = require('./Routes/SalaryRoutes');

// Dhi
const tasksRoute = require("./Routes/tasksRoute");


// Visu
app.use('/products', productRouter); 


const app = express();
const cors = require("cors");

// Middlewear
app.use(express.json());
app.use(cors());
app.use("/stocks", stockrouter);
app.use("/animals",animalrouter);
app.use("/treatments",treatmentrouter);

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