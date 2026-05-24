import { useState, useEffect } from 'react';
import './FormularioEvento.css';

const FormularioEvento = ({ onEventoCreado }) => {

    const [evento, setEvento] = useState({
        nombre: '',
        descripcion: '',
        lugar: '',
        capacidadMaxima: 1,
        organizador: '',
        fecha: ''
    });

    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

    const [categorias, setCategorias] = useState([]);
//MODIFIQUE PARA CARGAR LAS CATEGORIAS DESDE LA API
useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(err => console.error(err));
}, []);

    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setEvento({
            ...evento,
            [name]: value
        });
    };

    const manejarCheckbox = (id) => {

        setCategoriasSeleccionadas((prev) => {

            if (prev.includes(id)) {
                return prev.filter(cId => cId !== id);
            }

            return [...prev, id];
        });
    };

    const enviarFormulario = async (e) => {

        e.preventDefault();

        try {

            const fechaFormateada =
                evento.fecha && evento.fecha.length === 16
                    ? `${evento.fecha}:00`
                    : evento.fecha;

            const eventoConCategorias = {

                ...evento,

                fecha: fechaFormateada,

                capacidadMaxima: parseInt(
                    evento.capacidadMaxima,
                    10
                ),

                categorias: categoriasSeleccionadas.map(id => ({
                    id: id
                }))
            };

            await onEventoCreado(eventoConCategorias);

            setEvento({
                nombre: '',
                descripcion: '',
                lugar: '',
                capacidadMaxima: 1,
                organizador: '',
                fecha: ''
            });

            setCategoriasSeleccionadas([]);

        } catch (error) {

            console.error(
                "Error al enviar el formulario:",
                error
            );
        }
    };

    return (

        <form
            className="event-form"
            onSubmit={enviarFormulario}
        >

            <h2 className="event-title">
                Crear Nuevo Evento
            </h2>

            <div className="form-group">
                <label>Nombre del Evento</label>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Ej. Conferencia React"
                    value={evento.nombre}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="form-group">
                <label>Descripción</label>

                <input
                    type="text"
                    name="descripcion"
                    placeholder="Describe el evento"
                    value={evento.descripcion}
                    onChange={manejarCambio}
                />
            </div>

            <div className="form-group">
                <label>Lugar</label>

                <input
                    type="text"
                    name="lugar"
                    placeholder="Ej. Auditorio Principal"
                    value={evento.lugar}
                    onChange={manejarCambio}
                />
            </div>

            <div className="form-group">
                <label>Capacidad Máxima</label>

                <input
                    type="number"
                    name="capacidadMaxima"
                    min="1"
                    value={evento.capacidadMaxima}
                    onChange={manejarCambio}
                />
            </div>

            <div className="form-group">
                <label>Organizador</label>

                <input
                    type="text"
                    name="organizador"
                    placeholder="Nombre del organizador"
                    value={evento.organizador}
                    onChange={manejarCambio}
                />
            </div>

            <div className="form-group">
                <label>Fecha y Hora</label>

                <input
                    type="datetime-local"
                    name="fecha"
                    value={evento.fecha}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="categorias-box">

                <div className="categorias-title">
                    Categorías del Evento
                </div>
{/* SE REEMPLAZO LAS CATEGORIAS HARDCODEADAS*/}
            <div className="checkbox-group">
                {categorias.map((cat) => (
                    <label className="checkbox-item" key={cat.id}>
                        <input
                        type="checkbox"
                        checked={categoriasSeleccionadas.includes(cat.id)}
                        onChange={() => manejarCheckbox(cat.id)}
                        />
                        {cat.categoria}
                    </label>
                ))}
            </div>

            </div>

            <button
                type="submit"
                className="submit-btn"
            >
                Guardar Evento
            </button>

        </form>
    );
};

export default FormularioEvento;