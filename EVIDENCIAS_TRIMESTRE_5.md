# Documento de Evidencia Técnica - Trimestre 5
## Sistema POS Transaccional (Camino B) - Módulo de Usuarios, Seguridad y Terceros

**Programa:** Análisis y Desarrollo de Software (ADSO) - SENA  
**Integrantes:** Mafe (Líder Módulo Seguridad, Operadores y Terceros), Juan, Brayan, Adrian  
**Rama de Desarrollo Backend:** `feat/usuarios-seguridad` / `Usuarios`  
**Tecnologías:** Node.js v24, Express v5, MongoDB Atlas, Mongoose v9, JWT, PBKDF2  
**Fecha de Entrega:** Noviembre 2026  

---

## 1. Cumplimiento de Criterios y Entregables del Trimestre 5

| Criterio Exigido | Implementación en el Proyecto | Estado |
| :--- | :--- | :---: |
| **API REST Segura con JWT** | Emisión y validación de JSON Web Tokens con cabecera `Authorization: Bearer <token>` y encriptación de claves con PBKDF2 (100.000 iteraciones con Salt). | **Cumplido** |
| **Manejo de CORS** | Middleware nativo implementado para permitir comunicación fluida con clientes SPA (React 19 / Vite / CRA) sin bloqueos por origen cruzado. | **Cumplido** |
| **Manejo Estándar de Códigos HTTP** | Respuestas predecibles utilizando códigos de estado HTTP 200, 201, 400, 401, 403, 404 y 500 con formato unificado `{ success, message, data }`. | **Cumplido** |
| **Documentación con Postman** | Colección estructurada y parametrizada con variables de entorno (`{{base_url}}`, `{{token_admin}}`, `{{tipo_doc_id}}`) y scripts automáticos de captura de token. | **Cumplido** |
| **Control de Versiones (Git)** | Flujo de trabajo basado en ramas temáticas por módulo funcional, convención de nombres y control de commits. | **Cumplido** |

---

## 2. Arquitectura Backend en 4 Capas Obligatoria

El módulo respeta estrictamente el principio de responsabilidad única dividiendo la lógica en 4 niveles desacoplados:

```
[Cliente HTTP / Frontend React 19]
               │ (JSON / Bearer Token)
               ▼
1. Capa de Enrutamiento (routers/)    --> routers/users.routers.js, tipoDocumento.routers.js, tercero.routers.js
               │
               ▼
2. Capa de Controladores (controllers/) --> controllers/users.controllers.js, tipoDocumento.controllers.js, tercero.controllers.js
               │
               ▼
3. Capa de Servicios (services/)      --> services/users.services.js, tipoDocumento.services.js, tercero.services.js
               │
               ▼
4. Capa de Modelos (models/)          --> models/users.model.js, tipoDocumento.model.js, tercero.model.js (Mongoose)
               │
               ▼
        [MongoDB Atlas]
```

---

## 3. Catálogo de Endpoints y Matriz de Pruebas

### 3.1. Catálogo Maestro: Tipos de Documento

| Método | Endpoint | Acceso / Rol | Código Éxito | Códigos Error | Descripción |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **GET** | `/api/tipos-documento` | Público / Auth | `200 OK` | `500` | Lista todos los tipos de documento oficiales (`CC`, `TI`, `NIT`, `RUT`, `CE`, `PPT`). |
| **POST** | `/api/tipos-documento` | `ADMIN` | `201 Created` | `400, 500` | Registra un nuevo tipo oficial con validación única y mayúsculas automáticas. |
| **GET** | `/api/tipos-documento/:id` | Público / Auth | `200 OK` | `404, 500` | Consulta un tipo de documento específico por su `ObjectId`. |

---

### 3.2. Seguridad, Autenticación y Operadores del POS

