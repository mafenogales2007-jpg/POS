# Documentación de Pruebas en Postman — Módulo Catálogo e Inventario (Juan)

Esta documentación detalla los endpoints, esquemas, índices y casos de prueba para el **Módulo de Catálogo e Inventario** bajo la arquitectura **Camino B**.

El archivo de colección oficial para importar en Postman es:
`POS_Inventario_Collection.postman_collection.json`

---

## 1. Variables de Colección en Postman

Al importar la colección, encontrarás configuradas las siguientes variables:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `base_url` | URL raíz de la API | `http://localhost:3000/api` |
| `token_admin` | Token JWT con rol `ADMIN` | *(Completar tras login)* |
| `token_cajero` | Token JWT con rol `CAJERO` | *(Completar tras login)* |
| `categoria_id` | ID de la categoría creada | *(Se guarda automáticamente)* |
| `producto_id` | ID del producto creado | *(Se guarda automáticamente)* |
| `sku_test` | Código SKU de prueba indexado | `SKU-BEB-001` |

---

## 2. Endpoints y Casos de Prueba

### Carpeta 01: Catálogo de Categorías (HU-04 / RF-04)
* **`POST /api/categorias` (Solo ADMIN)**:
  * Crea una categoría con `nombreCategoria` único.
  * Guarda automáticamente el `_id` en la variable `{{categoria_id}}`.
* **`GET /api/categorias`**:
  * Lista todas las categorías activas.

---

### Carpeta 02: Catálogo de Productos con SKU (HU-05 / RF-04 / RNF-01)
* **`POST /api/productos` (Solo ADMIN)**:
  * Crea el producto en `ProductosModel` (`sku`, `nombreProductos`, `precioVenta`, `ivaProductos`, `categoria`) e inicializa su vinculación 1:1 en `StockModel` (`totalStock`, `stockMinimo`).
  * Guarda el ID en `{{producto_id}}`.
* **`GET /api/productos`**:
  * Lista los productos junto a su información de existencias y la bandera booleana `stockCritico`.
* **`GET /api/productos/sku/:sku` (< 2 segundos, RNF-01)**:
  * Búsqueda ágil por SKU indexado para captura con escáner de código de barras en el checkout.

---

### Carpeta 03: Control y Alertas de Stock (HU-06 / RF-05 / RF-06)
* **`GET /api/stock/alertas`**:
  * Consulta de productos con `totalStock <= stockMinimo` para alimentar las etiquetas visuales de alerta en React 19.
* **`GET /api/stock/producto/:id`**:
  * Consulta el balance de existencias de un producto específico.
