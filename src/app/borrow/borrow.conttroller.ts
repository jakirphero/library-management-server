import express, { Request, Response } from "express";
import { BorrowModel } from "./borrow.model";

export const borrowRoute = express.Router();

borrowRoute.post("/borrow", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const data = await BorrowModel.create(body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data
        })
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: "Invalid data",
            error
        })
    }
});

borrowRoute.get("/borrow", async (req: Request, res: Response) => {
    try {
        const data = await BorrowModel.find().populate('book');
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data
        })
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: "Invalid get data",
            error
        })
    }
});

borrowRoute.get("/summary", async (req: Request, res: Response) => {
    try {
        const data = await BorrowModel.aggregate([
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrowed books summary",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
})