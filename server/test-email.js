// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'Test Email from Carpenter Workshop',
      text: 'This is a test email to verify your Gmail App Password and server setup.'
    });
    console.log('Test email sent:', info.response);
  } catch (err) {
    console.error('Test email send error:', err);
  }
}

main();
