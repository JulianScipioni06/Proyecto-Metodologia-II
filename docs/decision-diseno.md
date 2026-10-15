# Decisiones de Diseño y Mantenibilidad - Taller II

## Caso 1: Modulo de ventas

## 1. Código analizado
* *Ubicación original:* backend/controllers/venta.controller.ts
* *Nuevos componentes:* backend/services/venta.facade.ts (Capa de Servicios/Fachada).
* *Módulo:* Gestión de Ventas, Detalles de Venta e Inventario (Artículos).

## 2. Diagnóstico
Mientras programábamos el controlador de ventas, nos dimos cuenta de que la función de registro o creación de ventas generaba bastante acoplamiento, realizando distintas interacciones con las tablas de artículos y detalles de venta. A su vez, esto rompe el principio de que el módulo tenga una única responsabilidad.

El controlador original crearVenta estaba asumiendo múltiples responsabilidades simultáneas:
* Manejo de la red (recepción de req y envío de res mediante Express).
* Lógica de base de datos directa (apertura de transacciones manuales con Sequelize).
* Lógica de negocio (iteración de arrays, validación de stock insuficiente y actualización de inventario).  

## 3. Alternativas
Al evaluar cómo solucionar este problema de diseño, consideramos tres opciones:
1. *Conservar el estado actual:* Mantener toda la lógica en el controlador justificando que el sistema actual es pequeño. Sin embargo, a medida que la clínica crezca, el código se volvería inmanejable.
2. *Implementar el Patrón Repository:* Abstraer por completo Sequelize creando repositorios para cada modelo. *Se descartó* porque Sequelize ya implementa el patrón Active Record y sumar otra capa de repositorios para el tamaño actual del proyecto representaba una sobreingeniería (overengineering).
3. *Implementar el Patrón Facade / Capa de Servicios:* Extraer toda la lógica de negocio y transacciones a un servicio intermediario, dejando al controlador solo como interfaz HTTP.

## 4. Decisión
Decidimos *aplicar el patrón Facade (Capa de Servicios)* creando el archivo venta.facade.ts. 

Transferimos toda la complejidad operativa (apertura de transacciones, validación de stock, creación de cabecera y detalles, y manejo de commit/rollback) a este nuevo servicio. El controlador de ventas ahora se limita exclusivamente a recibir la petición HTTP, delegar el trabajo pesado a la Fachada, y devolver la respuesta al cliente.

## 5. Evidencia y trade-offs
*Evidencia del cambio:*
* https://github.com/JulianScipioni06/Proyecto-Metodologia-II/commit/c4e4197ad00c9198bf3607821d236c13e4dbdbaf

*Trade-offs (Beneficios y Costos):*
* *Beneficios:* 
  * Logramos *alta cohesión* (el controlador solo maneja HTTP, la fachada solo maneja el negocio) y *bajo acoplamiento*.
  * Cumplimos con el principio *SRP* (Single Responsibility Principle).
  * La lógica de negocio ahora se puede testear de manera unitaria sin necesidad de simular objetos de Express (Requests y Responses).
* *Costos:* 
  * Se introdujo un nivel adicional de indirección y aumentó la cantidad de archivos en el proyecto, lo cual añade una leve complejidad inicial en la navegación del código. Sin embargo, este costo es ampliamente superado por los beneficios en la mantenibilidad a largo plazo.  
  
  
---

## Caso 2: Conexión a la Base de Datos 
---

### 1. Código analizado
* **Ubicación:** `backend/models/index.ts` y configuración de Sequelize.
* **Módulo:** Infraestructura / Conexión a base de datos Neon (PostgreSQL).

----
----
### 2. Diagnóstico
Al analizar cómo la aplicación se conectaba a la base de datos, nos preguntamos si la forma en la que estábamos exportando e importando la variable `db` en los distintos controladores era la más óptima. Teníamos que asegurarnos de no estar abriendo una conexión nueva a Neon DB cada vez que un usuario hacía una petición HTTP, ya que eso saturaría el servidor y violaría las buenas prácticas de rendimiento.

----
### 3. Alternativas
Consideramos dos formas de manejar la conexión:
1. **Crear una instancia nueva por cada petición:** Inviable para producción, consume demasiada memoria y agota el límite de conexiones de la base de datos.
2. **Aplicar el Patrón Singleton:** Asegurar que la clase o módulo que maneja la base de datos devuelva siempre una única instancia compartida para toda la aplicación.

----
### 4. Decisión
Decidimos **conservar el código actual** ya que confirmamos que la configuración por defecto de nuestro `index.ts` implementa exitosamente el patrón **Singleton**. 
Al instanciar `new Sequelize(...)` una sola vez al levantar el servidor y exportar ese objeto, garantizamos que cualquier controlador o fachada que haga `import db from '../models/index'` esté utilizando exactamente la misma conexión en memoria. No hacía falta cambiarlo, pero lo validamos técnicamente.

----
----
### 5. Evidencia y trade-offs
**Evidencia del código:**
* En el archivo `index.ts`, la conexión se establece una sola vez y se exporta el objeto `db`. Todos los módulos consumen esta misma instancia.

**Trade-offs (Beneficios y Costos):**
* **Beneficios:** Ahorro gigante de recursos y memoria. Evitamos cuellos de botella en la base de datos al limitar la cantidad de conexiones simultáneas.
* **Costos:** Al ser un estado global compartido, si la conexión se cae en medio de la ejecución, afecta a toda la aplicación al mismo tiempo, lo que nos obliga a manejar bien los errores a nivel del `Server`.