# Arquitectura de Datos y Esquemas Mongoose - API POS (Camino B)

Este documento especifica la estructura definitiva de la base de datos para la API del sistema POS, basada en la estrategia de desacoplamiento **Camino B**:
- **`Usuario`**: Operadores internos del sistema (login, contraseña obligatoria y roles estáticos).
- **`Tercero`**: Contactos comerciales externos unificados (clientes y proveedores, sin credenciales de acceso).
- **Eliminación de sobrecarga**: Se eliminan las tablas/colecciones de `Roles`, `Permisos`, `roles_has_permisos`, `Cliente` y `Proveedores`.

---

## 1. Orden de Prioridad de Desarrollo (Nivel de Dependencia)

Para evitar dependencias circulares y referencias nulas, el desarrollo de esquemas, servicios y controladores debe seguir este orden estricto:

```
[Nivel 1: Catálogos Maestros]
 ├── TipoDocumento
 ├── Categoria
 └── FormaDePago

[Nivel 2: Actores y Catálogo de Productos]
 ├── Usuario    (operadores con login; depende de TipoDocumento)
 ├── Tercero    (clientes y proveedores; depende de TipoDocumento)
 └── Productos  (catálogo de venta; depende de Categoria)

[Nivel 3: Control de Existencias]
 └── Stock      (control 1 a 1; depende de Productos)

[Nivel 4: Transacciones Cabecera]
 ├── Compras    (depende de Tercero [proveedor] y Usuario [comprador])
 └── Ventas     (depende de Tercero [cliente], FormaDePago y Usuario [cajero])

[Nivel 5: Transacciones Detalle]
 ├── DetalleCompra (depende de Compras y Productos)
 └── DetalleVenta  (depende de Ventas y Productos)
```

---

## 2. Definición de Esquemas en Mongoose (ES Modules)

---

### NIVEL 1: Catálogos Maestros

#### 1. `src/models/tipoDocumento.model.js`
```javascript
import { Schema, model } from 'mongoose';

const tipoDocumentoSchema = new Schema({
    descripcionTipoDocumento: {
        type: String,
        enum: ['TI', 'CC', 'CE', 'PPT', 'NIT', 'RUT'],
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const TipoDocumentoModel = model('TipoDocumento', tipoDocumentoSchema);
```

#### 2. `src/models/categoria.model.js`
```javascript
import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema({
    nombreCategoria: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const CategoriaModel = model('Categoria', categoriaSchema);
```

#### 3. `src/models/formaDePago.model.js`
```javascript
import { Schema, model } from 'mongoose';

const formaDePagoSchema = new Schema({
    descripcionFormaDePago: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const FormaDePagoModel = model('FormaDePago', formaDePagoSchema);
```

---

### NIVEL 2: Actores y Productos

#### 4. `src/models/usuario.model.js` (Solo Operadores con Login)
```javascript
import { Schema, model } from 'mongoose';

export const ROLES_USUARIO = ['ADMIN', 'CAJERO'];

const usuarioSchema = new Schema({
    documentoUsuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipoDocumento: {
        type: Schema.Types.ObjectId,
        ref: 'TipoDocumento',
        required: true
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
        enum: ROLES_USUARIO,
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
}, { timestamps: true });

export const UsuarioModel = model('Usuario', usuarioSchema);
```

#### 5. `src/models/tercero.model.js` (Clientes y Proveedores Unificados)
```javascript
import { Schema, model } from 'mongoose';

export const TIPOS_TERCERO = ['CLIENTE', 'PROVEEDOR'];

const terceroSchema = new Schema({
    documentoTercero: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipoDocumento: {
        type: Schema.Types.ObjectId,
        ref: 'TipoDocumento',
        required: true
    },
    nombreOrazonSocial: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        trim: true,
        default: '' // Proveedores jurídicos (empresas con NIT) no usan apellido
    },
    tipoTercero: [{
        type: String,
        enum: TIPOS_TERCERO,
        required: true // Permite que un tercero sea 'CLIENTE', 'PROVEEDOR' o ambos
    }],
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
}, { timestamps: true });

export const TerceroModel = model('Tercero', terceroSchema);
```

