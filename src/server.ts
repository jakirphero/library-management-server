import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

async function Main() {
    try {
        if (!process.env.DB_KEY) {
            throw new Error("Missing DB_KEY in environment variables");
        }

        await mongoose.connect(process.env.DB_KEY);
        console.log('Connected to MongoDB with Mongoose');

        app.listen(port, () => {
            console.log(`Library Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

Main();
