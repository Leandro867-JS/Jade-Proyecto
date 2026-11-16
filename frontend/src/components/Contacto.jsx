import { useState } from 'react';

const Contacto = () => {
    const [datos, setDatos] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoMensaje = {
            id: `MSG-${Date.now()}`,
            ...datos,
            fecha: new Date().toISOString()
        };

        try {
            const guardados = JSON.parse(localStorage.getItem('jade_mensajes_contacto') || '[]');
            localStorage.setItem('jade_mensajes_contacto', JSON.stringify([...guardados, nuevoMensaje]));
        } catch {
            // Continúa en memoria
        }

        setEnviado(true);
        setDatos({ nombre: '', email: '', asunto: '', mensaje: '' });
    };

    return (
        <div className="container mb-5 mt-4">
            <h2 className="catalog-title">Contacto</h2>

            <div className="row g-5">
                <div className="col-lg-5">
                    <h5 className="product-title mt-0 mb-3">Jade Aromas Que Sanan</h5>
                    <p className="text-muted">
                        ¿Tienes dudas sobre qué aceite esencial o cristal es ideal para ti? Escríbenos y te responderemos a la brevedad.
                    </p>

                    <div className="mt-4">
                        <p className="mb-2">
                            <i className="bi bi-envelope me-2" style={{ color: '#5b2c82' }}></i>
                            contacto@jadearomas.com
                        </p>
                        <p className="mb-2">
                            <i className="bi bi-whatsapp me-2" style={{ color: '#5b2c82' }}></i>
                            Atención personalizada Chile & Colombia
                        </p>
                        <p className="mb-2">
                            <i className="bi bi-clock me-2" style={{ color: '#5b2c82' }}></i>
                            Lunes a Viernes: 09:00 a 19:00 hrs
                        </p>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="cart-summary" style={{ position: 'static' }}>
                        {enviado ? (
                            <div className="alert border-0 p-4 text-center" style={{ backgroundColor: '#E3EBE6', color: '#2C3E50' }}>
                                <h5 className="fw-bold mb-2">¡Gracias por escribirnos!</h5>
                                <p className="mb-3 small">Hemos recibido tu mensaje correctamente. Nuestro equipo te contactará pronto.</p>
                                <button
                                    type="button"
                                    className="btn btn-add"
                                    style={{ width: 'auto', padding: '8px 28px' }}
                                    onClick={() => setEnviado(false)}
                                >
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            required
                                            value={datos.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            required
                                            value={datos.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Asunto</label>
                                        <input
                                            type="text"
                                            name="asunto"
                                            className="form-control"
                                            required
                                            value={datos.asunto}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Mensaje</label>
                                        <textarea
                                            name="mensaje"
                                            className="form-control"
                                            rows="4"
                                            required
                                            value={datos.mensaje}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-add mt-4">
                                    Enviar mensaje
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;