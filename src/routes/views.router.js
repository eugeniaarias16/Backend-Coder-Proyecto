import { Router } from "express";
import ProductManager from "../managers/product.manager.js";

const router = Router();
const productManager = new ProductManager("../data/products.json");

// Ruta Home (Muestra los productos)
router.get("/", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render("home", { products });
});

// Ruta RealTimeProducts con WebSockets
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render("realTimeProducts", { products });
});

export default router;
