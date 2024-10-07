// Controllers/emailController.js
const { sendEmail } = require('../Model/FinanceEmailService'); // Adjust the path as necessary

// Function to send email with PDF data
const sendFinanceEmail = async (req, res) => {
    const { pdfData, recipientEmail } = req.body;

    if (!pdfData || !recipientEmail) {
        return res.status(400).json({ message: "PDF data and recipient email are required" });
    }

    try {
        const result = await sendEmail(pdfData, recipientEmail);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendFinanceEmail };
