import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductoList = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/productos/')
            .then(response => setProductos(response.data))
            .catch(error => console.error("Error consultando la API:", error));
    }, []);

    return (
        <div className="row">
            {productos.map(producto => (
                <div className="col-md-3 mb-4" key={producto.id}>
                    <div className="card h-100 shadow-sm border-0 bg-light">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold">{producto.nombre}</h5>
                            <span className="badge bg-secondary w-50 mb-2">{producto.categoria_nombre}</span>
                            <p className="card-text text-muted small flex-grow-1">{producto.descripcion}</p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                <span className="fw-bold text-success fs-5">${producto.precio_clp} CLP</span>
                                <button className="btn btn-outline-dark btn-sm">Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductoList;