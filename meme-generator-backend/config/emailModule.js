const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

const sendEmail = async (to, subject, content) => {
    const mailOptions = {
        from: process.env.NODEMAILER_FROM,
        to,
        subject,
        html: content, // Your HTML email template
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Email error: ${error.message}`);
    }
};

module.exports = { sendEmail };
