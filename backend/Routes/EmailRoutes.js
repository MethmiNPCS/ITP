// EmailRoutes.js
const express = require('express');
const orderemailrouter = express.Router();
const EmailController = require('../Controllers/EmailControllers');

// Define route for sending email
orderemailrouter.post('/send-email', EmailController.sendEmail);

module.exports = orderemailrouter;
