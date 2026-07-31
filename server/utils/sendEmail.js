import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            text,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

export default sendEmail;