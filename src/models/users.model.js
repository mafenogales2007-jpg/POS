import { Schema, model } from 'mongoose';

export const ROLES_USUARIO = ['ADMIN', 'CAJERO'];

const usersSchema = new Schema(
  {
    documentoUsuario: {
      type: String,
      required: [true, 'El número de documento es obligatorio'],
      unique: true,
      trim: true
    },
    tipoDocumento: {
      type: Schema.Types.ObjectId,
      ref: 'TipoDocumento',
      required: [true, 'El tipo de documento es obligatorio']
    },
    nombreUsuario: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    apellidoUsuario: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true
    },
    emailUsuario: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },
    claveUsuario: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    rol: {
      type: String,
      enum: {
        values: ROLES_USUARIO,
        message: '{VALUE} no es un rol permitido (ADMIN o CAJERO)'
      },
      default: 'CAJERO',
      required: true
    },
    telefonoUsuario: {
      type: String,
      trim: true
    },
    direccionUsuario: {
      type: String,
      trim: true
    },
    estadoUsuario: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Ocultar la contraseña al serializar en JSON
usersSchema.methods.toJSON = function () {
  const usuario = this.toObject();
  delete usuario.claveUsuario;
  return usuario;
};

export const UsersModel = model('Usuario', usersSchema);
export default UsersModel;
