# E-Commerce Application

## Descripción del Proyecto

Este proyecto es una aplicación de E-Commerce desarrollada con Node.js, Express, MongoDB y Handlebars. La aplicación permite la gestión de productos, carritos de compras y ofrece una interfaz web completa para la experiencia de compra.

## Características Principales

- Gestión de productos con paginación y filtros
- Sistema de carrito de compras
- Vistas dinámicas con Handlebars
- Persistencia de datos con MongoDB
- Endpoints RESTful para productos y carritos
- Tiempo real con Socket.IO

## Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v5 o superior)
- npm (v8 o superior)




## Estructura del Proyecto

```
project-root/
│
├── src/
│   ├── config/
│   │   └── database.js
│   ├── managers/
│   │   ├── product.manager.js
│   │   └── cart.manager.js
│   ├── models/
│   │   ├── product.model.js
│   │   └── cart.model.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   └── views/
│       └── handlebars templates
│
├── public/
│   ├── css/
│   └── js/
│
├── .env
├── .gitignore
└── package.json
```

## Endpoints Principales

### Productos
- `GET /api/products`: Listar productos
  - Parámetros: `limit`, `page`, `sort`, `category`
- `GET /api/products/:pid`: Detalle de producto
- `POST /api/products`: Crear producto
- `PUT /api/products/:pid`: Actualizar producto
- `DELETE /api/products/:pid`: Eliminar producto

### Carritos
- `GET /api/carts`: Listar carritos
- `GET /api/carts/:cid`: Detalle de carrito
- `POST /api/carts`: Crear carrito
- `POST /api/carts/:cid/products/:pid`: Agregar producto
- `PUT /api/carts/:cid`: Actualizar carrito
- `DELETE /api/carts/:cid`: Vaciar carrito

## Tecnologías Utilizadas

- Backend: Node.js, Express
- Base de Datos: MongoDB, Mongoose
- Template Engine: Handlebars
- Tiempo Real: Socket.IO
- Adicionales: 
  * Mongoose Paginate V2
  * dotenv
  * UUID







