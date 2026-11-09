import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logoJade from '../assets/logo.avif';
import { useCart } from '../context/CartContext';
import { useCurrency, MONEDAS } from '../context/CurrencyContext';

const Navbar = () => {
    const { totalItems } = useCart();
    const { moneda, setMoneda } = useCurrency();
    const [menuMoneda, setMenuMoneda] = useState(false);
    const monedaRef = useRef(null);

    useEffect(() => {
        const cerrarFuera = (e) => {
            if (monedaRef.current && !monedaRef.current.contains(e.target)) {
                setMenuMoneda(false);
            }
        };
        document.addEventListener('mousedown', cerrarFuera);
        return () => document.removeEventListener('mousedown', cerrarFuera);
    }, []);

    return (
        <>
            <div className="top-bar">
                <i className="bi bi-chevron-left" style={{ cursor: 'pointer' }}></i>
                <span className="d-none d-sm-inline">Aceites esenciales, piedras naturales, reiki, asesoría personalizada</span>
                <span className="d-inline d-sm-none">Aceites, piedras y reiki</span>
                <i className="bi bi-chevron-right" style={{ cursor: 'pointer' }}></i>
            </div>

            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid align-items-center flex-wrap flex-lg-nowrap">
                    <button
                        className="navbar-toggler border-0 shadow-none d-lg-none"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#menuMovil"
                        aria-label="Abrir menú"
                    >
                        <i className="bi bi-list text-white" style={{ fontSize: '2rem' }}></i>
                    </button>

                    <Link className="navbar-brand mx-auto mx-lg-0 me-lg-4" to="/">
                        <div className="logo-placeholder">
                            <img src={logoJade} alt="Jade Aromas Logo" />
                        </div>
                    </Link>

                    <div className="collapse navbar-collapse justify-content-start d-none d-lg-flex">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/categoria/aromaterapia">Aromaterapia</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/categoria/gemoterapia">Gemoterapia</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/alquimia">Alquimia</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="header-icons mx-auto ms-lg-auto me-lg-0 mt-3 mt-lg-0">
                        <button type="button" className="icon-btn" aria-label="Buscar">
                            <i className="bi bi-search"></i>
                        </button>
                        <button type="button" className="icon-btn" aria-label="Mi cuenta">
                            <i className="bi bi-person"></i>
                        </button>

                        <div className="currency-wrapper" ref={monedaRef}>
                            <button
                                type="button"
                                className="icon-btn currency-selector"
                                aria-haspopup="listbox"
                                aria-expanded={menuMoneda}
                                onClick={() => setMenuMoneda(abierto => !abierto)}
                            >
                                {moneda} <i className="bi bi-caret-down-fill" style={{ fontSize: '0.7rem' }}></i>
                            </button>

                            {menuMoneda && (
                                <ul className="currency-menu" role="listbox">
                                    {Object.entries(MONEDAS).map(([codigo, { nombre }]) => (
                                        <li key={codigo}>
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={codigo === moneda}
                                                className={codigo === moneda ? 'activa' : ''}
                                                onClick={() => {
                                                    setMoneda(codigo);
                                                    setMenuMoneda(false);
                                                }}
                                            >
                                                <strong>{codigo}</strong>
                                                <span>{nombre}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <Link to="/carrito" className="icon-btn cart-link" aria-label={`Carrito: ${totalItems} productos`}>
                            <i className="bi bi-cart3"></i>
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="offcanvas offcanvas-start offcanvas-custom" tabIndex="-1" id="menuMovil">
                <div className="offcanvas-header border-bottom border-secondary-subtle">
                    <h5 className="offcanvas-title" style={{ color: '#5b2c82', fontWeight: 'bold' }}>Categorías</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-unstyled">
                        <li><Link className="nav-mobile-link" to="/">Inicio</Link></li>
                        <li><Link className="nav-mobile-link" to="/categoria/aromaterapia">Aromaterapia</Link></li>
                        <li><Link className="nav-mobile-link" to="/categoria/gemoterapia">Gemoterapia</Link></li>
                        <li><Link className="nav-mobile-link" to="/alquimia">Servicio de Alquimia</Link></li>
                        <li><Link className="nav-mobile-link" to="/contacto">Contacto</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;