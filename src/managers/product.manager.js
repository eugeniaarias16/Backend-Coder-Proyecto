import Product from '../models/product.model.js';


class ProductManager {
  async getProducts(options = {}) {
    const { 
      limit = 10, 
      page = 1, 
      sort, 
      category,
      status 
    } = options;

    // Validación de parámetros
    const validLimit = Math.max(1, parseInt(limit));
    const validPage = Math.max(1, parseInt(page));

    // Construcción de filtros
    const filter = {};
    
    if (category) {
      // Búsqueda case-insensitive de categoría
      filter.category = { 
        $regex: new RegExp(category.trim(), 'i') 
      };
    }
    
    // Filtrado de estado
    if (status !== undefined) {
      filter.status = status === 'true' || status === true;
    }

    // Opciones de paginación
    const paginateOptions = {
      page: validPage,
      limit: validLimit,
      lean: true
    };

    // Configuración de ordenamiento
    if (sort === 'asc' || sort === 'desc') {
      paginateOptions.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    try {
      const result = await Product.paginate(filter, paginateOptions);
      
      // Generación de parámetros de consulta
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
        ? `/products?${queryParams.toString()}&page=${result.prevPage}` 
        : null,
      nextLink: result.hasNextPage 
        ? `/products?${queryParams.toString()}&page=${result.nextPage}` 
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

  // Método para obtener categorías únicas
  async getUniqueCategories() {
    try {
      const categories = await Product.distinct('category');
      return categories.map(cat => cat.toLowerCase());
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
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
      console.error('Error al crear el producto:', error);
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