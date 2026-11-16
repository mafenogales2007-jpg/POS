/**
 * Helper para capturar y transformar errores nativos de Mongoose
 * en respuestas HTTP limpias, legibles y amigables para el frontend.
 * 
 * Cumple con el estándar de respuesta del proyecto:
 * { success: false, message: "Mensaje claro para el usuario" }
 */
export const handleMongooseError = (error) => {
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

  if (error.name === 'CastError') {
    return {
      status: 400,
      response: {
        success: false,
        message: `El identificador '${error.value}' no tiene un formato válido de ID`
      }
    };
  }

  return {
    status: error.statusCode || 500,
    response: {
      success: false,
      message: error.message || 'Error interno del servidor'
    }
  };
};

export default handleMongooseError;
