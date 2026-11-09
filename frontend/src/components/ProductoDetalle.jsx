import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

const ProductoDetalle = () => {
    const { id } = useParams();
    const { agregar } = useCart();
    const { precioDe, formatear } = useCurrency();

    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setCargando(true);
        setError(null);
        setCantidad(1);

        axios.get(`${API_URL}/api/productos/${id}/`, { signal: controller.signal })
            .then(res => setProducto(res.data))
            .catch(err => {
                if (axios.isCancel(err)) return;
                setError(
                    err.response?.status === 404
                        ? 'Este producto no existe o ya no está disponible.'
                        : 'No pudimos cargar el producto. Intenta nuevamente en unos minutos.'
                );
            })
            .finally(() => setCargando(false));

        return () => controller.abort();
    }, [id]);

    const handleAgregar = () => {
        agregar(producto, cantidad);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1200);
    };

    if (cargando) {
        return (
            <div className="text-center my-5" role="status">
                <div className="spinner-border" style={{ color: '#5b2c82' }}></div>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="container my-5 text-center">
                <div className="alert alert-danger border-0">{error}</div>
                <Link to="/" className="btn btn-add" style={{ width: 'auto', padding: '8px 32px' }}>
                    Volver al catálogo
                </Link>
            </div>
        );
    }

    const agotado = producto.stock === 0;

    return (
        <div className="container mb-5 mt-4">
            <nav className="detalle-breadcrumb">
                <Link to="/">Inicio</Link>
                <span>/</span>
                <Link to={`/categoria/${producto.categoria_nombre.toLowerCase()}`}>
                    {producto.categoria_nombre}
                </Link>
                <span>/</span>
                <span>{producto.nombre}</span>
            </nav>

            <div className="row g-5">
                <div className="col-md-6">
                    <div className="detalle-img">
                        {producto.imagen
                            ? <img src={producto.imagen} alt={producto.nombre} />
                            : <span className="text-muted">Sin imagen</span>}
                    </div>
                </div>

                <div className="col-md-6">
                    <span className="badge-offer" style={{ position: 'static' }}>{producto.categoria_nombre}</span>
                    <h1 className="detalle-titulo">{producto.nombre}</h1>
                    <p className="detalle-precio">{formatear(precioDe(producto))}</p>

                    {!agotado && producto.stock <= 5 && (
                        <p className="text-danger small">Quedan solo {producto.stock} unidades</p>
                    )}

                    {!agotado && (
                        <div className="cart-qty mb-3">
                            <button
                                type="button"
                                aria-label="Disminuir cantidad"
                                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                                disabled={cantidad <= 1}
                            >
                                −
                            </button>
                            <span>{cantidad}</span>
                            <button
                                type="button"
                                aria-label="Aumentar cantidad"
                                onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}
                                disabled={cantidad >= producto.stock}
                            >
                                +
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn btn-add"
                        disabled={agotado}
                        onClick={handleAgregar}
                    >
                        {agotado ? 'Agotado' : agregado ? '¡Añadido!' : 'Añadir al carrito'}
                    </button>

                    <hr className="my-4" />

                    <div className="detalle-descripcion">{producto.descripcion}</div>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;