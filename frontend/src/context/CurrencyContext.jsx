import { createContext, useContext, useEffect, useState } from 'react';

export const MONEDAS = {
    CLP: { locale: 'es-CL', nombre: 'Peso chileno', decimales: 0 },
    USD: { locale: 'en-US', nombre: 'Dólar estadounidense', decimales: 2 },
    COP: { locale: 'es-CO', nombre: 'Peso colombiano', decimales: 0 },
};

const CurrencyContext = createContext(null);
const STORAGE_KEY = 'jade_moneda';
const RATES_STORAGE_KEY = 'jade_tasas_cambio';

// Tasas de respaldo por si falla la conexión a internet
const TASAS_RESPALDO = {
    CLP: 1,
    USD: 0.00103, // ~970 CLP por 1 USD
    COP: 4.35,    // ~1 CLP = 4.35 COP
};

const leerMoneda = () => {
    try {
        const guardada = localStorage.getItem(STORAGE_KEY);
        return MONEDAS[guardada] ? guardada : 'CLP';
    } catch {
        return 'CLP';
    }
};

const leerTasasGuardadas = () => {
    try {
        const guardadas = localStorage.getItem(RATES_STORAGE_KEY);
        return guardadas ? JSON.parse(guardadas) : TASAS_RESPALDO;
    } catch {
        return TASAS_RESPALDO;
    }
};

export const CurrencyProvider = ({ children }) => {
    const [moneda, setMoneda] = useState(leerMoneda);
    const [tasas, setTasas] = useState(leerTasasGuardadas);

    // Guarda la moneda seleccionada por el usuario
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, moneda);
        } catch {
            // Continúa en memoria
        }
    }, [moneda]);

    // Consulta la API gratuita de tipo de cambio al iniciar la aplicación
    useEffect(() => {
        fetch('https://open.er-api.com/v6/latest/CLP')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates) {
                    const nuevasTasas = {
                        CLP: 1,
                        USD: data.rates.USD ?? TASAS_RESPALDO.USD,
                        COP: data.rates.COP ?? TASAS_RESPALDO.COP,
                    };
                    setTasas(nuevasTasas);
                    try {
                        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(nuevasTasas));
                    } catch {
                        // Continúa en memoria
                    }
                }
            })
            .catch(err => {
                console.warn('Usando tasas de cambio de respaldo:', err);
            });
    }, []);

    // Calcula el precio dinámicamente a partir del precio base en CLP
    const precioDe = (obj) => {
        const baseClp = Number(obj?.precio_clp ?? 0);
        if (moneda === 'CLP') return baseClp;

        const tasa = tasas[moneda] ?? 1;
        const convertido = baseClp * tasa;

        return MONEDAS[moneda].decimales === 0 
            ? Math.round(convertido) 
            : Number(convertido.toFixed(2));
    };

    // Formatea el valor según la moneda activa (CLP, USD o COP)
    const formatear = (valor) => {
        const config = MONEDAS[moneda] || MONEDAS.CLP;
        const numero = new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: moneda,
            minimumFractionDigits: config.decimales,
            maximumFractionDigits: config.decimales,
        }).format(valor);
        return `${numero} ${moneda}`;
    };

    return (
        <CurrencyContext.Provider value={{ moneda, setMoneda, precioDe, formatear, tasas }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency debe usarse dentro de <CurrencyProvider>');
    return ctx;
};