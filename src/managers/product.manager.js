import { error } from "node:console";
import fs from "node:fs";

 export default class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  //Metodo para obtener todos los productos
   async getAllProducts(limit = null) {
    try {
      if (!fs.existsSync(this.path)) return []; //verificar si existe el archivo
      const data = await fs.promises.readFile(this.path, "utf-8"); //leer el archivo
      const products = JSON.parse(data);
      return limit ? products.slice(0, limit) : products; //retornar los productos
    } catch (error) {
      console.log("Error leyenfo archivo", error);
      return [];
    }
  }

  //Metodo para obtener un producto por id
  async getProductsById(id) {
    try {
      const products = await this.getAllProducts();
      return products.find((product) => product, id === id);
    } catch (error) {
      console.log("Error obteniendo producto por id", error);
      return null;
    }
  }

  //Metodo para agregar un producto
  async addProduct(productData) {
    try {
      let products = await this.getAllProducts(); //  Obtener productos
  
      if (!Array.isArray(products)) {
        products = []; //  Asegurar que sea un array
      }
  
      const newId =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;
  
      const newProduct = {
        id: newId,
        status: productData.status ?? true,
        ...productData,
      };
  
      if (
        !newProduct.title ||
        !newProduct.price ||
        !newProduct.description ||
        !newProduct.category ||
        !newProduct.stock
      ) {
        throw new Error("Faltan campos requeridos");
      }
  
      products.push(newProduct); // Ahora `products` es un array
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  
      return newProduct;
    } catch (error) {
      console.error("Error agregando producto:", error.message);
      return null;
    }
  }
  

  //Metodo para actualizar un producto

  async updateProduct(id, updates) {
    try {
      const products = await this.getAllProducts();
      let index = products.findIndex((p) => p.id === parseInt(id)); //Buscar el indice del producto
      if (index === -1) return null; //Si no existe el producto

      delete updates.id; //No permite actualizar el id
      products[index] = { ...products[index], ...updates }; //Actualizar producto con los nuevos datos
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //Guardar en archivo
      return products[index];
    } catch (error) {
      console.log("Error actualizando producto", error);
      return null;
    }
  }

  //Metodo para eliminar un producto
  async deleteProduct(id) {
    try {
      const products = await this.getAllProducts();
      const filteredProducts = products.filter((p) => p.id !== id);
      if (products.length === filteredProducts.length) return null; //Si no se elimino ningun producto
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(filteredProducts, null, 2)
      );
      return true;
    } catch (error) {
      console.log("Error al eliminar producto", error);
      return false;
    }
  }
}


