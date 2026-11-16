import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    documentoUsuario: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    tipoDocumento: {
      type: Schema.Types.ObjectId,
      ref: 'TipoDocumento',
      required: false
    },
    nombreUsuario: {
      type: String,
      required: true,
      trim: true
    },
    apellidoUsuario: {
      type: String,
      required: true,
      trim: true
    },
    emailUsuario: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    claveUsuario: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      enum: ['ADMIN', 'CAJERO'],
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
    timestamps: true
  }
);

usersSchema.methods.toJSON = function () {
  const usuario = this.toObject();
  delete usuario.claveUsuario;
  return usuario;
};

export const UsuarioModel = model('Usuario', usersSchema, 'users');
export default UsuarioModel;
