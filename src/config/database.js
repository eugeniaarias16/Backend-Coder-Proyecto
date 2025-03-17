import mongoose from 'mongoose';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Definir URI de conexión
const MONGODB_URI = 'mongodb://localhost:27017/ecommerce';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexión a MongoDB establecida con éxito');
    return true;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    return false;
  }
};

export default connectDB;