import { Router } from "express";
import productManager from "../managers/product.manager.js";
import cartManager from "../managers/cart.manager.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            category: category ? category.toLowerCase().trim() : undefined
        };

        // Obtener productos filtrados
        const result = await productManager.getProducts(options);

        // Obtener categorías únicas
        const uniqueCategories = await productManager.getUniqueCategories();

        res.render("productsList", {
            products: result.payload,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            },
            categories: uniqueCategories, // Pasar categorías dinámicamente
            category, // Mantener categoría seleccionada
            sort
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).render("error", {
            message: "Error al cargar productos",
            layout: "main"
        });
    }
});

// Página de productos con paginación
router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;

    const options = {
      limit,
      page,
      sort,
      category,
      status,
    };

    const result = await productManager.getProducts(options);

    res.render("productsList", {
      products: result.payload,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
      category,
      sort,
    });
  } catch (error) {
    res.status(500).render("home", {
      error: error.message,
    });
  }
});

// Página de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    res.render("product-detail", {
      product,
    });
  } catch (error) {
    res.status(404).render("home", {
      error: error.message,
    });
  }
});

// Página del carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    res.render("cart", {
      cart,
    });
  } catch (error) {
    res.status(404).render("home", {
      error: error.message,
    });
  }
});

// Mantener la ruta de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products: products.payload });
  } catch (error) {
    res.status(500).render("home", {
      error: error.message,
    });
  }
});

export default router;
