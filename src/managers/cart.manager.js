import fs, { existsSync } from "node:fs";

export default class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  //Metodo para obtrener todos los carritos

  async getAllCarts() {
    try {
      if (!existsSync(this.path)) return [];
      const carts = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.log("Error al obtener los carritos", error);
      return [];
    }
  }

  //Metodo para obtener un carrito por id

  async getCartByID(id) {
    try {
      const carts = await this.getAllCarts();
      return carts.find((c) => c.id === id);
    } catch (error) {
      console.log("Error al obtener el carrito por id", error);
      return null;
    }
  }

  //Metodo para crear un carrito

  async createCart(cart) {
    try {
      const carts = await this.getAllCarts();
      const newID = cart.length > 0 ? cart[length - 1].id + 1 : 1;

      const newCart = {
        id: newID,
        products: [],
        createdAt: new Date().toISOString(), // Agrega la fecha de creación en formato ISO
      };

      carts.push(newCart);
      await fs.promises.writeFile(this.path.JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito", error);
      return null;
    }
  }

    //Metodo para agregar un producto al carrito
    async addProductToCart(cartID,productID){
        try{
            const carts= await this.getAllCarts();
            const cartIndex = carts.findIndex((c) => c.id === cartID);
            if(cartIndex === -1) return false;

            //verificar si ya existe el producto en el carrito
            const productIndex= carts[cartIndex].products.findIndex((p) => p.id === productID);
            if(productIndex !== -1){
                carts[cartIndex].products[productIndex].quantity++; //si ya existe el producto en el carrito, se incrementa la cantidad
            }else{
                carts[cartIndex].products.push({id: productID, quantity: 1}); //si no existe el producto en el carrito, se agrega
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];;


        }catch(error){
            console.log("Error al agregar un producto al carrito", error);
            return false;
        }
    }









}
