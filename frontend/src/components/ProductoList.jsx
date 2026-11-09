import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [agregadoId, setAgregadoId] = useState(null);
    const { nombre } = useParams();
    const { agregar } = useCart();
    const { precioDe, formatear } = useCurrency();

    useEffect(() => {
        const controller = new AbortController();
        setCargando(true);
        setError(null);

        axios.get(`${API_URL}/api/productos/`, {
            params: nombre ? { categoria: nombre } : {},
            signal: controller.signal,
        })
            .then(res => setProductos(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => {
                if (axios.isCancel(err)) return;
                console.error('Error consultando la API:', err);
                setError('No pudimos cargar los productos. Intenta nuevamente en unos minutos.');
            })
            .finally(() => setCargando(false));

        return () => controller.abort();
    }, [nombre]);

    const handleAgregar = (producto) => {
        agregar(producto);
        setAgregadoId(producto.id);
        setTimeout(() => setAgregadoId(null), 1200);
    };

    return (
        <div className="container mb-5 mt-4">
            <h2 className="catalog-title text-capitalize">
                {nombre ?? 'Catálogo Completo'}
            </h2>

            {cargando && (
                <div className="text-center my-5" role="status">
                    <div className="spinner-border" style={{ color: '#5b2c82' }}></div>
                    <p className="mt-3 text-muted">Cargando productos...</p>
                </div>
            )}

            {!cargando && error && (
                <div className="alert alert-danger text-center border-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {!cargando && !error && productos.length === 0 && (
                <div className="alert alert-info text-center mt-4 border-0" style={{ backgroundColor: '#E3EBE6', color: '#2C3E50' }}>
                    <i className="bi bi-info-circle me-2"></i>
                    Aún no tenemos productos en esta categoría, ¡vuelve pronto!
                </div>
            )}

            {!cargando && !error && productos.length > 0 && (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                    {productos.map(producto => (
                        <div className="col" key={producto.id}>
                            <div className="card product-card p-3">
                                <Link to={`/producto/${producto.id}`} className="product-link">
                                    <div className="product-img">
                                        <span className="badge-offer">{producto.categoria_nombre}</span>
                                        {producto.imagen ? (
                                            <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                                        ) : (
                                            <span className="text-muted">Sin imagen</span>
                                        )}
                                    </div>
                                    <h5 className="product-title" title={producto.nombre}>
                                        {producto.nombre}
                                    </h5>
                                </Link>
                                <p className="product-format text-truncate" title={producto.descripcion}>
                                    {producto.descripcion}
                                </p>
                                <div className="product-price-container">
                                    <span className="price-new">{formatear(precioDe(producto))}</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-add"
                                    disabled={producto.stock === 0}
                                    onClick={() => handleAgregar(producto)}
                                >
                                    {producto.stock === 0
                                        ? 'Agotado'
                                        : agregadoId === producto.id
                                            ? '¡Añadido!'
                                            : 'Añadir al carrito'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductoList;