"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_zod_1 = require("./book.zod");
const book_model_1 = require("./book.model");
const mongoose_1 = __importDefault(require("mongoose"));
exports.bookRouter = express_1.default.Router();
exports.bookRouter.post("/books", async (req, res) => {
    const parsed = book_zod_1.bookZodSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error: parsed.error.errors
        });
    }
    try {
        const book = await book_model_1.BookModel.create(parsed.data);
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add book",
            error
        });
    }
});
exports.bookRouter.get("/books", async (req, res) => {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;
        const filterCondition = {};
        if (filter && typeof filter === "string") {
            filterCondition.genre = filter.toUpperCase();
        }
        const sortOrder = sort === "desc" ? -1 : 1;
        const sortCondition = { [sortBy]: sortOrder };
        const resultLimit = parseInt(limit, 10) || 10;
        const data = await book_model_1.BookModel.find(filterCondition)
            .sort(sortCondition)
            .limit(resultLimit);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error
        });
    }
});
exports.bookRouter.get("/books/:bookId", async (req, res) => {
    const { bookId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }
    try {
        const data = await book_model_1.BookModel.findById(bookId);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error
        });
    }
});
exports.bookRouter.put("/books/:bookId", async (req, res) => {
    const { bookId } = req.params;
    const updateData = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }
    try {
        const updatedBook = await book_model_1.BookModel.findByIdAndUpdate(bookId, updateData, {
            new: true,
            runValidators: true
        });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error
        });
    }
});
exports.bookRouter.delete("/books/:bookId", async (req, res) => {
    const { bookId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }
    try {
        const deletedBook = await book_model_1.BookModel.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error
        });
    }
});
