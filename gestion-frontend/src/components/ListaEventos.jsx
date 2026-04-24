import { useEffect, useState } from 'react';
import axios from 'axios';

const ListaEventos = () => {
    const [eventos, setEventos] = useState([]);
    const [registro, setRegistro] = useState({ nombreAsistente: '', correo: '' });
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    const cargarEventos = () => {
        axios.get('http://localhost:8080/api/eventos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error al cargar eventos:", err));
    };

    useEffect(() => {
        cargarEventos();
    }, []);

    const manejarInscripcion = (e) => {
        e.preventDefault();
        
        // Verificamos que el ID exista antes de enviar
        if (!eventoSeleccionado) return;

        axios.post(`http://localhost:8080/api/registros/evento/${eventoSeleccionado}`, registro)
            .then(() => {
                alert("¡Registro exitoso!");
                setRegistro({ nombreAsistente: '', correo: '' });
                setEventoSeleccionado(null);
                cargarEventos(); // Recargamos para ver si el cupo se actualizó
            })
            .catch(err => {
                // Muestra el mensaje de error que viene desde Java (ej. Capacidad llena)
                alert(err.response?.data || "Error al registrarse");
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Eventos Disponibles</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
                {eventos.map((evento) => (
                    <div key={evento.id || indexedDB} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3>{evento.nombre}</h3>
                        <p>{evento.descripcion}</p>
                        <p><strong>📍 Lugar:</strong> {evento.lugar}</p>
                        <p><strong>👥 Capacidad:</strong> {evento.capacidadMaxima}</p>

                        <button onClick={() => setEventoSeleccionado(evento.id)}>
                            Inscribirme
                        </button>

                        {/* Formulario condicional que aparece al dar clic en Inscribirme */}
                        {eventoSeleccionado === evento.id && (
                            <form onSubmit={manejarInscripcion} style={{ marginTop: '15px', background: '#f0f0f0', padding: '15px', borderRadius: '5px' }}>
                                <h4>Inscripción a: {evento.nombre}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input 
                                        placeholder="Nombre del asistente" 
                                        value={registro.nombreAsistente}
                                        onChange={e => setRegistro({...registro, nombreAsistente: e.target.value})}
                                        required 
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Correo electrónico" 
                                        value={registro.correo}
                                        onChange={e => setRegistro({...registro, correo: e.target.value})}
                                        required 
                                    />
                                    <button type="submit" style={{ backgroundColor: '#28a745', color: 'white' }}>
                                        Confirmar Registro
                                    </button>
                                    <button type="button" onClick={() => setEventoSeleccionado(null)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaEventos;