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
const financrouter = require("./Routes/financ"); // Finance

const orderRoutes = require("./Routes/OrderRoutes");
const supplierRoutes = require("./Routes/SupplierRoutes"); 
const orderemailRoutes = require("./Routes/EmailRoutes");

const cron = require('node-cron');
const twilio = require('twilio');
const Treatment = require('./Model/TreatmentModel');
const cors = require("cors");
require('dotenv').config();

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
app.use("/finance", financrouter); // Finance

app.use("/orders",orderRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/orderemails", orderemailRoutes); 


// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Get SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Get Auth Token from .env
const client = twilio(accountSid, authToken);

// Connect Database
mongoose.connect("mongodb+srv://admin:zoPvf0NUih9wBU3F@cluster0.yawwn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log(err));


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
