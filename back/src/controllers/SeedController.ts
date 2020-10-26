"use strict";
/* istanbul ignore file */

import {Response, Request, NextFunction} from "express";
import {Product, ProductDocument, ProductRequest} from "../models/Product";
import {jsonResponse} from "../util/responseWrapper";
import ProductController from "./ProductController";
import crypto from "crypto";

export default class SeedController {

    private static list = [
        "GIGABYTE GeForce RTX 2060 DirectX 12 GV-N2060",
        "MSI GeForce GTX 1050 Ti DirectX 12 GTX 1050",
        "MSI GeForce GTX 1660 Ti DirectX 12 GTX 1660 T",
        "MSI Radeon RX 5700 XT DirectX 12 RX 5700 XT M",
        "ASRock Phantom Gaming D Radeon RX 570 Direct",
        "GIGABYTE GeForce GTX 1660 OC 6G Graphics Card",
        "ASRock Radeon RX 5700 XT DirectX 12 RX 5700",
        "MSI Radeon RX 580 DirectX 12 RX 580 ARMOR 8G",
        "GIGABYTE GeForce GTX 1660 Ti OC 6G Graphics C",
        "MSI Radeon RX 5700 XT DirectX 12 RX 5700 XT G",
        "ASRock Phantom Gaming D Radeon RX 580 DirectX",
        "MSI GeForce GTX 1660 Ti DirectX 12 GTX 1660 T",
        "GIGABYTE AORUS Radeon RX 5700 XT 8G Graphics",
        "GIGABYTE GeForce GTX 1650 OC 4G Graphics Card",
        "EVGA GeForce RTX 2060 SC Ultra GAMING",
        "MSI GeForce GTX 1660 DirectX 12 GTX 1660 VEN",
        "GIGABYTE GeForce RTX 2060 DirectX 12 GV-N2060",
        "MSI GeForce GTX 1660 DirectX 12 GTX 1660 GAMI",
        "EVGA GeForce GTX 1660 Ti SC ULTRA GAMING",
        "SAPPHIRE NITRO+ Radeon RX 5700 XT DirectX 12",
        "ASRock Phantom Gaming D Radeon RX 5500 XT 8G OC Video Card",
        "MSI GeForce RTX 2060 DirectX 12 RTX 2060 VEN",
        "ASUS ROG STRIX AMD Radeon RX 5700 XT",
        "ASUS GeForce GTX 1050 Ti 4GB PHOENIX Fan Edit",
        "ASUS GeForce GTX 1660 Super Overclocked 6GB",
        "ASUS TUF Gaming GeForce GTX 1660 Overclocked",
        "ZOTAC GAMING GeForce RTX 2070 SUPER MINI 8GB",
        "ASUS TUF Gaming GeForce GTX 1650 SUPER Overcl",
        "ZOTAC GAMING GeForce RTX 2060 6GB GDDR6 192-b",
        "GIGABYTE Radeon RX 570 DirectX 12 GV-RX570GAM",
        "ASUS TUF Gaming GeForce RTX 3090 DirectX 12",
        "EVGA GeForce RTX 3090 FTW3 ULTRA GAMING Video",
        "GIGABYTE GeForce GTX 1650 DirectX 12 GV-N1656",
        "EVGA GeForce RTX 2060 KO ULTRA GAMING Video",
        "GIGABYTE Radeon RX 5700 XT DirectX 12 GV-R57X",
        "ABS Gladiator Gaming PC - Intel i9-10850K - GIGABY",
        "CLX Set GAMING PC Intel Core i7 9700K 3.60 GHz",
        "CLX Set GAMING PC AMD Ryzen Threadripper 2950X 3.5",
        "MSI Aegis R 10SD-016US Gaming and Entertainment",
        "WD Blue 3D NAND 1TB Internal SSD",
        "GIGABYTE GeForce RTX 3080 DirectX 12 GV-N3080GAMIN",
        "Cooler Master MasterLiquid ML360R ARGB Close-Loop",
        "ASUS ROG Strix LC 360 RGB All-in-one Liquid CPU Co",
        "Intel Core i9-9900K Coffee Lake 8-Core",
        "Intel Core i9-10850K Comet Lake 10-Core 3.6 GHz LG"
    ];

    public static async seed(req: Request, res: Response) {
        await jsonResponse(res, async () => {
            let prods: any = await ProductController.getAllProducts();
            if (prods && prods.length > 0) {
                throw new Error("DB already populated");
            }
            let promiseList = [];
            const list = new Set(SeedController.list);
            for (let name of list) {
                const prod = new Product();
                prod.isbn = crypto
                    .createHash('sha1')
                    .update(name, 'utf8')
                    .digest('base64')
                    .substring(0, 5);
                prod.name = name;
                prod.requests = SeedController.getRandomBool() ? [] : SeedController.getRandomRequests(4);
                if (prod.requests.filter(x => x.isActive).length > 0) {
                    prod.quantity = 0;
                } else {
                    prod.quantity = SeedController.getRandomInt(100);
                }
                promiseList.push(prod.save());
            }

            let count = 0;
            for (let p of promiseList) {
                await p;
                count++;
            }
            return count;
        });
    }

    private static getRandomRequests(max = 4) {
        let numOfRequests = SeedController.getRandomInt(max);
        let requests: ProductRequest[] = [];
        while (numOfRequests > 0) {
            requests.push({
                user: "sales",
                amount: SeedController.getRandomBetween(1, 5),
                isActive: SeedController.getRandomBool(),
                createdAt: SeedController.getRandomTime() * 1000,
            });
            numOfRequests--;
        }
        return requests;
    }

    private static getRandomInt(max = 100) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    private static getRandomBool() {
        return Math.random() >= 0.5;
    }

    private static getRandomTime(min=1548972000, max=1603742452) {
        return SeedController.getRandomBetween(min, max);
    }

    private static getRandomBetween(min=0, max=1) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
