import { Router } from "express";
import cartManager from "../managers/cart.manager.js";

const router = Router();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json({
      status: 'success',
      payload: carts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Obtener un carrito por ID con sus productos
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    
    res.status(201).json({
      status: 'success',
      message: 'Carrito creado correctamente',
      payload: newCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    
    res.json({
      status: 'success',
      message: 'Producto agregado al carrito correctamente',
      payload: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo products debe ser un array'
      });
    }
    
    const updatedCart = await cartManager.updateCart(cid, products);
    
    res.json({
      status: 'success',
      message: 'Carrito actualizado correctamente',
      payload: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser un número mayor a 0'
      });
    }
    
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    
    res.json({
      status: 'success',
      message: 'Cantidad del producto actualizada correctamente',
      payload: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    
    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito correctamente',
      payload: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    
    const emptyCart = await cartManager.clearCart(cid);
    
    res.json({
      status: 'success',
      message: 'Carrito vaciado correctamente',
      payload: emptyCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;