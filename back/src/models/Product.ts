import mongoose from "mongoose";

export type ProductDocument = mongoose.Document & {
    isbn: string;
    name: string;
    quantity: number;
    requests: ProductRequest[];
};

export type ProductRequest = {
    user: string;
    amount: number;
    isActive: boolean;
    createdAt: number;
};

const productSchema = new mongoose.Schema({
    isbn: { type: String, unique: true },
    name: String,
    quantity: Number,
    requests: [
        {
            user: String,
            amount: Number,
            isActive: Boolean,
            createdAt: Number
        }
    ]

}, { timestamps: true });

export const Product = mongoose.model<ProductDocument>("Product", productSchema);

