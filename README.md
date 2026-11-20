# Sistema de Gestión para Veterinaria - VetSync

Sistema web full-stack para la administración integral de una veterinaria. Permite gestionar clientes, mascotas, agenda de turnos, inventario de artículos y facturación de ventas con control automático de stock.

## ¿Qué problema resuelve?

En muchas veterinarias la gestión diaria se sigue realizando de manera analógica o con herramientas desconectadas (cuadernos para turnos, planillas sueltas para el stock y fichas de papel). Esto provoca pérdida de información, desorganización en la agenda y falta de control sobre el inventario.

**VetSync** centraliza toda la operación en una única plataforma digital, permitiendo administrar dueños, pacientes, turnos y ventas con descuento y restitución automática de stock en tiempo real.

## Funcionalidades Implementadas

* **Clientes:** Alta, baja, modificación y listado de dueños y datos de contacto.
* **Mascotas:** Registro de pacientes (nombre, especie, raza) y vinculación con su dueño.
* **Turnos:** Agenda clínica con fecha, horario, mascota asignada, descripción, monto y estado (`Pendiente`, `Confirmado`, `Completado`, `Cancelado`).
* **Artículos:** Control de inventario con categorías, stock disponible y precio unitario.
* **Ventas y Facturación:** Carrito interactivo con validación de stock disponible, registro transaccional de ventas con descuento automático de stock, visualización del detalle de artículos comprados y anulación de ventas con restitución automática de stock.

## Integrantes

* Bautista Pozo
* Julián Ripa
* Julián Scipioni
* Joaquín Wener

## Tecnologías Utilizadas

### Frontend
* **React** + **TypeScript**
* **Vite**

### Backend
* **Node.js** + **Express.js** + **TypeScript**
* **Sequelize** (ORM)

### Base de Datos
* **PostgreSQL** (alojada en **Neon DB**)

### Calidad de Código y Testing
* **Vitest** (tests unitarios y mocking)
* **ESLint** (análisis estático y reglas estrictas de TypeScript)
* **Prettier** (formateo consistente de código)
* **Git / GitHub** (flujo de trabajo con ramas `main`, `dev` y Pull Requests)

## Estructura del Proyecto

```text
Proyecto-Metodologia-II/
├── backend/
│   ├── config/          # Configuración de conexión a base de datos
│   ├── controllers/     # Controladores de la API REST
│   ├── core/            # Configuración principal del servidor Express (server.ts)
│   ├── middlewares/     # Validaciones de entrada y manejador global de errores
│   ├── models/          # Modelos Sequelize y definición de relaciones
│   ├── routes/          # Definición de endpoints (/api/clientes, /mascotas, /turnos, /articulos, /ventas)
│   ├── services/        # Lógica de negocio compleja (VentaFacade con transacciones)
│   └── tests/           # Suites de pruebas unitarias (middlewares y ventas)
└── frontend/
    └── src/
        ├── components/  # Componentes de interfaz (Sidebar)
        ├── pages/       # Vistas de cada módulo (Clientes, Mascotas, Turnos, Artículos, Ventas)
        ├── services/    # Cliente HTTP centralizado (api.ts)
        └── types/       # Interfaces TypeScript del dominio
```

## Instalación, Configuración y Ejecución Local
Requisitos previos
* Node.js (v18 o superior)
* pnpm
* Git
* Acceso a una base de datos PostgreSQL (local o en Neon DB)


### 1. Clonar el repositorio
```bash
git clone [https://github.com/JulianScipioni06/Proyecto-Metodologia-II.git](https://github.com/JulianScipioni06/Proyecto-Metodologia-II.git)
cd Proyecto-Metodologia-II
```

### 2. Instalar dependencias
```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 3. Configurar variables de entorno

En la carpeta `backend/`, copiar el archivo `.env.example` como `.env` y completar las credenciales de PostgreSQL:

```env
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=tu_host_postgres
DB_NAME=tu_base_de_datos
PGHOST=tu_host_postgres
```

En `frontend/`, el cliente apunta por defecto a `http://localhost:3000/api`. Si el backend corre en otra URL, se puede definir opcionalmente `VITE_API_URL` en un archivo `frontend/.env`.

### 4. Iniciar la aplicación
Abrir dos terminales en simultáneo:

* **Terminal 1 (Backend):**
  ```bash
  cd backend
  pnpm run dev
  ```
* **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  pnpm run dev
  ```

## Calidad de Código y Testing Automatizado

Para asegurar la mantenibilidad y el correcto funcionamiento del backend, se integraron herramientas de verificación automática ejecutables desde `backend/`:

| Comando | Descripción |
| :--- | :--- |
| `pnpm test` | Ejecuta todas las suites de pruebas unitarias con **Vitest**. |
| `pnpm run lint` | Ejecuta **ESLint** para detectar errores de código y problemas de tipado (como uso de `any`). |
| `pnpm run format:check` | Verifica que el formato cumpla con las reglas de **Prettier**. |
| `pnpm run format` | Aplica automáticamente el formato de **Prettier**. |
| `pnpm run check` | Ejecuta la verificación completa: **ESLint + Prettier + Vitest**. |

### Estrategia de Testing
Los tests unitarios siguen el patrón **AAA (Arrange - Act - Assert)** y los principios **FIRST** (aislando la base de datos mediante mocks de Sequelize con `vi.mock` para que sean rápidos y repetibles).

Se priorizaron dos áreas críticas del sistema cubriendo **casos normales, casos límite y casos de error**:

1. **Lógica de negocio transaccional (`tests/ventas/venta.facade.test.ts`):**
   * `registrarVenta`: valida el registro de venta, descuento de stock y `commit` (caso normal), consumo exacto del stock dejándolo en `0` (caso límite), y ejecución de `rollback` ante stock insuficiente o artículo inexistente (casos de error).
   * `cancelarVenta`: verifica la restitución del stock, eliminación de detalles/venta y `commit` (caso normal), y `rollback` si la venta no existe (caso de error).
2. **Validación de entradas y manejo de errores (`tests/middlewares/*.test.ts`):**
   * Pruebas sobre `articulo`, `cliente`, `mascota`, `turno`, `venta` y `errorHandlerGlobal`, verificando paso correcto a `next()`, aceptación de valores borde válidos (`0`, campos opcionales vacíos) y respuestas `400`/`500` ante campos faltantes, `null` o tipos inválidos.








