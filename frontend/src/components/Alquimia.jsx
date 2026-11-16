import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const SESIONES = [
    {
        id: 'alquimia-integral',
        nombre: 'Sesión de Alquimia & Aromaterapia',
        duracion: '60 minutos (Vía Meet)',
        descripcion: 'Diagnóstico energético y creación de una sinergia personalizada de aceites esenciales y gemas según tu propósito.',
        precio_clp: 25000,
        precio_cop: 110000,
    },
    {
        id: 'reiki-armonizacion',
        nombre: 'Armonización con Gemoterapia y Reiki',
        duracion: '45 minutos (Vía Meet)',
        descripcion: 'Alineación de chakras a distancia acompañada de una guía práctica de cristales para tu espacio diario.',
        precio_clp: 20000,
        precio_cop: 88000,
    }
];

const Alquimia = () => {
    const { precioDe, formatear } = useCurrency();
    const [sesionSeleccionada, setSesionSeleccionada] = useState(SESIONES[0].id);
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
        fecha: '',
        hora: '',
        intencion: ''
    });
    const [reservaConfirmada, setReservaConfirmada] = useState(null);

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sesion = SESIONES.find(s => s.id === sesionSeleccionada);
        const nuevaReserva = {
            id: `ALQ-${Date.now()}`,
            sesion: sesion.nombre,
            ...formulario,
            fechaCreacion: new Date().toISOString()
        };

        try {
            const guardadas = JSON.parse(localStorage.getItem('jade_reservas_alquimia') || '[]');
            localStorage.setItem('jade_reservas_alquimia', JSON.stringify([...guardadas, nuevaReserva]));
        } catch {
            // Continúa en memoria si localStorage no está disponible
        }

        setReservaConfirmada(nuevaReserva);
        setFormulario({ nombre: '', email: '', fecha: '', hora: '', intencion: '' });
    };

    return (
        <div className="container mb-5 mt-4">
            <h2 className="catalog-title">Servicio de Alquimia Personalizada</h2>
            <p className="text-muted mb-4">
                Conecta con nuestras especialistas a través de sesiones online por Zoom y co-crea fórmulas únicas para tu bienestar espiritual y emocional.
            </p>

            <div className="row g-4 mb-5">
                {SESIONES.map(sesion => (
                    <div className="col-md-6" key={sesion.id}>
                        <div 
                            className="card product-card p-4" 
                            style={{ 
                                border: sesionSeleccionada === sesion.id ? '2px solid #5b2c82' : '1px solid #eee',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSesionSeleccionada(sesion.id)}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="product-title mt-0">{sesion.nombre}</h5>
                                <span className="badge rounded-pill" style={{ backgroundColor: '#f3edf8', color: '#5b2c82' }}>
                                    {sesion.duracion}
                                </span>
                            </div>
                            <p className="text-muted small mb-3">{sesion.descripcion}</p>
                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                <span className="price-new">{formatear(precioDe(sesion))}</span>
                                <span className="small fw-bold" style={{ color: '#5b2c82' }}>
                                    {sesionSeleccionada === sesion.id ? '✓ Seleccionada' : 'Elegir modalidad'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="cart-summary" style={{ position: 'static' }}>
                        <h4 className="product-title mt-0 mb-3">Agendar mi sesión online</h4>

                        {reservaConfirmada ? (
                            <div className="alert border-0 p-4 text-center" style={{ backgroundColor: '#E3EBE6', color: '#2C3E50' }}>
                                <h5 className="fw-bold mb-2">¡Solicitud de reserva registrada!</h5>
                                <p className="mb-1">Código de reserva: <strong>{reservaConfirmada.id}</strong></p>
                                <p className="mb-3 small">
                                    Enviaremos el enlace de <strong>Zoom</strong> a <strong>{reservaConfirmada.email}</strong> para tu sesión del {reservaConfirmada.fecha} a las {reservaConfirmada.hora} hrs.
                                </p>
                                <button 
                                    type="button" 
                                    className="btn btn-add" 
                                    style={{ width: 'auto', padding: '8px 28px' }}
                                    onClick={() => setReservaConfirmada(null)}
                                >
                                    Agendar otra sesión
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Nombre completo</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            required
                                            value={formulario.nombre}
                                            onChange={handleChange}
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Correo electrónico (para link de Zoom)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            required
                                            value={formulario.email}
                                            onChange={handleChange}
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Fecha preferida</label>
                                        <input
                                            type="date"
                                            name="fecha"
                                            className="form-control"
                                            required
                                            value={formulario.fecha}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Horario preferido</label>
                                        <select
                                            name="hora"
                                            className="form-select"
                                            required
                                            value={formulario.hora}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona una hora...</option>
                                            <option value="10:00">10:00 hrs</option>
                                            <option value="12:00">12:00 hrs</option>
                                            <option value="16:00">16:00 hrs</option>
                                            <option value="18:30">18:30 hrs</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">¿Cuál es tu propósito o intención para la sesión?</label>
                                        <textarea
                                            name="intencion"
                                            className="form-control"
                                            rows="3"
                                            required
                                            value={formulario.intencion}
                                            onChange={handleChange}
                                            placeholder="Cuéntanos qué te gustaría trabajar (descanso, energía, calma emocional, etc.)"
                                        ></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-add mt-4">
                                    Confirmar reserva de Alquimia
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alquimia;