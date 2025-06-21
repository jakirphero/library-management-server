import express, { Request, Response } from "express";
import { bookZodSchema } from "./book.zod";
import { BookModel } from "./book.model";
import mongoose from "mongoose";

export const bookRouter = express.Router();

bookRouter.post("/books", async (req: Request, res: Response) => {
    const parsed = bookZodSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error: parsed.error.errors
        })
    }
    try {
        const book = await BookModel.create(parsed.data);
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add book",
            error
        });
    }
});

bookRouter.get("/books", async (req: Request, res: Response) => {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;

        const filterCondition: Record<string, unknown> = {};
        if (filter && typeof filter === "string") {
            filterCondition.genre = filter.toUpperCase();
        }

        const sortOrder: 1 | -1 = sort === "desc" ? -1 : 1;
        const sortCondition = { [sortBy as string]: sortOrder } as Record<string, 1 | -1>;

        const resultLimit = parseInt(limit as string, 10) || 10;

        const data = await BookModel.find(filterCondition)
            .sort(sortCondition)
            .limit(resultLimit);

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data,
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error
        });
    }
});

bookRouter.get("/books/:bookId", async (req: Request, res: Response) => {
    const { bookId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }
    try {
        const data = await BookModel.findById(bookId);
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
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error
        });
    }

});

bookRouter.put("/books/:bookId", async (req: Request, res: Response) => {
    const { bookId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }

    try {
        const updatedBook = await BookModel.findByIdAndUpdate(
            bookId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

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
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error
        });
    }
});

bookRouter.delete("/books/:bookId", async (req: Request, res: Response) => {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID format",
        });
    }

    try {
        const deletedBook = await BookModel.findByIdAndDelete(bookId);

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
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error
        });
    }
}); 