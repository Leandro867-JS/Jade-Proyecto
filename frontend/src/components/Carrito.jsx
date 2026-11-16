import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const Carrito = () => {
    const { items, cambiarCantidad, quitar, vaciar, totalItems, totalPrecio } = useCart();
    const { moneda, precioDe, formatear } = useCurrency();
    const [ordenConfirmada, setOrdenConfirmada] = useState(null);

    const handleFinalizarCompra = () => {
        const nuevaOrden = {
            folio: `JADE-${Math.floor(100000 + Math.random() * 900000)}`,
            fecha: new Date().toISOString(),
            moneda,
            total: formatear(totalPrecio),
            items: items.map(i => ({
                id: i.id,
                nombre: i.nombre,
                cantidad: i.cantidad,
                subtotal: formatear(precioDe(i) * i.cantidad)
            }))
        };

        try {
            const historial = JSON.parse(localStorage.getItem('jade_ordenes') || '[]');
            localStorage.setItem('jade_ordenes', JSON.stringify([...historial, nuevaOrden]));
        } catch {
            // Continúa en memoria
        }

        setOrdenConfirmada(nuevaOrden);
        vaciar();
    };

    if (ordenConfirmada) {
        return (
            <div className="container my-5 text-center">
                <div className="cart-summary mx-auto" style={{ maxWidth: '540px', position: 'static' }}>
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#5b2c82' }}></i>
                    <h2 className="catalog-title text-center my-3">¡Gracias por tu compra!</h2>
                    <p className="text-muted mb-2">
                        Tu pedido ha sido registrado con el folio <strong>{ordenConfirmada.folio}</strong>.
                    </p>
                    <p className="fw-bold fs-5 mb-4">Total pagado: {ordenConfirmada.total}</p>
                    <Link to="/" className="btn btn-add" style={{ width: 'auto', padding: '10px 32px' }}>
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container my-5 text-center">
                <h2 className="catalog-title text-center">Tu carrito está vacío</h2>
                <p className="text-muted mb-4">Explora el catálogo y añade tus productos favoritos.</p>
                <Link to="/" className="btn btn-add" style={{ width: 'auto', padding: '8px 32px' }}>
                    Ir al catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mb-5 mt-4">
            <h2 className="catalog-title">Mi carrito</h2>

            <div className="row g-4">
                <div className="col-lg-8">
                    {items.map(item => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-img">
                                {item.imagen
                                    ? <img src={item.imagen} alt={item.nombre} />
                                    : <span className="text-muted small">Sin imagen</span>}
                            </div>

                            <div className="cart-item-info">
                                <Link to={`/producto/${item.id}`} className="product-link">
                                    <h5 className="product-title mt-0">{item.nombre}</h5>
                                </Link>
                                <span className="text-muted small">{formatear(precioDe(item))} c/u</span>

                                <div className="cart-qty mt-2">
                                    <button
                                        type="button"
                                        aria-label="Disminuir cantidad"
                                        onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{item.cantidad}</span>
                                    <button
                                        type="button"
                                        aria-label="Aumentar cantidad"
                                        onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                                        disabled={item.cantidad >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-side">
                                <strong>{formatear(precioDe(item) * item.cantidad)}</strong>
                                <button
                                    type="button"
                                    className="cart-remove"
                                    aria-label={`Quitar ${item.nombre}`}
                                    onClick={() => quitar(item.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn btn-link text-muted p-0 mt-2" onClick={vaciar}>
                        Vaciar carrito
                    </button>
                </div>

                <div className="col-lg-4">
                    <div className="cart-summary">
                        <h5 className="product-title mt-0 mb-3">Resumen</h5>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Productos ({totalItems})</span>
                            <span>{formatear(totalPrecio)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fs-5 fw-bold">
                            <span>Total</span>
                            <span>{formatear(totalPrecio)}</span>
                        </div>
                        <button type="button" className="btn btn-add" onClick={handleFinalizarCompra}>
                            Finalizar compra
                        </button>
                        <Link to="/" className="d-block text-center mt-3 small" style={{ color: '#5b2c82' }}>
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrito;