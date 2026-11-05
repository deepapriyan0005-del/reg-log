const nodemailer = require("nodemailer");


console.log("SMTP HOST:", process.env.BREVO_SMTP_HOST);
console.log("SMTP PORT:", process.env.BREVO_SMTP_PORT);
console.log("SMTP USER:", process.env.BREVO_SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY
  }
});


transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP VERIFY ERROR:", error.message);
  } else {
    console.log("SMTP READY");
  }
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: {
        name: process.env.BREVO_SENDER_NAME,
        address: process.env.BREVO_SENDER_EMAIL
      },

      to: email,

      subject: "Your OTP - MERN Login",

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>MERN Login OTP</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This OTP is valid for 1 minute.</p>

          <p>Please do not share this OTP with anyone.</p>
        </div>
      `
    });

    console.log("OTP email sent successfully");

  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = sendOtpEmail;