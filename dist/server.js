"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
async function Main() {
    try {
        if (!process.env.DB_KEY) {
            throw new Error("Missing DB_KEY in environment variables");
        }
        await mongoose_1.default.connect(process.env.DB_KEY);
        console.log('Connected to MongoDB with Mongoose');
        app_1.default.listen(port, () => {
            console.log(`Library Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Connection failed:", error);
    }
}
Main();
