import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

class CartManager {
  async getAllCarts() {
    try {
      return await Cart.find().lean();
    } catch (error) {
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.product').lean();
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      // Buscar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );
      
      if (productIndex >= 0) {
        // Si el producto ya existe, aumentar la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no existe, agregarlo al carrito
        cart.products.push({
          product: productId,
          quantity
        });
      }
      
      await cart.save();
      return await cart.populate('products.product');
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      // Verificar que todos los productos sean válidos
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
      }
      
      cart.products = products;
      await cart.save();
      
      return await cart.populate('products.product');
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );
      
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }
      
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      
      return await cart.populate('products.product');
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      cart.products = cart.products.filter(
        item => item.product.toString() !== productId
      );
      
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }
}

export default new CartManager();