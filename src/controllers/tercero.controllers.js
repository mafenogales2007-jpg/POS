import {
  crearTerceroService,
  listarTercerosService,
  obtenerTerceroPorIdService,
  obtenerTerceroPorDocumentoService,
  actualizarTerceroService,
  cambiarEstadoTerceroService
} from '../services/tercero.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

/**
 * Controlador para crear un tercero (POST /api/terceros)
 */
export const crearTerceroController = async (req, res) => {
  try {
    const nuevoTercero = await crearTerceroService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tercero registrado exitosamente',
      data: nuevoTercero
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para listar terceros (GET /api/terceros?tipo=CLIENTE&busqueda=...)
 */
export const listarTercerosController = async (req, res) => {
  try {
    const { tipo, busqueda, estado } = req.query;
    const terceros = await listarTercerosService({ tipo, busqueda, estado });
    return res.status(200).json({
      success: true,
      message: 'Listado de terceros obtenido con éxito',
      data: terceros
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para obtener un tercero por su ID (GET /api/terceros/:id)
 */
export const obtenerTerceroPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const tercero = await obtenerTerceroPorIdService(id);
    return res.status(200).json({
      success: true,
      message: 'Tercero obtenido exitosamente',
      data: tercero
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para consultar tercero por documento (GET /api/terceros/documento/:doc)
 * Muy útil para el cajero en el POS al digitar la cédula del cliente.
 */
export const obtenerTerceroPorDocumentoController = async (req, res) => {
  try {
    const { doc } = req.params;
    const tercero = await obtenerTerceroPorDocumentoService(doc);

    if (!tercero) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún tercero con el documento ${doc}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tercero encontrado',
      data: tercero
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para actualizar un tercero (PUT /api/terceros/:id)
 */
export const actualizarTerceroController = async (req, res) => {
  try {
    const { id } = req.params;
    const terceroActualizado = await actualizarTerceroService(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Tercero actualizado exitosamente',
      data: terceroActualizado
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};

/**
 * Controlador para cambiar estado activo/inactivo (PATCH /api/terceros/:id/estado)
 */
export const cambiarEstadoTerceroController = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (estado === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar el campo boolean estado (true o false)'
      });
    }

    const terceroActualizado = await cambiarEstadoTerceroService(id, Boolean(estado));
    return res.status(200).json({
      success: true,
      message: `Tercero ${estado ? 'activado' : 'desactivado'} correctamente`,
      data: terceroActualizado
    });
  } catch (error) {
    const errorParsed = handleMongooseError(error);
    return res.status(errorParsed.status).json(errorParsed.response);
  }
};
