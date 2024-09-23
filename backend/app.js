// MongoDB password = zoPvf0NUih9wBU3F
// Database name = cluster0
// MongoDB project name = farm-systemDB

const express = require("express");
const mongoose = require("mongoose");
const emprouter = require("./Routes/EmployeeRoutes");
const stockrouter = require("./Routes/StockRoutes");
const animalrouter = require("./Routes/AnimalRoutes");
const treatmentrouter = require("./Routes/TreatmentRoutes");
//const orderRoutes = require("./Routes/OrderRoutes");
//const supplierRoutes = require("./Routes/SupplierRoutes"); 
const financrouter = require("./Routes/financ");


const app = express();
const cors = require("cors");

// Middlewear
app.use(express.json());
app.use(cors());
app.use("/employees", emprouter);
app.use("/stocks", stockrouter);
app.use("/animals",animalrouter);
app.use("/treatments",treatmentrouter);
//app.use("/orders",orderRoutes);
//app.use("/suppliers", supplierRoutes);
app.use("/finance", financrouter);

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));