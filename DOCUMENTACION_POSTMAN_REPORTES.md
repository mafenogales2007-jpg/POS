# Documentación de Pruebas en Postman — Módulo Compras, Fidelización y Cierre de Caja (Adrian)

Esta documentación detalla los endpoints, requerimientos técnicos, reglas de negocio y casos de prueba para el **Módulo de Compras, Fidelización y Cierre de Caja** bajo la arquitectura **Camino B**.

El archivo de colección oficial para importar en Postman es:
`POS_Reportes_Collection.postman_collection.json`

---

## 1. Variables de Colección en Postman

Al importar la colección, encontrarás configuradas las siguientes variables:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `base_url` | URL raíz de la API | `http://localhost:3000/api` |
| `token_admin` | Token JWT con rol `ADMIN` | *(Completar tras login)* |
| `token_cajero` | Token JWT con rol `CAJERO` | *(Completar tras login)* |
| `proveedor_id` | ID (`ObjectId`) del proveedor en `TerceroModel` | `ID_VALIDO` |
| `producto_id` | ID (`ObjectId`) del producto a comprar | `ID_VALIDO` |
| `cliente_id` | ID o cédula del cliente para puntos | `ID_VALIDO` |
| `compra_id` | ID de la compra registrada en las pruebas | *(Se guarda automáticamente)* |

---

## 2. Endpoints y Casos de Prueba

### Carpeta 01: Abastecimiento a Proveedores (HU-10 / RF-10)
* **`POST /api/compras` (Registrar Compra y Aumentar Stock)**:
  * Registra la factura en `ComprasModel`, guarda los ítems en `DetalleCompraModel` y **aumenta automáticamente las existencias** del producto en una sola transacción atómica.
  * **Permiso**: Exclusivo rol `ADMIN`.
* **`GET /api/compras`**:
  * Lista todas las compras con `.populate('proveedor')` y `.populate('usuario')`.
* **`GET /api/compras/:id`**:
  * Detalle completo de una factura de compra junto a sus productos.

---

### Carpeta 02: Fidelización de Puntos (HU-11 / RF-11)
* **`GET /api/puntos/:identificador`**:
  * Consulta el saldo de puntos acumulados por un cliente pasando su ID o cédula.
* **`POST /api/puntos/redimir`**:
  * Descuenta puntos del saldo del cliente al canjearlos en caja.
  * **Permiso**: Cajeros y Administradores.

---

### Carpeta 03: Cierre de Caja y Arqueo (HU-12 / RF-12)
* **`GET /api/caja/cierre-diario?fecha=YYYY-MM-DD`**:
  * Agregación analítica que totaliza las ventas del día, agrupadas por operador (`cajero`) y por método de pago (`Efectivo`, `Tarjeta`, `Nequi`, etc.).
  * **Permiso**: Exclusivo rol `ADMIN`.

---

### Carpeta 04: Reportes Analíticos y Rotación (HU-12 / RF-13)
* **`GET /api/reportes/rotacion?limite=10`**:
  * Ranking de productos con mayor número de unidades vendidas, ingresos históricos y existencias actuales.
  * **Permiso**: Exclusivo rol `ADMIN`.
