import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import bannerJade from '../assets/image.png';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

const EMOCIONES = [
    { titulo: 'Buena Vibra', color: '#fdf0e1', textoColor: '#e68a1e', desc: 'Energía densa, mal ambiente, agotamiento energético', link: '/categoria/aromaterapia' },
    { titulo: 'Sueña', color: '#e6f5f3', textoColor: '#2a9d8f', desc: 'Insomnio, mente agitada, dificultad para dormir', link: '/categoria/aromaterapia' },
    { titulo: 'Respira', color: '#e8f3fa', textoColor: '#3498db', desc: 'Congestión nasal, resfríos, o pesadez física', link: '/categoria/aromaterapia' },
    { titulo: 'Medita', color: '#f3eef6', textoColor: '#9b72aa', desc: 'Falta de foco, desconexión interior, mente dispersa', link: '/categoria/aromaterapia' },
    { titulo: 'Fluye', color: '#fcebf1', textoColor: '#d81b60', desc: 'Trastornos o molestias menstruales u hormonales, labilidad emocional', link: '/categoria/aromaterapia' },
    { titulo: 'Camina', color: '#f2f7e9', textoColor: '#7cb342', desc: 'Inflamación, tensión corporal o articular', link: '/categoria/aromaterapia' },
    { titulo: 'Mueve', color: '#fbeee4', textoColor: '#d96b27', desc: 'Dolor físico o muscular, contracturas, sensación de rigidez', link: '/categoria/aromaterapia' },
    { titulo: 'Alquimia', color: '#f4eaf7', textoColor: '#6a1b9a', desc: 'Personalizado, ajustado a tu necesidad particular', link: '/alquimia' },
    { titulo: 'Gemoterapia', color: '#f5effb', textoColor: '#7b5ea7', desc: 'Cristales de Mineral Natural: Protección y limpieza energética', link: '/categoria/gemoterapia' },
];

