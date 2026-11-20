import { describe, it, expect, vi, beforeEach } from 'vitest';
import ventaFacade, { ItemVenta } from '../../services/venta.facade';
import db from '../../models/index';
import Venta from '../../models/venta.model';
import DetalleVenta from '../../models/detalleVenta.model';
import Articulo from '../../models/articulos.model';

vi.mock('../../models/index', () => ({
    default: {
        sequelize: {
            transaction: vi.fn(),
        },
    },
}));

vi.mock('../../models/venta.model', () => ({
    default: {
        create: vi.fn(),
        findByPk: vi.fn(),
    },
}));

vi.mock('../../models/detalleVenta.model', () => ({
    default: {
        create: vi.fn(),
        findAll: vi.fn(),
        destroy: vi.fn(),
    },
}));

vi.mock('../../models/articulos.model', () => ({
    default: {
        findByPk: vi.fn(),
    },
}));

describe('VentaFacade', () => {
    const mockTransaction = {
        commit: vi.fn(),
        rollback: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(db.sequelize.transaction).mockResolvedValue(
            mockTransaction as never
        );
    });

    describe('registrarVenta', () => {
        it('Caso normal: registra la venta, guarda el monto total y descuenta el stock', async () => {
            // arrange
            const idCliente = 1;
            const montoTotal = 300;
            const items: ItemVenta[] = [
                { id_articulo: 10, cant_articulo: 3, precio_unidad: 100 },
            ];

            const ventaCreadaMock = {
                id_venta: 50,
                id_cliente: idCliente,
                monto_total: montoTotal,
            };
            const articuloMock = {
                id_articulo: 10,
                stock: 10,
                save: vi.fn().mockResolvedValue(true),
            };

            vi.mocked(Venta.create).mockResolvedValue(ventaCreadaMock as never);
            vi.mocked(Articulo.findByPk).mockResolvedValue(
                articuloMock as never
            );
            vi.mocked(DetalleVenta.create).mockResolvedValue({} as never);

            // act
            const resultado = await ventaFacade.registrarVenta(
                idCliente,
                items,
                montoTotal
            );

            // assert
            expect(resultado).toEqual(ventaCreadaMock);
            expect(Venta.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    id_cliente: idCliente,
                    monto_total: montoTotal,
                }),
                { transaction: mockTransaction }
            );
            expect(articuloMock.stock).toBe(7);
            expect(articuloMock.save).toHaveBeenCalledWith({
                transaction: mockTransaction,
            });
            expect(DetalleVenta.create).toHaveBeenCalledWith(
                {
                    id_venta: 50,
                    id_articulo: 10,
                    cant_articulo: 3,
                    precio_unidad: 100,
                },
                { transaction: mockTransaction }
            );
            expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
            expect(mockTransaction.rollback).not.toHaveBeenCalled();
        });

        it('Caso límite: permite la venta cuando se consume exactamente todo el stock y lo deja en 0', async () => {
            // arrange
            const idCliente = 1;
            const montoTotal = 1000;
            const items: ItemVenta[] = [
                { id_articulo: 10, cant_articulo: 5, precio_unidad: 200 },
            ];

            const ventaCreadaMock = {
                id_venta: 51,
                id_cliente: idCliente,
                monto_total: montoTotal,
            };
            const articuloMock = {
                id_articulo: 10,
                stock: 5,
                save: vi.fn().mockResolvedValue(true),
            };

            vi.mocked(Venta.create).mockResolvedValue(ventaCreadaMock as never);
            vi.mocked(Articulo.findByPk).mockResolvedValue(
                articuloMock as never
            );
            vi.mocked(DetalleVenta.create).mockResolvedValue({} as never);

            // act
            const resultado = await ventaFacade.registrarVenta(
                idCliente,
                items,
                montoTotal
            );

            // assert
            expect(resultado).toEqual(ventaCreadaMock);
            expect(articuloMock.stock).toBe(0);
            expect(articuloMock.save).toHaveBeenCalledWith({
                transaction: mockTransaction,
            });
            expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
            expect(mockTransaction.rollback).not.toHaveBeenCalled();
        });

        it('Caso de error: lanza error y hace rollback si el stock es insuficiente', async () => {
            // arrange
            const idCliente = 1;
            const montoTotal = 600;
            const items: ItemVenta[] = [
                { id_articulo: 10, cant_articulo: 6, precio_unidad: 100 },
            ];

            const articuloMock = {
                id_articulo: 10,
                stock: 5,
                save: vi.fn(),
            };

            vi.mocked(Venta.create).mockResolvedValue({
                id_venta: 52,
            } as never);
            vi.mocked(Articulo.findByPk).mockResolvedValue(
                articuloMock as never
            );

            // act y assert
            await expect(
                ventaFacade.registrarVenta(idCliente, items, montoTotal)
            ).rejects.toThrow('Stock insuficiente para el artículo 10');

            expect(articuloMock.stock).toBe(5);
            expect(articuloMock.save).not.toHaveBeenCalled();
            expect(DetalleVenta.create).not.toHaveBeenCalled();
            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(mockTransaction.commit).not.toHaveBeenCalled();
        });

        it('Caso de error: lanza error y hace rollback si el artículo no existe', async () => {
            // arrange
            const idCliente = 1;
            const montoTotal = 100;
            const items: ItemVenta[] = [
                { id_articulo: 999, cant_articulo: 1, precio_unidad: 100 },
            ];

            vi.mocked(Venta.create).mockResolvedValue({
                id_venta: 53,
            } as never);
            vi.mocked(Articulo.findByPk).mockResolvedValue(null);

            // act & assert
            await expect(
                ventaFacade.registrarVenta(idCliente, items, montoTotal)
            ).rejects.toThrow('Stock insuficiente para el artículo 999');

            expect(DetalleVenta.create).not.toHaveBeenCalled();
            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(mockTransaction.commit).not.toHaveBeenCalled();
        });
    });

    describe('cancelarVenta', () => {
        it('Caso normal: devuelve el stock a los artículos, elimina detalles y venta, y hace commit', async () => {
            // arrange
            const idVenta = 50;
            const ventaMock = {
                id_venta: idVenta,
                destroy: vi.fn().mockResolvedValue(true),
            };
            const detallesMock = [
                {
                    id_detalle: 1,
                    id_venta: idVenta,
                    id_articulo: 10,
                    cant_articulo: 3,
                },
            ];
            const articuloMock = {
                id_articulo: 10,
                stock: 7,
                save: vi.fn().mockResolvedValue(true),
            };

            vi.mocked(Venta.findByPk).mockResolvedValue(ventaMock as never);
            vi.mocked(DetalleVenta.findAll).mockResolvedValue(
                detallesMock as never
            );
            vi.mocked(Articulo.findByPk).mockResolvedValue(
                articuloMock as never
            );
            vi.mocked(DetalleVenta.destroy).mockResolvedValue(1);

            // act
            const resultado = await ventaFacade.cancelarVenta(idVenta);

            // assert
            expect(resultado).toBe(true);
            expect(articuloMock.stock).toBe(10); // 7 + 3 devueltos
            expect(articuloMock.save).toHaveBeenCalledWith({
                transaction: mockTransaction,
            });
            expect(DetalleVenta.destroy).toHaveBeenCalledWith({
                where: { id_venta: idVenta },
                transaction: mockTransaction,
            });
            expect(ventaMock.destroy).toHaveBeenCalledWith({
                transaction: mockTransaction,
            });
            expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
            expect(mockTransaction.rollback).not.toHaveBeenCalled();
        });

        it('Caso de error: lanza error y hace rollback si la venta no existe', async () => {
            // arrange
            const idVentaInexistente = 999;
            vi.mocked(Venta.findByPk).mockResolvedValue(null);

            // act y assert
            await expect(
                ventaFacade.cancelarVenta(idVentaInexistente)
            ).rejects.toThrow('Venta no encontrada');

            expect(DetalleVenta.findAll).not.toHaveBeenCalled();
            expect(DetalleVenta.destroy).not.toHaveBeenCalled();
            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(mockTransaction.commit).not.toHaveBeenCalled();
        });
    });
});
