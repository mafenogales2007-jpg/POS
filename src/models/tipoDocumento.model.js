import { Schema, model } from 'mongoose';

// Valores estándar válidos para Colombia
export const TIPOS_DOCUMENTO_VALIDOS = ['TI', 'CC', 'CE', 'PPT', 'NIT', 'RUT'];

const tipoDocumentoSchema = new Schema(
  {
    descripcionTipoDocumento: {
      type: String,
      enum: {
        values: TIPOS_DOCUMENTO_VALIDOS,
        message: '{VALUE} no es un tipo de documento válido'
      },
      required: [true, 'El tipo de documento es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true // Asegura que siempre se guarde en mayúsculas (ej. 'cc' -> 'CC')
    }
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

export const TipoDocumentoModel = model('TipoDocumento', tipoDocumentoSchema, 'tipodocumentos');