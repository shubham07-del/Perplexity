import axios from "axios";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Signature AI",
          email: process.env.GOOGLE_USER, // Verified sender
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};