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

### 1. Clonar el repositorio
```bash
git clone https://github.com/JulianScipioni06/Proyecto-Metodologia-II.git
cd Proyecto-Metodologia-II
```

### 2. Configurar la Base de Datos
1. Abre pgAdmin en tu computadora.
2. Crea una nueva base de datos llamada vetsync (o el nombre que prefieras).

### 3. Configurar Variables de Entorno
Dentro de la carpeta del backend, encontrarás un archivo .env.example.
1. Duplícalo y renómbralo a .env.
2. Completa las variables con tus credenciales locales de PostgreSQL (usuario, contraseña, puerto local y nombre de la base de datos creada en el paso anterior).

**Importante**: El archivo .env no debe ser subido al repositorio.

### 4. Instalar dependencias
Debes instalar los paquetes tanto del servidor como del cliente:
```bash
# En el directorio del backend
cd backend
pnpm install

# En el directorio del frontend
cd ../frontend
pnpm install
```

### 5. Iniciar la Aplicación
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
