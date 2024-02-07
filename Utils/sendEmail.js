const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      password: process.env.SMPT_PASSWORD,
    },
  });
  const mailoptions = {
    form: process.env.SMPT_SERVICE,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailoptions)
};

module.exports = sendEmail;
