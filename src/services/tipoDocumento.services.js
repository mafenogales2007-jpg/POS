import { TipoDocumentoModel, TIPOS_DOCUMENTO_VALIDOS } from '../models/tipoDocumento.model.js';

/**
 * Obtener todos los tipos de documento activos en el sistema
 */
export const obtenerTiposDocumentoService = async () => {
  return await TipoDocumentoModel.find().lean();
};

/**
 * Obtener un tipo de documento por su ID
 */
export const obtenerTipoDocumentoPorIdService = async (id) => {
  return await TipoDocumentoModel.findById(id).lean();
};

/**
 * Crear un nuevo tipo de documento
 */
export const crearTipoDocumentoService = async (descripcionTipoDocumento) => {
  const tipoExistente = await TipoDocumentoModel.findOne({
    descripcionTipoDocumento: descripcionTipoDocumento.toUpperCase().trim()
  });

  if (tipoExistente) {
    throw new Error(`El tipo de documento '${descripcionTipoDocumento}' ya existe en el sistema`);
  }

  const nuevoTipo = new TipoDocumentoModel({ descripcionTipoDocumento });
  return await nuevoTipo.save();
};

/**
 * Inicializador / Seed para precargar los tipos de documento básicos si la colección está vacía
 */
export const inicializarTiposDocumentoService = async () => {
  const conteo = await TipoDocumentoModel.countDocuments();
  if (conteo === 0) {
    const tipos = TIPOS_DOCUMENTO_VALIDOS.map((desc) => ({ descripcionTipoDocumento: desc }));
    await TipoDocumentoModel.insertMany(tipos);
    console.log('✔ Tipos de documento precargados exitosamente');
  }
};