| Método | Endpoint | Acceso / Rol | Código Éxito | Códigos Error | Descripción |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **POST** | `/api/users/login` | Público | `200 OK` | `400, 401` | Inicio de sesión con correo o número de documento y contraseña. Retorna token JWT. |
| **GET** | `/api/users/perfil` | Cualquier Operador | `200 OK` | `401, 403` | Obtiene los datos del operador en sesión descifrados del token JWT. |
| **POST** | `/api/users` | Exclusivo `ADMIN` | `201 Created` | `400, 401, 403` | Registro de nuevo operador (`ADMIN` o `CAJERO`) con clave encriptada (RF-02). |
| **GET** | `/api/users` | Exclusivo `ADMIN` | `200 OK` | `401, 403` | Listado completo de operadores activos e inactivos. |
| **PATCH** | `/api/users/:id/estado` | Exclusivo `ADMIN` | `200 OK` | `400, 401, 403, 404` | Desactivación o activación de operadores (baja lógica). |

---

### 3.3. Directorio Unificado de Terceros (Clientes y Proveedores)

| Método | Endpoint | Acceso / Rol | Código Éxito | Códigos Error | Descripción |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **POST** | `/api/terceros` | Operador Auth | `201 Created` | `400, 401` | Registra un cliente o proveedor (persona natural o jurídica). |
| **GET** | `/api/terceros` | Operador Auth | `200 OK` | `401, 500` | Lista terceros con soporte de filtros: `?tipo=CLIENTE`, `?tipo=PROVEEDOR` y búsqueda por texto `?busqueda=...`. |
| **GET** | `/api/terceros/documento/:doc` | Operador Auth | `200 OK` | `401, 404` | Búsqueda directa por cédula/NIT para facturación ágil en la terminal POS. |
| **GET** | `/api/terceros/:id` | Operador Auth | `200 OK` | `401, 404` | Obtiene el detalle de un tercero específico. |
| **PUT** | `/api/terceros/:id` | Operador Auth | `200 OK` | `400, 401, 404` | Actualización de datos de contacto y comerciales. |
| **PATCH**| `/api/terceros/:id/estado` | Exclusivo `ADMIN` | `200 OK` | `400, 401, 403, 404` | Habilitación o inhabilitación comercial de un tercero. |

---

## 4. Estándar de Respuestas HTTP y Manejo de Errores

Para garantizar consistencia con el frontend en React 19, todas las respuestas mantienen un esquema uniforme:

### Estructura de Éxito (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Operador registrado exitosamente",
  "data": {
    "_id": "672f8a12e345...",
    "documentoUsuario": "1020304050",
    "nombreUsuario": "Carlos",
    "apellidoUsuario": "Perez",
    "emailUsuario": "carlos.cajero@senastore.com",
    "rol": "CAJERO",
    "estadoUsuario": true
  }
}
```

### Estructura de Error Controlado (HTTP 400 / 401 / 403 / 404)
```json
{
  "success": false,
  "message": "Acceso denegado: El rol 'CAJERO' no tiene permisos para esta operación"
}
```

---

## 5. Guía de Ejecución y Evidencias en Postman

1. **Importación:** Importar el archivo `POS_API_Collection.postman_collection.json` en Postman.
2. **Variable de Entorno Base:** `{{base_url}} = http://localhost:3000/api`.
3. **Flujo de Prueba 1 (Creación de Tipo Documento):** Ejecutar `POST /api/tipos-documento` con cuerpo `{"descripcionTipoDocumento": "CC"}`. Copiar el `_id` obtenido en la variable `{{tipo_doc_id}}`.
4. **Flujo de Prueba 2 (Autenticación y Captura Dinámica de JWT):** Ejecutar `POST /api/users/login`. El script en la pestaña *Tests* guarda automáticamente el token en `{{token_admin}}`.
5. **Flujo de Prueba 3 (Ruta Protegida):** Ejecutar `GET /api/users/perfil` con la cabecera `Authorization: Bearer {{token_admin}}`. Se evidencia respuesta 200 OK.
6. **Flujo de Prueba 4 (Validación de Error 401/403):** Ejecutar una petición protegida sin cabecera o con un token manipulado para evidenciar el control de excepciones de seguridad.

---

## 6. Evidencias del Control de Versiones (Git)

* **Rama activa de trabajo:** `Usuarios` (`feat/usuarios-seguridad`).
* **Ramas remotas del equipo sincronizadas:** `origin/main`, `origin/Inventario`, `origin/Ventas`, `origin/Reportes`.
* **Commits realizados:** Trazabilidad completa con mensajes semánticos de creación de modelos, servicios, controladores, middlewares y documentación.
