import sequelize from './connection';
import Articulo from './articulos.model';
import Venta from './venta.model';
import DetalleVenta from './detalleVenta.model';
import Cliente from './clientes.model';
import Turno from './turnos.modelo'
import Mascota from './mascotas.models';
// Importá acá el resto de tus modelos (Cliente, Mascota, etc.)

// Si tuvieras que armar las relaciones (las Foreign Keys), las definís acá abajo. 
// Ejemplo:
// Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });
// DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });

const db = {
    sequelize,
    Articulo,
    Venta,
    DetalleVenta,
    Cliente,
    Turno,
    Mascota
    // Agregá el resto acá
};

export default db;