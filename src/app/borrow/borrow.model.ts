import { Schema, model } from "mongoose";
import { IBorrow } from "./borrow.interface";

const borrowSchema = new Schema<IBorrow>(
    {
        book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, required: true },
        dueDate: { type: Date, required: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const BorrowModel = model<IBorrow>("Borrow", borrowSchema);