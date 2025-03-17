import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,  
    default: () => uuidv4(),
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // Normalizar a minúsculas
    validate: {
      validator: function(v) {
        // Permite categorías personalizadas mientras mantiene un formato consistente
        return /^[a-z0-9\s]+$/.test(v);
      },
      message: props => `${props.value} no es una categoría válida`
    }
  },
  thumbnails: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice para mejorar la búsqueda y filtrado
productSchema.index({ category: 1, price: 1 });

// Método estático para obtener categorías únicas
productSchema.statics.getUniqueCategories = async function() {
  return this.distinct('category');
};

// Método virtual para formatear la categoría
productSchema.virtual('formattedCategory').get(function() {
  // Capitalizar primera letra de la categoría
  return this.category 
    ? this.category.charAt(0).toUpperCase() + this.category.slice(1)
    : '';
});

// Aplicar el plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;