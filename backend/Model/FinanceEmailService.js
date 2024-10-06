const nodemailer = require('nodemailer');

async function sendEmail(pdfData, recipientEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nadeejawathulanda@gmail.com', // Corrected email address
      pass: 'ldze idum btki cvkb' // Your generated App Password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Farm System" <nadeejawathulanda@gmail.com>', // Use the corrected email address here
      to: recipientEmail, // Recipient email
      subject: "Profit and Loss Report", // Email subject
      text: "Please find the attached Profit and Loss report.", // Email body
      attachments: [
        {
          filename: 'profit-loss-report.pdf',
          content: pdfData,
          encoding: 'base64',
        }
      ]
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to handle it in the router
  }
}

module.exports = { sendEmail };
