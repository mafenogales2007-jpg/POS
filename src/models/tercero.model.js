import { Schema, model } from 'mongoose';

export const TIPOS_TERCERO = ['CLIENTE', 'PROVEEDOR'];

const terceroSchema = new Schema(
  {
    documentoTercero: {
      type: String,
      required: [true, 'El documento o NIT es obligatorio'],
      unique: true,
      trim: true
    },
    tipoDocumento: {
      type: Schema.Types.ObjectId,
      ref: 'TipoDocumento',
      required: [true, 'El tipo de documento es obligatorio']
    },
    nombreOrazonSocial: {
      type: String,
      required: [true, 'El nombre o razón social es obligatorio'],
      trim: true
    },
    apellido: {
      type: String,
      trim: true,
      default: '' // Vacío para personas jurídicas / empresas
    },
    tipoTercero: [
      {
        type: String,
        enum: {
          values: TIPOS_TERCERO,
          message: '{VALUE} no es un tipo de tercero válido (CLIENTE o PROVEEDOR)'
        },
        required: true
      }
    ],
    puntosFidelizacion: {
      type: Number,
      default: 0,
      min: [0, 'Los puntos no pueden ser negativos']
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
    timestamps: true,
    versionKey: false
  }
);

export const TerceroModel = model('Tercero', terceroSchema, 'terceros');
export default TerceroModel;
