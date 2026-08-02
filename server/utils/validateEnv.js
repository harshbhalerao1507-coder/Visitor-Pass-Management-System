const validateEnv = () => {
    const requiredEnv = [
        "MONGO_URI",
        "SECRET",
        "BREVO_API_KEY",
        "SENDER_EMAIL",
        "PORT"
    ];

    for (const envVar of requiredEnv) {
        if (!process.env[envVar]) {
            console.error("========================================");
            console.error("Missing Environment Variable");
            console.error(`${envVar} is not defined.`);
            console.error("Please check your .env file.");
            console.error("========================================");
            process.exit(1);
        }
    }

    console.log("Environment validation successful.");
};

export default validateEnv;
