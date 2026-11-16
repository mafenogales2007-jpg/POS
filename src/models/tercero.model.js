import { Schema, model } from 'mongoose';

const terceroSchema = new Schema(
  {
    documentoTercero: {
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
    nombreOrazonSocial: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      trim: true,
      default: ''
    },
    tipoTercero: [
      {
        type: String,
        enum: ['CLIENTE', 'PROVEEDOR'],
        required: true
      }
    ],
    puntosFidelizacion: {
      type: Number,
      default: 0,
      min: 0
    },
    direccion: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    estadoTercero: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const TerceroModel = model('Tercero', terceroSchema, 'terceros');
export default TerceroModel;
