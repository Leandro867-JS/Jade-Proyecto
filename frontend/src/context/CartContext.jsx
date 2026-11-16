import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useCurrency } from './CurrencyContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'jade_carrito';

const leerCarrito = () => {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        const items = guardado ? JSON.parse(guardado) : [];
        return items.filter(i => i.precio_clp != null);
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(leerCarrito);
    const { precioDe } = useCurrency();

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // sin almacenamiento disponible: el carrito sigue funcionando en memoria
        }
    }, [items]);

    const agregar = (producto, cantidad = 1) => {
        setItems(prev => {
            const existente = prev.find(i => i.id === producto.id);
            if (existente) {
                return prev.map(i =>
                    i.id === producto.id
                        ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
                        : i
                );
            }
            return [
                ...prev,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio_clp: producto.precio_clp,
                    imagen: producto.imagen,
                    stock: producto.stock,
                    cantidad: Math.min(cantidad, producto.stock),
                },
            ];
        });
    };

    const cambiarCantidad = (id, cantidad) => {
        setItems(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
                    : i
            )
        );
    };

    const quitar = (id) => setItems(prev => prev.filter(i => i.id !== id));
    const vaciar = () => setItems([]);

    const totalItems = useMemo(
        () => items.reduce((suma, i) => suma + i.cantidad, 0),
        [items]
    );

    // Calcula el total convirtiendo cada ítem con la tasa en vivo de la API
    const totalPrecio = useMemo(
        () => items.reduce((suma, i) => suma + i.cantidad * precioDe(i), 0),
        [items, precioDe]
    );

    return (
        <CartContext.Provider
            value={{ items, agregar, cambiarCantidad, quitar, vaciar, totalItems, totalPrecio }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
    return ctx;
};