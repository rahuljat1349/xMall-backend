const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail", // Corrected typo in SMPT to SMTP
    auth: {
      user: process.env.SMTP_MAIL, // Corrected typo in SMPT_MAIL to SMTP_MAIL
      pass: process.env.SMTP_PASSWORD, // Corrected typo in SMPT_PASSWORD to SMTP_PASSWORD
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL, // Set the 'from' field to the sender's email address
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions); // Corrected typo in mailoptions to mailOptions
};

module.exports = sendEmail;
