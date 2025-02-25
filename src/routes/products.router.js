import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

// Obtener todos los productos
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getAllProducts(
    limit ? parseInt(limit) : null
  );
  res.json(products);
});

// Obtener un producto por id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProdcutsById(parseInt(id));

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    return res.status(404).json({ error: "Error", message: error.message });
  }
});

// Agregar un producto
router.post("/", async (req, res) => {
  try {
    const io = req.app.get("socketio"); // Obtener socket.io desde el servidor
    const newProduct = await productManager.addProduct(req.body);

    if (!newProduct) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const products = await productManager.getAllProducts();
    io.emit("updateProducts", products); // Enviar evento a todos los clientes

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Actualizar un producto por id
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productData = req.body;
    const product = await productManager.updateProduct(id, productData);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }

    // Emitir evento para actualizar la lista de productos
    const io = req.app.get("socketio");
    const products = await productManager.getAllProducts();
    io.emit("updateProducts", products);

    res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error interno", message: error.message });
  }
});

// Eliminar un producto por id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productDeleted = await productManager.deleteProduct(id);

    if (!productDeleted) {
      return res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }

    // Emitir evento para actualizar la lista de productos
    const io = req.app.get("socketio");
    const products = await productManager.getAllProducts();
    io.emit("updateProducts", products);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", message: error.message });
  }
});

export default router;
