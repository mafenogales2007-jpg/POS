import { TerceroModel } from '../models/tercero.model.js';

/**
 * Servicio para registrar un nuevo tercero (Cliente o Proveedor)
 * Soporta tanto personas naturales como personas jurídicas.
 */
export const crearTerceroService = async (datosTercero) => {
  const { documentoTercero, tipoDocumento, nombreOrazonSocial, tipoTercero } = datosTercero;

  if (!documentoTercero || !tipoDocumento || !nombreOrazonSocial) {
    throw new Error('El documento, tipo de documento y nombre o razón social son obligatorios');
  }

  // Verificar unicidad de documento
  const existente = await TerceroModel.findOne({ documentoTercero: documentoTercero.trim() });
  if (existente) {
    throw new Error(`Ya existe un tercero registrado con el documento o NIT: ${documentoTercero}`);
  }

  // Asegurar que tipoTercero sea un arreglo válido
  let rolesTercero = tipoTercero;
  if (typeof tipoTercero === 'string') {
    rolesTercero = [tipoTercero.toUpperCase().trim()];
  } else if (Array.isArray(tipoTercero)) {
    rolesTercero = tipoTercero.map((t) => t.toUpperCase().trim());
  } else {
    rolesTercero = ['CLIENTE'];
  }

  const nuevoTercero = new TerceroModel({
    ...datosTercero,
    documentoTercero: documentoTercero.trim(),
    tipoTercero: rolesTercero,
    apellido: datosTercero.apellido?.trim() || ''
  });

  const terceroGuardado = await nuevoTercero.save();
  return await TerceroModel.findById(terceroGuardado._id).populate('tipoDocumento');
};

/**
 * Servicio para listar terceros con filtros opcionales:
 * - tipo: 'CLIENTE' o 'PROVEEDOR'
 * - busqueda: coincide con documento, nombre o razón social
 */
export const listarTercerosService = async (filtros = {}) => {
  const query = {};

  // Filtro por tipo de tercero (ej. ?tipo=CLIENTE o ?tipo=PROVEEDOR)
  if (filtros.tipo) {
    query.tipoTercero = filtros.tipo.toUpperCase().trim();
  }

  // Filtro por estado activo/inactivo si se especifica
  if (filtros.estado !== undefined) {
    query.estadoTercero = filtros.estado === 'true' || filtros.estado === true;
  }

  // Búsqueda textual rápida por documento o nombre/razón social (con escape de caracteres especiales)
  if (filtros.busqueda) {
    const escapedSearch = filtros.busqueda.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'i');
    query.$or = [{ documentoTercero: regex }, { nombreOrazonSocial: regex }];
  }

  return await TerceroModel.find(query).populate('tipoDocumento').sort({ createdAt: -1 }).lean();
};

/**
 * Servicio para consultar un tercero por su ID
 */
export const obtenerTerceroPorIdService = async (id) => {
  const tercero = await TerceroModel.findById(id).populate('tipoDocumento').lean();
  if (!tercero) {
    throw new Error('Tercero no encontrado con el ID proporcionado');
  }
  return tercero;
};

/**
 * Servicio para consultar un tercero por su número de documento (útil en cobro POS rápido)
 */
export const obtenerTerceroPorDocumentoService = async (documento) => {
  return await TerceroModel.findOne({ documentoTercero: documento.trim() })
    .populate('tipoDocumento')
    .lean();
};

/**
 * Servicio para actualizar datos de un tercero
 */
export const actualizarTerceroService = async (id, datosActualizar) => {
  // Evitar sobreescritura accidental del documento si pertenece a otro tercero
  if (datosActualizar.documentoTercero) {
    const duplicado = await TerceroModel.findOne({
      documentoTercero: datosActualizar.documentoTercero.trim(),
      _id: { $ne: id }
    });
    if (duplicado) {
      throw new Error(`El documento ${datosActualizar.documentoTercero} ya pertenece a otro tercero`);
    }
  }

  const terceroActualizado = await TerceroModel.findByIdAndUpdate(id, datosActualizar, {
    new: true,
    runValidators: true
  }).populate('tipoDocumento');

  if (!terceroActualizado) {
    throw new Error('Tercero no encontrado para actualizar');
  }

  return terceroActualizado;
};

/**
 * Servicio para activar o desactivar un tercero (baja lógica)
 */
export const cambiarEstadoTerceroService = async (id, estado) => {
  const tercero = await TerceroModel.findByIdAndUpdate(
    id,
    { estadoTercero: estado },
    { new: true }
  ).populate('tipoDocumento');

  if (!tercero) {
    throw new Error('Tercero no encontrado');
  }

  return tercero;
};

/**
 * Servicio para acumular o descontar puntos de fidelización (RF-11)
 */
export const actualizarPuntosTerceroService = async (id, cantidadPuntos, sesionTransaccional = null) => {
  const opciones = { new: true };
  if (sesionTransaccional) {
    opciones.session = sesionTransaccional;
  }

  const tercero = await TerceroModel.findByIdAndUpdate(
    id,
    { $inc: { puntosFidelizacion: cantidadPuntos } },
    opciones
  );

  if (!tercero) {
    throw new Error('Tercero no encontrado para actualizar puntos');
  }

  if (tercero.puntosFidelizacion < 0) {
    throw new Error('El saldo de puntos de fidelización no puede ser negativo');
  }

  return tercero;
};
