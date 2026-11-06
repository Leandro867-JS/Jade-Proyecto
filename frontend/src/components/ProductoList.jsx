import { useState, useEffect } from 'react';
import axios from 'axios';
import logoJade from '../assets/logo.avif';

const ProductoList = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/productos/')
            .then(response => setProductos(response.data))
            .catch(error => console.error("Error consultando la API:", error));
    }, []);

    return (
        <>
            {/* Top bar */}
            <div className="top-bar">
                <i className="bi bi-chevron-left" style={{cursor:'pointer'}}></i>
                <span className="d-none d-sm-inline">Aceites esenciales piedras naturales, reiki, asesoría personalizada</span>
                <span className="d-inline d-sm-none">Aceites, piedras y reiki</span>
                <i className="bi bi-chevron-right" style={{cursor:'pointer'}}></i>
            </div>

            {/* Header Principal */}
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid align-items-center flex-wrap">
                    
                    <button className="navbar-toggler border-0 shadow-none d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuMovil">
                        <i className="bi bi-list text-white" style={{fontSize: '2rem'}}></i>
                    </button>
                    
                    <a className="navbar-brand mx-auto m-lg-0" href="#">
                        <div className="logo-placeholder">
                            <img src={logoJade} alt="Jade Aromas Logo" />
                        </div>
                    </a>
                    
                    <div className="collapse navbar-collapse justify-content-start d-none d-lg-flex">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item"><a className="nav-link active" href="#">Inicio</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Aromaterapia</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Gemoterapia</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Alquimia</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Contacto</a></li>
                        </ul>
                    </div>

                    <div className="header-icons mx-auto mx-lg-0 mt-3 mt-lg-0">
                        <i className="bi bi-search"></i>
                        <i className="bi bi-person"></i>
                        <div className="currency-selector ms-2 ms-sm-3">CLP <i className="bi bi-caret-down-fill" style={{fontSize: '0.7rem'}}></i></div>
                        <i className="bi bi-cart3"></i>
                    </div>
                </div>
            </nav>

            {/* Catálogo Dinámico */}
            <div className="container mb-5">
                <h2 className="catalog-title">Catálogo de Productos</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    
                    {productos.map(producto => (
                        <div className="col" key={producto.id}>
                            <div className="card product-card p-3">
                                <div className="product-img">
                                    <span className="badge-offer">{producto.categoria_nombre}</span>
                                    {producto.imagen ? (
                                        <img src={`http://127.0.0.1:8000${producto.imagen}`} alt={producto.nombre} />
                                    ) : (
                                        <span className="text-muted">Sin imagen</span>
                                    )}
                                </div>
                                <h5 className="product-title">{producto.nombre}</h5>
                                <p className="product-format text-truncate" title={producto.descripcion}>
                                    {producto.descripcion}
                                </p>
                                <div className="product-price-container">
                                    {/* Aquí simulamos el precio antiguo aumentándole un porcentaje o lo dejamos si no hay descuento */}
                                    <span className="price-new">${producto.precio_clp} CLP</span>
                                </div>
                                <button className="btn btn-add">Añadir al carrito</button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};

export default ProductoList;