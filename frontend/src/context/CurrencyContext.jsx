import { createContext, useContext, useEffect, useState } from 'react';

export const MONEDAS = {
    CLP: { campo: 'precio_clp', locale: 'es-CL', nombre: 'Peso chileno' },
    COP: { campo: 'precio_cop', locale: 'es-CO', nombre: 'Peso colombiano' },
};

const CurrencyContext = createContext(null);
const STORAGE_KEY = 'jade_moneda';

const leerMoneda = () => {
    try {
        const guardada = localStorage.getItem(STORAGE_KEY);
        return MONEDAS[guardada] ? guardada : 'CLP';
    } catch {
        return 'CLP';
    }
};

export const CurrencyProvider = ({ children }) => {
    const [moneda, setMoneda] = useState(leerMoneda);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, moneda);
        } catch {
            // sin almacenamiento: la moneda sigue funcionando en memoria
        }
    }, [moneda]);

    // Devuelve el precio del producto (o ítem del carrito) en la moneda activa
    const precioDe = (obj) => Number(obj?.[MONEDAS[moneda].campo] ?? 0);

    // Formatea un número en la moneda activa, ej: "$9.500 CLP"
    const formatear = (valor) => {
        const numero = new Intl.NumberFormat(MONEDAS[moneda].locale, {
            style: 'currency',
            currency: moneda,
            maximumFractionDigits: 0,
        }).format(valor);
        return `${numero} ${moneda}`;
    };

    return (
        <CurrencyContext.Provider value={{ moneda, setMoneda, precioDe, formatear }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency debe usarse dentro de <CurrencyProvider>');
    return ctx;
};