import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // Importar fs para verificar/crear directorios
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/product.manager.js"; 

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8082;

// Crear directorio de datos si no existe
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Inicializar ProductManager con la ruta del archivo
const productsFilePath = path.join(dataDir, "products.json");
const productManager = new ProductManager(productsFilePath);

// Asegurarse de que el archivo existe
if (!fs.existsSync(productsFilePath)) {
  fs.writeFileSync(productsFilePath, "[]", "utf8");
}

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Archivos estáticos

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor HTTP con WebSockets
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Configurar WebSockets
const io = new Server(httpServer);
app.set("socketio", io); // Hacer io accesible en toda la app

io.on("connection", (socket) => {
    console.log("Usuario conectado!");
  
    socket.on("newProduct", async (productData) => {
      console.log("Producto recibido desde el cliente:", productData);
      try {
        // Asegurarse de que price y stock sean números
        productData.price = Number(productData.price);
        productData.stock = Number(productData.stock);
        
        const newProduct = await productManager.addProduct(productData);
        
        if (!newProduct) {
          throw new Error("No se pudo agregar el producto");
        }
        
        console.log("Producto agregado:", newProduct);
        const products = await productManager.getAllProducts();
        console.log("Lista actualizada de productos:", products);
        io.emit("updateProducts", products);
        console.log("Evento updateProducts emitido");
      } catch (error) {
        console.error("Error al procesar el producto:", error.message);
        // Informar al cliente sobre el error
        socket.emit("productError", { message: error.message });
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
});