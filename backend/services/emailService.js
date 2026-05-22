const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendGuardianWelcomeEmail = async ({
  to,
  parentName,
  studentName,
  loginId,
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Welcome to EduConnect ERP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Welcome to EduConnect ERP</h2>
          <p>Dear ${parentName},</p>
          <p>Your guardian account for <strong>${studentName}</strong> has been created.</p>
          <p><strong>Login ID:</strong> ${loginId}</p>
          <h3>First-time login steps:</h3>
          <ol>
            <li>Open EduConnect login page.</li>
            <li>Click <strong>Forgot Password?</strong></li>
            <li>Enter your Login ID.</li>
            <li>Click Send OTP.</li>
            <li>Check your email for OTP.</li>
            <li>Create your password and login.</li>
          </ol>
          <p>- EduConnect Pro</p>
        </div>
      `,
    });

    console.log("WELCOME EMAIL SENT:", info.messageId);

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.log("WELCOME EMAIL FAILED:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

const sendPasswordResetOtpEmail = async ({
  to,
  name,
  otp,
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "EduConnect Password Reset OTP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>EduConnect Password Reset</h2>
          <p>Dear ${name || "User"},</p>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>- EduConnect Pro</p>
        </div>
      `,
    });

    console.log("RESET OTP EMAIL SENT:", info.messageId);

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.log("RESET OTP EMAIL FAILED:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendGuardianWelcomeEmail,
  sendPasswordResetOtpEmail,
};