#### 6. `src/models/productos.model.js`
```javascript
import { Schema, model } from 'mongoose';

const productosSchema = new Schema({
    nombreProductos: {
        type: String,
        required: true,
        trim: true
    },
    descripcionProductos: {
        type: String,
        trim: true
    },
    precioVenta: {
        type: Number,
        required: true,
        min: 0,
        default: 0.00
    },
    ivaProductos: {
        type: Number,
        default: 0.00,
        min: 0,
        max: 100
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estadoProductos: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const ProductosModel = model('Productos', productosSchema);
```

---

### NIVEL 3: Control de Existencias

#### 7. `src/models/stock.model.js`
```javascript
import { Schema, model } from 'mongoose';

const stockSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true,
        unique: true
    },
    totalStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    stockMinimo: {
        type: Number,
        required: true,
        default: 5,
        min: 0
    }
}, { timestamps: true });

export const StockModel = model('Stock', stockSchema);
```

---

### NIVEL 4: Transacciones Cabecera

#### 8. `src/models/compras.model.js`
```javascript
import { Schema, model } from 'mongoose';

const comprasSchema = new Schema({
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Tercero',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true // Operador del sistema que registra la compra
    },
    subTotalCompras: {
        type: Number,
        required: true,
        min: 0
    },
    ivaTotalCompras: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalCompras: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const ComprasModel = model('Compras', comprasSchema);
```

#### 9. `src/models/ventas.model.js`
```javascript
import { Schema, model } from 'mongoose';

const ventasSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Tercero',
        required: true
    },
    cajero: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true // Operador del sistema que cobra la venta
    },
    formaDePago: {
        type: Schema.Types.ObjectId,
        ref: 'FormaDePago',
        required: true
    },
    subTotalVentas: {
        type: Number,
        required: true,
        min: 0
    },
    ivaVentas: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalVentas: {
        type: Number,
        required: true,
        min: 0
    },
    estadoVentas: {
        type: String,
        enum: ['Completada', 'Anulada', 'Pendiente'],
        default: 'Completada'
    }
}, { timestamps: true });

export const VentasModel = model('Ventas', ventasSchema);
```

---

### NIVEL 5: Transacciones Detalle

#### 10. `src/models/detalleCompra.model.js`
```javascript
import { Schema, model } from 'mongoose';

const detalleCompraSchema = new Schema({
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'Compras',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    cantidadCompra: {
        type: Number,
        required: true,
        min: 1
    },
    valorUnitarioCompra: {
        type: Number,
        required: true,
        min: 0
    },
    subTotalCompra: {
        type: Number,
        required: true,
        min: 0
    },
    totalCompra: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const DetalleCompraModel = model('DetalleCompra', detalleCompraSchema);
```

#### 11. `src/models/detalleVenta.model.js`
```javascript
import { Schema, model } from 'mongoose';

const detalleVentaSchema = new Schema({
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'Ventas',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    cantidadVenta: {
        type: Number,
        required: true,
        min: 1
    },
    valorUnitarioVenta: {
        type: Number,
        required: true,
        min: 0
    },
    subTotalVenta: {
        type: Number,
        required: true,
        min: 0
    },
    ivaVenta: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalVenta: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const DetalleVentaModel = model('DetalleVenta', detalleVentaSchema);
```

---

## 3. Resumen Comparativo del Refactor

| Concepto | Antes (SQL Inicial) | Ahora (Camino B en Mongoose) | Beneficio |
| :--- | :--- | :--- | :--- |
| **Entidades de Seguridad** | `usuario`, `roles`, `permisos`, `roles_has_permisos` | Solo `UsuarioModel` con `enum: ['ADMIN', 'CAJERO']` | Sin tablas intermedias ni lógica compleja de permisos. |
| **Clientes y Proveedores** | 2 tablas separadas (`cliente`, `proveedores`) | 1 modelo `TerceroModel` con `tipoTercero` | Se elimina código duplicado de CRUDs y se maneja la personería jurídica o natural de forma limpia. |
| **Trazabilidad** | Ventas y compras no sabían qué usuario las operó | `Compras.usuario` y `Ventas.cajero` | Auditoría total y arqueo de caja exacto por cajero. |
| **Total de Esquemas** | 13 tablas relacionales | **11 modelos claros y desacoplados** | Base de datos limpia y lista para codificar controladores y servicios. |
