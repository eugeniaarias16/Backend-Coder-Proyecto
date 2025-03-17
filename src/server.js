import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Importar rutas
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Importar conexión a MongoDB
import connectDB from "./config/database.js";

// Importar manager de productos para MongoDB
import productManager from "./managers/product.manager.js";

// Importar helpers de Handlebars
import helpers from "./helpers/handlebars.helpers.js";

// Cargar variables de entorno
config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8082; // Puerto fijo para evitar problemas con process.env

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configurar Handlebars
app.engine("handlebars", engine({
  helpers,
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      console.error("No se pudo conectar a MongoDB. Verificando configuración...");
    } else {
      console.log("Conexión a MongoDB establecida con éxito");
    }
    
    // Iniciar servidor HTTP
    const httpServer = app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
    
    // Configurar WebSockets
    const io = new Server(httpServer);
    
    // Hacer io accesible en toda la app
    app.set("socketio", io);
    
    io.on("connection", (socket) => {
      console.log("Usuario conectado!");
      
      socket.on("newProduct", async (productData) => {
        console.log("Producto recibido desde el cliente:", productData);
        try {
          // Asegurarse de que price y stock sean números
          productData.price = Number(productData.price);
          productData.stock = Number(productData.stock);
          
          const newProduct = await productManager.createProduct(productData);
          
          console.log("Producto agregado:", newProduct);
          const products = await productManager.getProducts();
          console.log("Lista actualizada de productos:", products.payload);
          io.emit("updateProducts", products.payload);
          console.log("Evento updateProducts emitido");
        } catch (error) {
          console.error("Error al procesar el producto:", error.message);
          socket.emit("productError", { message: error.message });
        }
      });
      
      socket.on("disconnect", () => {
        console.log("Usuario desconectado");
      });
    });
    
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error.message);
  }
};
// Agregar al final, antes de startServer()

// Ruta raíz que redirige a productos
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).render("error", { 
    message: "Página no encontrada",
    layout: "main" 
  });
});
// Iniciar la aplicación
startServer();