import axios from "axios";

const sendEmail = async (to, subject, text) => {
    try {
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Visitor Pass Management",
                    email: process.env.SENDER_EMAIL,
                },
                to: [
                    {
                        email: to,
                    },
                ],
                subject: subject,
                textContent: text,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Email sent successfully");
    } catch (error) {
        console.error(
            "Email sending failed:",
            error.response?.data || error.message
        );
    }
};

export default sendEmail;