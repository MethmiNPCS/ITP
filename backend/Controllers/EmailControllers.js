const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// function- email sending
exports.sendEmail = async (req, res) => {
    try {
        // transporter using Gmail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'projectsliit04@gmail.com', 
                pass: 'ggsb bbse xggz ldho' 
            }
        });

        // common email subject and body
        const commonSubject = "Order Request, National Seminary Farm, Kandy"; // Common subject
        // For HTML
const commonBodyHTML = `
<p>Dear Supplier,</p>
<p>We would like to place the below attached order request with your organization.
Please confirm the ability to fulfill this order.</p>
<p>Please find all the details attached below.</p>
<p>Thank you for your prompt attention to this request.</p>
<p>Best regards,<br>
Thushan Munasinghe,<br>
Farm Owner,<br>
National Seminary Farm,<br>
Kandy</p>
`; 

        // Generate the PDF using Puppeteer
        const pdfPath = path.join(__dirname, 'order-summary.pdf'); // Save the PDF to this path
        await generatePDF(req.body.order, pdfPath);

        // email options with the PDF as an attachment
        let mailOptions = {
            from: 'projectsliit04@gmail.com', // Sender's email
            to: req.body.to, // Recipient's email from request body
            subject: commonSubject, 
            //text: commonBody, // common body in plain text
            html: commonBodyHTML, // common body in HTML format 
            attachments: [
                {
                    filename: 'OrderSummaryReport.pdf',
                    path: pdfPath // Attach the generated PDF
                }
            ]
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email.' });
    }
};

// Function-generate the PDF using Puppeteer
async function generatePDF(order, outputPath) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        
        const content = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="text-align: center;">National Seminary Farm</h2>
            <p style="text-align: center;">7MH6+G6X, Meekanuwa Rd, Kandy</p>
            <p style="text-align: center;">0112 976 121</p>
            <p style="text-align: center;">www.nsf.lk</p>
            <p style="text-align: right;">Date: ${new Date().toLocaleDateString()}</p>

            <p><strong>Supplier:</strong> ${order.supplier}</p>
            <h3>Subject: Order Request for ${order.orderType}</h3>

            <p>Please find below the details of the order we would like to place with your company.</p>

            <h4>Order Details:</h4>
            <p><strong>Order ID:</strong> ${order.orderID}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>

            <h4>Items Ordered:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px;">Item Name</th>
                        <th style="border: 1px solid black; padding: 8px;">Quantity</th>
                        <th style="border: 1px solid black; padding: 8px;">Unit</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">${item.orderItem}</td>
                            <td style="border: 1px solid black; padding: 8px;">${item.quantity}</td>
                            <td style="border: 1px solid black; padding: 8px;">${item.unit}</td>
                        </tr>`).join('')}
                </tbody>
            </table>

            <h4>Description:</h4>
            <p>${order.description}</p>

            <h4>Delivery Instructions:</h4>
            <p>Please deliver the items to National Seminary Farm, 7MH6+G6X, Meekanuwa Rd, Kandy.</p>

            <h4>Payment Terms:</h4>
            <p>Payment upon delivery.</p>

            <h4>Contact Information:</h4>
            <p>For any questions, contact us at 0112 976 121.</p>

            <p>Sincerely,</p>
            <p>Thushan Munasinghe</p>
            <p>Farm Owner, National Seminary Farm</p>
        </div>`;

        // Set HTML content
        await page.setContent(content);

        // PDF generation
        await page.pdf({ path: outputPath, format: 'A4' });

        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}
