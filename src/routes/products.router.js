import { Router } from "express";
import productManager from "../managers/product.manager.js";

const router = Router();

// Obtener todos los productos con paginación, filtrado y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    
    const options = {
      limit,
      page,
      sort,
      category,
      status
    };
    
    const result = await productManager.getProducts(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    
    res.json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
});

// Agregar un producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.createProduct(productData);
    
    // Emitir evento para actualizar la lista de productos en tiempo real (opcional)
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productManager.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Producto creado correctamente',
      payload: newProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productData = req.body;
    const updatedProduct = await productManager.updateProduct(pid, productData);
    
    // Emitir evento para actualizar la lista de productos en tiempo real (opcional)
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productManager.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      payload: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);
    
    // Emitir evento para actualizar la lista de productos en tiempo real (opcional)
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productManager.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.json({
      status: 'success',
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;