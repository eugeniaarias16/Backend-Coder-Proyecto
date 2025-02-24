import { Router } from "express";
import ProductManager from "file:///C:/Users/usuario/Documents/PROGRAMACION/Backend-Coder-Proyecto/src/managers/product.manager.js";
export const router = Router();

import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear el gestor de productos con una ruta absoluta
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));




//Obtener todos los productos
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getAllProducts(
    limit ? parseInt(limit) : null
  );
  res.json(products);
});

//Obtener un producto por id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProdcutsById(parseInt(id));

    res.json(product);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "error", message: "Product not found" });
  }
});

//Agegar un producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.json(newProduct);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "error", message: "Cannot add product" });
  }
});

//Actualizar un producto por id
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productData = req.body;
    const product = await productManager.updateProduct(id, productData);
    res.json(product);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "error", message: "Cannot update product" });
  }
});

//Eliminar un producto por id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productManager.deleteProduct(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "error", message: "Cannot delete product" });
  }
});
export default router;
