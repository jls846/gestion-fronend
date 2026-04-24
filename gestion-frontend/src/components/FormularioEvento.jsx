import { useState } from 'react';
import axios from 'axios';

const FormularioEvento = ({ onEventoCreado }) => {
    const [evento, setEvento] = useState({
        nombre: '',
        descripcion: '',
        lugar: '',
        capacidadMaxima: 1,
        organizador: '',
        fecha: ''
    });

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setEvento({ ...evento, [name]: value });
    };

    const enviarFormulario = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/eventos', evento)
            .then(() => {
                alert("¡Evento creado con éxito!");
                onEventoCreado(); // Refresca la lista automáticamente
                setEvento({ nombre: '', descripcion: '', lugar: '', capacidadMaxima: 1, organizador: '', fecha: '' });
            })
            .catch(error => console.error("Error al crear evento", error));
    };

    return (
        <form onSubmit={enviarFormulario} style={{ 
            padding: '20px', 
            border: '1px solid #444', 
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            <h3>Crear Nuevo Evento</h3>
            <input name="nombre" placeholder="Nombre del evento" value={evento.nombre} onChange={manejarCambio} required />
            <input name="descripcion" placeholder="Descripción" value={evento.descripcion} onChange={manejarCambio} />
            <input name="lugar" placeholder="Lugar" value={evento.lugar} onChange={manejarCambio} />
            <input name="capacidadMaxima" type="number" value={evento.capacidadMaxima} onChange={manejarCambio} min="1" />
            <input name="organizador" placeholder="Organizador" value={evento.organizador} onChange={manejarCambio} />
            <input name="fecha" type="datetime-local" value={evento.fecha} onChange={manejarCambio} />
            <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', cursor: 'pointer' }}>
                Guardar Evento
            </button>
        </form>
    );
};

export default FormularioEvento;