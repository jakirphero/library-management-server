"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoute = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("./borrow.model");
exports.borrowRoute = express_1.default.Router();
exports.borrowRoute.post("/borrow", async (req, res) => {
    try {
        const body = req.body;
        const data = await borrow_model_1.BorrowModel.create(body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid data",
            error
        });
    }
});
exports.borrowRoute.get("/borrow", async (req, res) => {
    try {
        const data = await borrow_model_1.BorrowModel.find().populate('book');
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid get data",
            error
        });
    }
});
exports.borrowRoute.get("/summary", async (req, res) => {
    try {
        const data = await borrow_model_1.BorrowModel.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            {
                $unwind: "$bookInfo"
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn"
                    }
                }
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrowed books summary",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
