import { UsersModel } from '../models/users.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.helpers.js';
import { generateToken } from '../helpers/jwt.helpers.js';

/**
 * Autenticación de operadores (Login) y emisión de JWT
 */
export const loginService = async ({ identificador, clave }) => {
  if (!identificador || !clave) {
    throw new Error('Debe proporcionar el identificador (email o documento) y la contraseña');
  }

  // Buscar por email o por documento
  const usuario = await UsersModel.findOne({
    $or: [
      { emailUsuario: identificador.toLowerCase().trim() },
      { documentoUsuario: identificador.trim() }
    ]
  }).populate('tipoDocumento');

  if (!usuario) {
    throw new Error('Credenciales incorrectas: usuario no encontrado');
  }

  if (!usuario.estadoUsuario) {
    throw new Error('Usuario inactivo o suspendido en el sistema');
  }

  const claveCorrecta = comparePassword(clave, usuario.claveUsuario);
  if (!claveCorrecta) {
    throw new Error('Credenciales incorrectas: contraseña inválida');
  }

  const token = generateToken({
    id: usuario._id,
    nombre: usuario.nombreUsuario,
    apellido: usuario.apellidoUsuario,
    email: usuario.emailUsuario,
    rol: usuario.rol
  });

  return {
    token,
    usuario: {
      id: usuario._id,
      documentoUsuario: usuario.documentoUsuario,
      tipoDocumento: usuario.tipoDocumento,
      nombreUsuario: usuario.nombreUsuario,
      apellidoUsuario: usuario.apellidoUsuario,
      emailUsuario: usuario.emailUsuario,
      rol: usuario.rol
    }
  };
};

/**
 * Registro de un nuevo operador (Exclusivo ADMIN - RF-02)
 */
export const registrarUsuarioService = async (datosUsuario) => {
  const {
    documentoUsuario,
    tipoDocumento,
    nombreUsuario,
    apellidoUsuario,
    emailUsuario,
    claveUsuario,
    rol,
    telefonoUsuario,
    direccionUsuario
  } = datosUsuario;

  const existente = await UsersModel.findOne({
    $or: [
      { emailUsuario: emailUsuario.toLowerCase().trim() },
      { documentoUsuario: documentoUsuario.trim() }
    ]
  });

  if (existente) {
    throw new Error('Ya existe un usuario registrado con ese correo o número de documento');
  }

  const passwordHashed = hashPassword(claveUsuario);

  const nuevoUsuario = new UsersModel({
    documentoUsuario,
    tipoDocumento,
    nombreUsuario,
    apellidoUsuario,
    emailUsuario,
    claveUsuario: passwordHashed,
    rol: rol || 'CAJERO',
    telefonoUsuario,
    direccionUsuario
  });

  const usuarioGuardado = await nuevoUsuario.save();
  return await UsersModel.findById(usuarioGuardado._id).populate('tipoDocumento');
};

/**
 * Listar operadores del POS (Exclusivo ADMIN - RF-02)
 */
export const listarUsuariosService = async () => {
  return await UsersModel.find().populate('tipoDocumento').lean();
};

/**
 * Desactivar / Activar operador (RF-02)
 */
export const cambiarEstadoUsuarioService = async (id, estado) => {
  const usuario = await UsersModel.findByIdAndUpdate(
    id,
    { estadoUsuario: estado },
    { new: true }
  ).populate('tipoDocumento');

  if (!usuario) {
    throw new Error('Operador no encontrado');
  }

  return usuario;
};
