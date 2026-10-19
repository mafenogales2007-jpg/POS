import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      default: ""
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const ReportModel = mongoose.model("Reportes", ReportSchema);

export default ReportModel;