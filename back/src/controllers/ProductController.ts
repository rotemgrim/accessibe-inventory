"use strict";

import {Response, Request, NextFunction} from "express";
import {Product, ProductDocument, ProductRequest} from "../models/Product";
import {jsonResponse} from "../util/responseWrapper";

export default class ProductController {

    public static async getList(req: Request, res: Response) {
        return await jsonResponse(res, ProductController.getAllProducts);
    }

    public static async create(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            if (!req.body || !req.body.isbn || !req.body.name) {
                throw new Error("Missing required fields for product");
            }

            const isbn = req.body.isbn;
            const name = req.body.name;
            const product = new Product();
            product.isbn = isbn;
            product.name = name;
            product.quantity = 0;
            product.requests = [];
            res.status(201);
            return await ProductController.saveProduct(product)
                .catch(e => {
                    throw new Error(e);
                });
        });
    }

    public static async delete(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            if (!req.body || !req.body.isbn) {
                throw new Error("Missing required fields for product delete");
            }

            const isbn = req.body.isbn;
            return await ProductController.deleteProduct(isbn)
                .catch(e => {
                    throw new Error(e);
                });
        });
    }

    public static async update(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            if (!req.body || !req.body.product || !req.body.product.isbn) {
                throw new Error("Missing required fields for product update");
            }
            let product = req.body.product as ProductDocument;
            return await ProductController.updateProduct(product)
                .catch(e => {
                    throw new Error(e);
                });
        });
    }

    public static async addRequest(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            if (!req.body || !req.body.pRequest || !req.body.isbn) {
                throw new Error("Missing required fields for adding requests");
            }
            let isbn = req.body.isbn;
            let pRequest = req.body.pRequest as ProductRequest;
            pRequest.createdAt = Date.now();
            return await ProductController.addProductRequest(isbn, pRequest)
                .catch(e => {
                    throw new Error(e);
                });
        });
    }

    public static async addInventory(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            if (!req.body || !req.body.isbn) {
                throw new Error("Missing required fields for adding to inventory");
            }
            let isbn = req.body.isbn;
            return await ProductController.addToInventory(isbn)
                .catch(e => {
                    throw new Error(e);
                });
        });
    }

    public static async getAllProducts() {
        return new Promise((resolve, reject) => {
            Product.find((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    private static async saveProduct(product: ProductDocument) {
        return new Promise((resolve, reject) => {
            Product.find({isbn: product.isbn}, async (err, data) => {
                if (err) {
                    reject(err);
                } else if (data && data.length > 0) {
                    reject(new Error("already exists"));
                } else {
                    const savedProduct = await product.save();
                    resolve(savedProduct);
                }
            });
        });
    };

    private static async deleteProduct(isbn: string) {
        return new Promise((resolve, reject) => {
            Product.findOne({isbn: isbn}, async (err, product) => {
                if (err) {
                    reject(err);
                } else if (product) {
                    resolve(await product.remove());
                } else {
                    reject("not found");
                }
            });
        });
    };

    private static async updateProduct(product: ProductDocument) {
        return new Promise((resolve, reject) => {
            Product.findOneAndUpdate({isbn: product.isbn}, product, {new: true},async (err, newProduct) => {
                if (err) {
                    reject(err);
                } else if (newProduct) {
                    resolve(newProduct);
                } else {
                    reject("product not found");
                }
            });
        });
    };

    private static async addProductRequest(isbn: string, pRequest: ProductRequest) {
        return new Promise((resolve, reject) => {
            Product.findOne({isbn: isbn}, async (err, product: ProductDocument) => {
                if (err) {
                    reject(err);
                } else if (product) {
                    product.requests = [...product.requests, pRequest];
                    await product.save((err, newProduct) => {
                       if (err) {
                           reject(err);
                       } else {
                           resolve(newProduct);
                       }
                    });
                } else {
                    reject("product not found");
                }
            });
        });
    };

    private static async addToInventory(isbn: string) {
        return new Promise((resolve, reject) => {
            Product.findOne({isbn: isbn}, async (err, product: ProductDocument) => {
                if (err) {
                    reject(err);
                } else if (product) {
                    product.quantity += 1;
                    let index = product.requests.findIndex(x => x.isActive);
                    if (index > -1) {
                        product.requests[index].isActive = false;
                    }
                    await product.save((err, newProduct) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(newProduct);
                        }
                    });
                } else {
                    reject("product not found");
                }
            });
        });
    };
}
