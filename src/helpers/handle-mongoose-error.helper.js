/**
 * Helper para capturar y transformar errores nativos de Mongoose
 * en respuestas HTTP limpias, legibles y amigables para el frontend.
 * 
 * Cumple con el estándar de respuesta del proyecto:
 * { success: false, message: "Mensaje claro para el usuario" }
 * 
 * @param {Error} error - Objeto de error capturado en el bloque catch
 * @returns {{ status: number, response: { success: boolean, message: string } }}
 */
export const handleMongooseError = (error) => {
  // 1. Error de clave duplicada (E11000) de MongoDB (ej. documento, email o SKU ya existente)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'campo';
    const value = error.keyValue ? error.keyValue[field] : '';
    return {
      status: 400,
      response: {
        success: false,
        message: `Ya existe un registro con el valor '${value}' en el campo '${field}'`
      }
    };
  }

  // 2. Error de validación de esquema en Mongoose (ValidationError)
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return {
      status: 400,
      response: {
        success: false,
        message: messages.join('. ')
      }
    };
  }

  // 3. Error de ID mal formado (CastError al buscar por ObjectId inválido)
  if (error.name === 'CastError') {
    return {
      status: 400,
      response: {
        success: false,
        message: `El identificador '${error.value}' no tiene un formato válido de ID`
      }
    };
  }

  // 4. Cualquier otro error general
  return {
    status: 500,
    response: {
      success: false,
      message: error.message || 'Error interno del servidor'
    }
  };
};

export default handleMongooseError;
