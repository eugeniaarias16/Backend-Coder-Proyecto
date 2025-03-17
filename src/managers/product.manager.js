import Product from '../models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
  async getProducts(options = {}) {
    const { 
      limit = 10, 
      page = 1, 
      sort, 
      category,
      status 
    } = options;

    // Validar que limit y page sean números positivos
    const validLimit = Math.max(1, parseInt(limit));
    const validPage = Math.max(1, parseInt(page));

    const filter = {};
    
    // Filtrado de categoría con mejora en manejo de mayúsculas/minúsculas
    if (category) {
      filter.category = { 
        $regex: new RegExp(category.trim(), 'i') 
      };
    }
    
    // Filtrado de estado con conversión explícita
    if (status !== undefined) {
      filter.status = status === 'true' || status === true;
    }

    const paginateOptions = {
      page: validPage,
      limit: validLimit,
      lean: true
    };

    // Ordenamiento con validación
    if (sort === 'asc' || sort === 'desc') {
      paginateOptions.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    try {
      const result = await Product.paginate(filter, paginateOptions);
      
      // Construcción de parámetros de consulta más robusta
      const queryParams = new URLSearchParams();
      
      if (validLimit !== 10) queryParams.set('limit', validLimit);
      if (sort) queryParams.set('sort', sort);
      if (category) queryParams.set('category', category);
      if (status !== undefined) queryParams.set('status', status);
      
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage 
          ? `/api/products?${queryParams.toString()}&page=${result.prevPage}` 
          : null,
        nextLink: result.hasNextPage 
          ? `/api/products?${queryParams.toString()}&page=${result.nextPage}` 
          : null
      };
    } catch (error) {
      console.error('Error en getProducts:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
}

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      delete productData.uuid;  // Eliminar cualquier UUID proporcionado manualmente
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      );
      
      if (!updatedProduct) {
        throw new Error('Producto no encontrado');
      }
      
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      
      if (!deletedProduct) {
        throw new Error('Producto no encontrado');
      }
      
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default new ProductManager();