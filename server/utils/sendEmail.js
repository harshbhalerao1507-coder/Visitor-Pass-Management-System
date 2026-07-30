import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("sendEmail called");
        console.log(to, subject);

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export default sendEmail;