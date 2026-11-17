# Documentación de Pruebas en Postman — Módulo de Facturación y Ventas (Brayan)

Esta documentación detalla los endpoints, requerimientos técnicos, reglas de negocio y casos de prueba para el **Módulo de Facturación y Ventas (POS)** bajo la arquitectura **Camino B**.

El archivo de colección oficial para importar en Postman es:
`POS_Ventas_Collection.postman_collection.json`

---

## 1. Variables de Colección en Postman

Al importar la colección, encontrarás configuradas las siguientes variables:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `base_url` | URL raíz de la API | `http://localhost:3000/api` |
| `token_cajero` | Token JWT con rol `CAJERO` | *(Completar tras login)* |
| `token_admin` | Token JWT con rol `ADMIN` | *(Completar tras login)* |
| `cliente_id` | ID (`ObjectId`) del cliente (`TerceroModel`) | `ID_VALIDO` |
| `forma_pago_id` | ID (`ObjectId`) de la forma de pago | *(Se guarda automáticamente)* |
| `producto_id` | ID (`ObjectId`) del producto a facturar | `ID_VALIDO` |
| `venta_id` | ID de la venta creada en las pruebas | *(Se guarda automáticamente)* |

---

## 2. Estructura de Endpoints por Carpetas

### Carpeta 01: Formas de Pago (Nivel 1)
* **`GET /api/formas-de-pago`**:
  * **Propósito**: Obtener los métodos de liquidación oficiales (Efectivo, Tarjeta, Nequi, Daviplata, etc.) para poblar el `<select>` en el componente `CheckoutPOS.jsx` de React 19.
  * **Header**: `Authorization: Bearer {{token_cajero}}`
  * **Test Script**: Captura automáticamente el primer ID retornado y lo guarda en `{{forma_pago_id}}`.
* **`POST /api/formas-de-pago`**:
  * **Propósito**: Registrar nuevos métodos de pago en el catálogo.
  * **Permiso**: Exclusivo rol `ADMIN`.

---

### Carpeta 02: Cobro Transaccional de Ventas (Niveles 4 y 5)
* **`POST /api/ventas` (Venta Exitosa)**:
  * **Propósito**: Registrar la venta en `VentasModel`, crear los registros en `DetalleVentaModel` y descontar inventario en una única transacción atómica con `mongoose.startSession()`.
  * **Payload (Compatible con React 19)**:
    ```json
    {
      "cliente": "{{cliente_id}}",
      "formaDePago": "{{forma_pago_id}}",
      "subTotalVentas": 50000,
      "descuento": 0,
      "ivaVentas": 9500,
      "totalVentas": 59500,
      "items": [
        {
          "producto": "{{producto_id}}",
          "cantidadVenta": 2,
          "valorUnitarioVenta": 25000,
          "subTotalVenta": 50000,
          "ivaVenta": 19,
          "totalVenta": 59500
        }
      ]
    }
    ```
  * **Test Script**: Captura el `_id` de la venta creada y lo asigna a la variable `{{venta_id}}`.

* **`POST /api/ventas` (Regla RF-08: Descuento > 10% rechazado para Cajero)**:
  * Envía un descuento del 15% ($15.000 sobre $100.000) con token de `CAJERO`.
  * **Respuesta esperada**: `403 Forbidden` (`Descuento no autorizado...`).

* **`POST /api/ventas` (Regla RF-08: Descuento > 10% autorizado por ADMIN)**:
  * Envía el mismo descuento del 15% pero con `{{token_admin}}`.
  * **Respuesta esperada**: `201 Created`.

* **`POST /api/ventas` (Regla RNF-05: Rechazo por Stock Insuficiente)**:
  * Envía una cantidad desorbitada (`99999`).
  * **Respuesta esperada**: `400 Bad Request` (`Stock insuficiente...`), verificando que no existan existencias negativas.

---

### Carpeta 03: Consultas e Historial
* **`GET /api/ventas`**:
  * Lista todas las ventas con `.populate('cliente')`, `.populate('cajero')` y `.populate('formaDePago')`.
* **`GET /api/ventas/:id`**:
  * Retorna la cabecera de la venta junto con sus `detalles` asociados.
* **`GET /api/detalles-venta?ventaId={{venta_id}}`**:
  * Consulta directa sobre la colección `DetalleVentaModel`.

---

### Carpeta 04: Anulación Supervisada (RF-09)
* **`PATCH /api/ventas/:id/anular` (ADMIN)**:
  * Cambia el `estadoVentas` a `'Anulada'` y reintegra automáticamente las cantidades al stock de cada producto.
  * **Respuesta esperada**: `200 OK`.
* **`PATCH /api/ventas/:id/anular` (CAJERO)**:
  * Intento de anulación por parte de un cajero.
  * **Respuesta esperada**: `403 Forbidden`.

---

## 3. Cómo Importar en Postman

1. Abre la aplicación de **Postman**.
2. Haz clic en el botón **Import** (esquina superior izquierda).
3. Selecciona o arrastra el archivo:
   `c:\Users\Equipo casa\Desktop\POS\POS_Ventas_Collection.postman_collection.json`
4. En las variables de la colección, asigna tu `token_cajero` y `token_admin` (o tu ID de cliente/producto si ya tienes datos creados).
5. Ejecuta las peticiones en orden:
   1. `Listar Formas de Pago` (guarda `forma_pago_id`)
   2. `Registrar Venta Exitosa` (guarda `venta_id`)
   3. `Consultar Venta por ID`
   4. `Anular Venta`
