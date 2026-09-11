# Sistema de Gestion para Veterinaria - VetSync
Este proyecto se trata de un sistema de gestion web para la administracion de una veterinaria, permitiendo llevar un registro de los animales atendidos, sumado a un control del stock y los clientes.

# ¿Que problema resuelve?
En muchas veterinarias la gestión del día a día se sigue realizando de manera analógica o con herramientas desconectadas (cuadernos para los turnos, planillas de Excel para el stock, y fichas de papel para las historias clínicas). Esto provoca, perdida de informacion, desorganizacion de la agenda y falta de control de stock.

VetSync centraliza toda la gestión en una única plataforma digital. Permite a los veterinarios acceder al historial clínico de cualquier mascota en segundos, administrar la agenda de turnos de forma eficiente y tener un control claro del inventario.

# Integrantes
Los integrantes del grupo que realizan el proyecto son:
* Bautista Pozo
* Julian Ripa
* Julian Scipioni
* Joaquin Wener

# Tecnologias a Utilizar
### Frontend
* React 
* TypeScript 

### Backend
* Node.js 
* Express.js
* Typescript

### Base de datos
* PostgreSQL 
* Sequelize 

### Herramientas
* Git / GitHub 
* Docker 
* Postman 
* JWT 

Nota: Estas tecnologias a lo largo del desarrollo pueden cambiar, frente a las necesidades que se presenten.

## Instalación y Ejecución Local

Para levantar el proyecto en tu entorno local, es necesario contar con los siguientes requisitos instalados en tu computadora:
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [PostgreSQL](https://www.postgresql.org/) y pgAdmin
* [Git](https://git-scm.com/)
* [pnpm](https://pnpm.io/)

### 1. Clonar el repositorio
```bash
git clone https://github.com/JulianScipioni06/Proyecto-Metodologia-II.git
cd Proyecto-Metodologia-II
```

### 2. Instalar dependencias
Debes instalar los paquetes tanto del servidor como del cliente:
```bash
# En el directorio del backend
cd backend
pnpm install

# En el directorio del frontend
cd ../frontend
pnpm install
```

### 3. Iniciar la Aplicación
Abre dos terminales en simultáneo:

* Terminal 1 (Backend):
    ```bash
    cd backend
    pnpm run dev
    ```

* Terminal 2 (Frontend):
    ```bash
    cd frontend
    pnpm run dev
    ```

## Estado del Proyecto
🚧 **En desarrollo (Fase Inicial - Setup de Entorno)** 🚧
Actualmente, el proyecto se encuentra en su fase inicial. Donde se estan terminando de definir conceptos para arrnacar con el desarrollo del mismo.

## Próximos Pasos
A corto y mediano plazo, el equipo tiene planificado avanzar con los siguientes hitos:
* **Construcción de la Metodología del Sistema:** Definición detallada de los requerimientos funcionales, historias de usuario y flujos de trabajo del sistema veterinario.
* **Modelado de la Base de Datos:** Diseño de las entidades principales (Mascotas, Clientes, Turnos, Inventario) y su respectiva implementación utilizando Sequelize como ORM.
* **Configuración de Conexión de Datos:** Integración del servidor backend con PostgreSQL mediante variables de entorno (`.env`) seguras.
* **Maquetado de la Interfaz (Frontend):** Creación de las vistas y componentes iniciales en React para el panel de administración.