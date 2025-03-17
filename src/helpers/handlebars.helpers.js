/**
 * Helpers personalizados para las plantillas Handlebars
 * Estos ayudan a realizar operaciones y comparaciones dentro de las plantillas
 */

export default {
  /**
   * Compara si dos valores son iguales
   * Se utiliza principalmente en formularios para marcar la opción seleccionada
   * @param {*} a - Primer valor a comparar
   * @param {*} b - Segundo valor a comparar
   * @returns {Boolean} - Verdadero si son iguales, falso si no lo son
   */
  eq: function(a, b) {
    return a === b;
  },
  
  /**
   * Compara si un valor es mayor que otro
   * Útil para validaciones en las plantillas
   * @param {*} a - Valor a evaluar
   * @param {*} b - Valor de referencia
   * @returns {Boolean} - Verdadero si a > b, falso si no
   */
  gt: function(a, b) {
    return a > b;
  },
  
  /**
   * Multiplica dos números y devuelve el resultado formateado con dos decimales
   * Útil para calcular subtotales en el carrito
   * @param {Number} a - Primer factor (normalmente el precio)
   * @param {Number} b - Segundo factor (normalmente la cantidad)
   * @returns {String} - Resultado formateado con dos decimales
   */
  multiply: function(a, b) {
    return (a * b).toFixed(2);
  },
  
  /**
   * Calcula el total del carrito sumando los subtotales de cada producto
   * @param {Array} products - Array de productos del carrito con sus cantidades
   * @returns {String} - Total formateado con dos decimales
   */
  calculateTotal: function(products) {
    let total = 0;
    
    for (const item of products) {
      // Verificar que tanto el producto como su precio existan
      if (item.product && typeof item.product.price === 'number') {
        total += item.product.price * item.quantity;
      }
    }
    
    return total.toFixed(2);
  },
  
  /**
   * Formatea un número como moneda (con signo de dólar y dos decimales)
   * @param {Number} value - Valor a formatear
   * @returns {String} - Valor formateado como moneda
   */
  formatCurrency: function(value) {
    return `$${parseFloat(value).toFixed(2)}`;
  },
  
  /**
   * Trunca un texto a una longitud específica y agrega puntos suspensivos
   * Útil para mostrar descripciones cortas de productos
   * @param {String} text - Texto a truncar
   * @param {Number} length - Longitud máxima
   * @returns {String} - Texto truncado
   */
  truncate: function(text, length) {
    if (text && text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  },

  capitalize: function(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};
