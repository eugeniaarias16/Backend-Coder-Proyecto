import Router from "express";
import CartManager from '../managers/cart.manager.js'

const router = Router();
const cartManager = new CartManager("src/data/cart.json");

//Crear un carrito nuevo
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error", message: "Cannot create the new cart" });
  }
});

//obtener los productos de un carrito por su id

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartByID(parseInt(req.params.cid));
  } catch (error) {
    return res
      .status(404)
      .json({ error: "error", message: "Cannot find cart with that ID" });
  }
});

//Agregar un producto al carrito

router.post("/:cid/product/:id", async (req, res) => {
  try {
    const { cid, id } = req.params;
    const updatedCart = await cartManager.addProductToCart(
      parseInt(cid),
      parseInt(id)
    );
  } catch (error) {
    return res.status(404).json({ message: "Fail finding the cart or  adding the product" });
  }
});

export default router;