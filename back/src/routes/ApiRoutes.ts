import express from "express";
import ProductController from "../controllers/ProductController";
import cors from "cors";

const router = express.Router();

router.use(cors());
router.get("/products", ProductController.getList);
router.post("/products", ProductController.create);
router.delete("/products", ProductController.delete);
router.put("/products", ProductController.update);

router.put("/products/add-request", ProductController.addRequest);
router.put("/products/add-to-inventory", ProductController.addInventory);


export default router;