const TESTIMONIOS = [
    {
        bandera: 'https://flagcdn.com/w40/co.png',
        pais: 'Colombia',
        autor: 'Melany T.',
        texto: 'Quería mejorar el ambiente en mi casa, compré un difusor y un aceite concentrado de "BUENA VIBRA", además del olor delicioso de la casa, ¡todos hemos estado más tranquilos!'
    },
    {
        bandera: 'https://flagcdn.com/w40/co.png',
        pais: 'Colombia',
        autor: 'Melany T.',
        texto: 'Compré un "Alquimia" para tratar una molestia que no se me quitaba con nada, ¡este aceite es milagroso! ¡Muchas gracias!'
    },
    {
        bandera: 'https://flagcdn.com/w40/cl.png',
        pais: 'Chile',
        autor: 'Carmen C.',
        texto: 'Hola mi doc, quería comentarle que mi sobrina utilizó la esencia "Sueña" ayer en la noche y mi hermana comenta que cayó profunda, durmió toda la noche sin problema. ¡Gracias ♡!'
    }
];

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [agregadoId, setAgregadoId] = useState(null);
    const [paginaCarrusel, setPaginaCarrusel] = useState(0);

    const { nombre } = useParams();
    const { agregar } = useCart();
    const { precioDe, formatear } = useCurrency();

    const ITEMS_POR_VISTA = 4;

    useEffect(() => {
        const controller = new AbortController();
        setCargando(true);
        setError(null);
        setPaginaCarrusel(0);

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

    const totalPaginas = Math.ceil(productos.length / ITEMS_POR_VISTA);
    const avanzarCarrusel = () => setPaginaCarrusel(prev => (prev + 1) % totalPaginas);
    const retrocederCarrusel = () => setPaginaCarrusel(prev => (prev - 1 + totalPaginas) % totalPaginas);

    const productosVisibles = nombre
        ? productos
        : productos.slice(
            paginaCarrusel * ITEMS_POR_VISTA,
            paginaCarrusel * ITEMS_POR_VISTA + ITEMS_POR_VISTA
        );

    const renderTarjetaProducto = (producto) => (
        <div className="col" key={producto.id}>
            <div className="card product-card p-3 h-100 d-flex flex-column">
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
                <div className="mt-auto">
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
        </div>
    );

    return (
        <>
            <div className="container mb-5 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="catalog-title text-capitalize mb-4">
                        {nombre ?? 'Mezclas y Cristales Destacados'}
                    </h2>

                    {/* Controles del carrusel solo en Inicio cuando hay más de 4 productos */}
                    {!nombre && productos.length > ITEMS_POR_VISTA && (
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="carousel-nav-btn"
                                onClick={retrocederCarrusel}
                                aria-label="Anterior"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <span className="small text-muted fw-bold px-2">
                                {paginaCarrusel + 1} / {totalPaginas}
                            </span>
                            <button
                                type="button"
                                className="carousel-nav-btn"
                                onClick={avanzarCarrusel}
                                aria-label="Siguiente"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>

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
                        {productosVisibles.map(renderTarjetaProducto)}
                    </div>
                )}
            </div>

            {/* Secciones exclusivas de la portada de Inicio */}
            {!nombre && (
                <>
                    {/* Banner inspiracional */}
                    <section
                        className="jade-hero-banner my-5 d-flex align-items-center justify-content-center"
                        style={{ backgroundImage: `url(${bannerJade})` }}
                    >
                        <div className="container text-center text-white py-5">
                        
                        </div>
                    </section>

                    {/* Sección: ¿Qué estás sintiendo hoy? */}
                    <section className="container my-5">
                        <h2 className="catalog-title mb-4">
                            <strong>¿Qué estás sintiendo hoy?</strong> Elige tu Mezcla y tu Gema según emoción o síntoma.
                        </h2>
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 justify-content-center">
                            {EMOCIONES.map((item, idx) => (
                                <div className="col text-center" key={idx}>
                                    <Link to={item.link} className="text-decoration-none">
                                        <div
                                            className="emotion-box p-4 rounded-3 mb-2 d-flex align-items-center justify-content-center"
                                            style={{ backgroundColor: item.color, minHeight: '140px' }}
                                        >
                                            <h4 className="m-0 fw-normal" style={{ color: item.textoColor }}>
                                                {item.titulo}
                                            </h4>
                                        </div>
                                        <p className="small text-decoration-underline" style={{ color: '#8e24aa' }}>
                                            {item.desc}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sección: Nuestros Productos (Categorías principales) */}
                    <section className="container my-5">
                        <h2 className="catalog-title mb-4">Nuestros Productos</h2>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <Link to="/categoria/aromaterapia" className="category-tile text-decoration-none">
                                    <div className="p-5 rounded-3 text-center" style={{ backgroundColor: '#ebe3e0' }}>
                                        <i className="bi bi-droplet-half display-3" style={{ color: '#5b2c82' }}></i>
                                        <h4 className="mt-3 fw-bold" style={{ color: '#5b2c82' }}>Mezclas de aceites esenciales</h4>
                                    </div>
                                    <p className="mt-2 mb-0" style={{ color: '#5b2c82' }}>Mezclas de aceites esenciales Jade →</p>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to="/categoria/gemoterapia" className="category-tile text-decoration-none">
                                    <div className="p-5 rounded-3 text-center" style={{ backgroundColor: '#ebe3e0' }}>
                                        <i className="bi bi-gem display-3" style={{ color: '#5b2c82' }}></i>
                                        <h4 className="mt-3 fw-bold" style={{ color: '#5b2c82' }}>Piedras Naturales Gemoterapia</h4>
                                    </div>
                                    <p className="mt-2 mb-0" style={{ color: '#5b2c82' }}>Piedras Naturales →</p>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to="/alquimia" className="category-tile text-decoration-none">
                                    <div className="p-5 rounded-3 text-center" style={{ backgroundColor: '#ebe3e0' }}>
                                        <i className="bi bi-stars display-3" style={{ color: '#5b2c82' }}></i>
                                        <h4 className="mt-3 fw-bold" style={{ color: '#5b2c82' }}>Alquimia & Asesoría</h4>
                                    </div>
                                    <p className="mt-2 mb-0" style={{ color: '#5b2c82' }}>Sesiones personalizadas →</p>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Sección: Nuestros usuarios (Testimonios) */}
                    <section className="jade-reviews-section py-5 mt-5">
                        <div className="container py-3">
                            <h2 className="text-white fw-light mb-4">Nuestros usuarios</h2>
                            <div className="row g-4">
                                {TESTIMONIOS.map((t, index) => (
                                    <div className="col-md-4" key={index}>
                                        <div className="review-card p-4 rounded-3 h-100 d-flex flex-column justify-content-between">
                                            <div className="position-relative d-flex justify-content-center align-items-center mb-3">
                                                <div style={{ color: '#9c4dcc', letterSpacing: '3px', fontSize: '1.1rem' }}>
                                                    ★★★★★
                                                </div>
                                                <img
                                                    src={t.bandera}
                                                    alt={t.pais}
                                                    className="review-flag position-absolute end-0"
                                                />
                                            </div>
                                            <p className="small text-center text-muted mb-4 px-2">{t.texto}</p>
                                            <div
                                                className="text-end fst-italic fw-semibold"
                                                style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '1.35rem', color: '#444' }}
                                            >
                                                {t.autor}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-5">
                                <Link to="/contacto" className="btn btn-mas-opiniones text-decoration-none">
                                    Más opiniones..
                                </Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default ProductoList;