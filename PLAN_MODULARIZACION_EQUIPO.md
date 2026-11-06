# Plan de Modularización y Asignación por Desarrollador (API POS)

Este documento define la distribución equitativa y homogénea del trabajo para el equipo de 4 desarrolladores (**Mafe**, **Juan**, **Brayan** y **Adrian**), alineada a los **Requerimientos Funcionales (RF)**, **No Funcionales (RNF)** y al modelo de datos optimizado (**Camino B**).

---

## 1. Reglas Globales de Trabajo y Arquitectura

1. **Estructura en Capas por Módulo:**
   Cada entidad desarrollada debe contar obligatoriamente con su terna de archivos:
   * `src/models/<entidad>.model.js` (Definición del esquema Mongoose).
   * `src/services/<entidad>.services.js` (Lógica de negocio, cálculos y consultas a la base de datos).
   * `src/controllers/<entidad>.controllers.js` (Recepción de peticiones HTTP, validación y respuestas).
   * `src/routers/<entidad>.routers.js` (Definición de endpoints y middlewares de seguridad).
2. **Estrategia de Ramas en Git:**
   * Cada desarrollador trabajará en su rama asignada (`Usuarios`, `Inventario`, `Ventas`, `Reportes`).
   * No se mezclarán cambios en `main` sin previo *pull request* / revisión.
   * La rama `Usuarios` proveerá la autenticación (`auth.middleware.js`) a las demás ramas.
3. **Manejo de Errores y Transaccionalidad:**
   * Toda respuesta HTTP debe seguir el formato estándar: `{ success: boolean, message: string, data?: any }`.
   * Para operaciones compuestas (ej. venta + deducción de stock + asignación de puntos), usar sesiones transaccionales de Mongoose (`startSession`) para garantizar **RNF-16** (integridad transaccional).

---

## 2. Matriz de Asignación Homogénea

| Desarrollador | Rama Asignada | Módulo Funcional | Entidades a Cargo | Requerimientos Asociados |
| :--- | :--- | :--- | :--- | :--- |
| **Mafe** | `Usuarios` | Seguridad, Acceso y Terceros | `TipoDocumento`, `Usuario`, `Tercero` (Clientes/Proveedores) | RF-01, RF-02, RNF-03, RNF-04, CU-01, CU-02, CU-03 |
| **Juan** | `Inventario` | Catálogo de Productos y Existencias | `Categoria`, `Productos`, `Stock` | RF-03, RF-05, RF-06, RNF-04, CU-16 |
| **Brayan** | `Ventas` | Motor Transaccional de Ventas | `FormaDePago`, `Ventas`, `DetalleVenta` | RF-04, RF-07, RF-08, RF-09, RF-10, RF-11, CU-07, CU-08, CU-09, CU-10 |
| **Adrian** | `Reportes` | Compras, Fidelización y Cierre de Caja | `Compras`, `DetalleCompra`, `Puntos/Fidelizacion`, `CierreCaja/Reportes` | RF-12, RF-13, RF-14, RF-15, RF-16, RF-17, RF-18, CU-11, CU-12, CU-13, CU-14, CU-15 |

---

## 3. Hoja de Ruta Individual por Desarrollador

---

### 👤 MAFE — Módulo de Seguridad, Usuarios y Terceros
* **Rama Git:** `Usuarios`
* **Entidades:** `TipoDocumento` ➔ `Usuario` ➔ `Tercero`

#### Paso a Paso (Orden de menor a mayor dependencia):
1. **Entidad 1 (Nivel 1): `TipoDocumento`**
   * Crear esquema Mongoose con los valores permitidos (`TI`, `CC`, `CE`, `PPT`, `NIT`, `RUT`).
   * Crear CRUD básico para consulta de tipos de documento.
2. **Entidad 2 (Nivel 2): `Usuario` (Operadores del POS)**
   * Esquema con roles estáticos `ADMIN` y `CAJERO` (**RF-01**).
   * Cifrado obligatorio de contraseñas con `bcrypt` (**RNF-03**, **RNF-05**).
   * Generación y validación de tokens JWT en el login (`POST /api/auth/login`).
   * Creación del middleware `checkRole(['ADMIN', 'CAJERO'])` para proteger rutas (**RF-02**, **RNF-04**).
3. **Entidad 3 (Nivel 2): `Tercero` (Clientes y Proveedores)**
   * Esquema unificado para registrar clientes y proveedores sin credenciales de acceso.
   * Incluir campo `puntosFidelizacion` (default 0) en los terceros tipo `CLIENTE` para el módulo de fidelización.
   * Filtros por rol (`GET /api/terceros?tipo=CLIENTE` y `GET /api/terceros?tipo=PROVEEDOR`).

#### Restricciones y Reglas de Negocio:
* Un cajero **nunca** puede crear otros usuarios ni cambiar roles (**RF-02**).
* Clientes y proveedores **no** deben tener clave de acceso ni autenticación.
* El documento y el email de los usuarios deben ser únicos.

---

### 👤 JUAN — Módulo de Inventario y Catálogo
* **Rama Git:** `Inventario`
* **Entidades:** `Categoria` ➔ `Productos` ➔ `Stock`

#### Paso a Paso (Orden de menor a mayor dependencia):
1. **Entidad 1 (Nivel 1): `Categoria`**
   * Esquema para organizar los artículos (ej. Abarrotes, Bebidas, Lácteos).
   * CRUD para crear, listar y editar categorías.
2. **Entidad 2 (Nivel 2): `Productos`**
   * Esquema con campos: `nombreProductos`, `sku` (código de barras/identificador único, **RF-03**), `descripcionProductos`, `precioVenta`, `ivaProductos`, `categoria` (FK) y `estadoProductos`.
   * Integración lista para escáneres de código de barras mediante búsqueda rápida por `sku` (**RNF-18**).
3. **Entidad 3 (Nivel 3): `Stock` (Control de Existencias)**
   * Esquema 1:1 con `Productos`: `producto` (ObjectId único), `totalStock`, `stockMinimo` (**RF-05**).
   * Al crear un producto nuevo, inicializar automáticamente su registro en `Stock`.
   * Servicio `verificarAlertasStockBajo()`: Endpoint que filtre productos donde `totalStock <= stockMinimo` (**RF-05**).
   * Métodos en servicio reutilizables: `incrementarStock(productoId, cantidad)` y `descontarStock(productoId, cantidad)`.

#### Restricciones y Reglas de Negocio:
* Modificar precios de venta o eliminar productos es exclusivo de usuarios con rol `ADMIN` (**RF-06**, **RNF-04**).
* El SKU debe ser único e indexado para búsquedas instantáneas en menos de 3 segundos (**RNF-01**).
* Validar que ningún producto admita stock negativo.

---

### 👤 BRAYAN — Módulo Transaccional de Ventas
* **Rama Git:** `Ventas`
* **Entidades:** `FormaDePago` ➔ `Ventas` ➔ `DetalleVenta`

#### Paso a Paso (Orden de menor a mayor dependencia):
1. **Entidad 1 (Nivel 1): `FormaDePago`**
   * Catálogo con formas admitidas: `Efectivo`, `Tarjeta Débito/Crédito`, `Transferencia/Billetera Digital` (**RF-11**).
2. **Entidad 2 (Nivel 4): `Ventas` (Cabecera)**
   * Esquema con: `cliente` (FK a `Tercero`), `cajero` (FK a `Usuario`), `formaDePago` (FK), `subTotalVentas`, `descuento` (**RF-08**), `ivaVentas`, `totalVentas` y `estadoVentas` (`Completada`, `Anulada`, `Pendiente`).
3. **Entidad 3 (Nivel 5): `DetalleVenta` (Ítems)**
   * Esquema con: `venta` (FK), `producto` (FK), `cantidadVenta`, `valorUnitarioVenta`, `subTotalVenta`, `ivaVenta`, `totalVenta`.
4. **Flujo Transaccional Central (`VentasService.crearVenta`):**
   * Recibe la lista de productos y cantidades.
   * Valida disponibilidad de stock con el servicio de `Inventario`.
   * Aplica descuentos autorizados (máximo permitido por configuración; si supera el límite requiere aprobación de supervisor, **RF-08**, **CU-08**).
   * Descuenta automáticamente el stock de cada producto vendido (**RF-04**, **RF-09**).
   * Invoca el acumulador de puntos en fidelización (**RF-12**).
5. **Servicio de Anulación (`VentasService.anularVenta`):**
   * Solo ejecutable con rol `ADMIN` / supervisor (**RF-10**, **CU-10**).
   * Cambia estado a `Anulada` y revierte/reintegra las existencias en `Stock` (**RF-04**).

#### Restricciones y Reglas de Negocio:
* No se puede cerrar una venta si algún producto tiene stock insuficiente.
* La transacción debe completarse en tiempo real (< 3 segundos, **RNF-01**).
* Las anulaciones deben registrar la justificación y el usuario supervisor que autorizó.

---

### 👤 ADRIAN — Módulo de Compras, Fidelización y Reportes/Cierre de Caja
* **Rama Git:** `Reportes`
* **Entidades:** `Compras` & `DetalleCompra` ➔ `Fidelizacion` ➔ `CierreCaja / Reportes`

#### Paso a Paso (Orden de menor a mayor dependencia):
1. **Entidad 1 (Nivel 4 y 5): `Compras` y `DetalleCompra` (Abastecimiento a Proveedores)**
   * Esquema de `Compras`: `proveedor` (FK a `Tercero`), `usuario` (FK a `Usuario`), totales e impuestos.
   * Esquema de `DetalleCompra`: `compra`, `producto`, `cantidadCompra`, `valorUnitarioCompra`, `totalCompra`.
   * Al registrar una compra, incrementar automáticamente el `Stock` del producto (**RF-04**).
2. **Entidad 2 (Fidelización de Puntos):**
   * Política de puntos: Configurar ratio (ej. 1 punto por cada $1.000 COP en compras, **RF-12**).
   * Endpoint de consulta de saldo de puntos por cliente (**RF-13**, **CU-12**).
   * Endpoint para redimir puntos como método de pago o descuento en una compra (**RF-14**, **CU-13**).
   * Historial de auditoría de puntos ganados y redimidos (**RF-15**).
3. **Entidad 3 (Reportes y Cierre de Caja):**
   * **Cierre de Caja Diario (CU-15, RF-17):** Endpoint que agrupe ventas del día por cajero, total en efectivo, total en tarjeta, descuentos aplicados y puntos otorgados.
   * **Reportes Periódicos (RF-16, CU-14):** Endpoints analíticos con agregaciones de MongoDB (`aggregate`) para ventas diarias/semanales/mensuales, productos con menor y mayor rotación, y estado del inventario.

#### Restricciones y Reglas de Negocio:
* Acceso exclusivo para rol `ADMIN` en la consulta y exportación de reportes (**RF-18**, **CU-14**).
* Los puntos solo pueden ser redimidos por el cliente titular verificado por documento.
* Los reportes son de solo lectura; ninguna operación puede alterar retrospectivamente los históricos financieros.

---

## 4. Contratos de Integración entre Desarrolladores

Para que cada uno avance sin bloquearse mutuamente, se definen los siguientes contratos:

```
[MAFE (Usuarios)] ─── Expone: req.user { id, rol } y Modelo Tercero ────────┐
                                                                            │
[JUAN (Inventario)] ── Expone: descontarStock(id, cant) y sumarStock(id, cant) ┤
                                                                            ▼
[BRAYAN (Ventas)] ──── Consume a Mafe y Juan para validar cajero, cliente y stock
                                                                            │
                                                                            ▼
[ADRIAN (Reportes)] ── Consume a Brayan, Juan y Mafe para generar estadísticas,
                       puntos y balances de caja.
```
