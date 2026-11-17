import {
  obtenerTiposDocumentoService,
  obtenerTipoDocumentoPorIdService,
  crearTipoDocumentoService
} from '../services/tipoDocumento.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

/**
 * Controlador para listar todos los tipos de documento
 */
export const obtenerTiposDocumentoController = async (req, res) => {
  try {
    const tipos = await obtenerTiposDocumentoService();
    return res.status(200).json({
      success: true,
      message: 'Tipos de documento obtenidos exitosamente',
      data: tipos
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para obtener un tipo de documento por ID
 */
export const obtenerTipoDocumentoPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await obtenerTipoDocumentoPorIdService(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de documento no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tipo de documento encontrado',
      data: tipo
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para crear un nuevo tipo de documento (solo ADMIN)
 */
export const crearTipoDocumentoController = async (req, res) => {
  try {
    const { descripcionTipoDocumento } = req.body;

    if (!descripcionTipoDocumento) {
      return res.status(400).json({
        success: false,
        message: 'El campo descripcionTipoDocumento es obligatorio'
      });
    }

    const nuevoTipo = await crearTipoDocumentoService(descripcionTipoDocumento);

    return res.status(201).json({
      success: true,
      message: 'Tipo de documento creado con éxito',
      data: nuevoTipo
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};
