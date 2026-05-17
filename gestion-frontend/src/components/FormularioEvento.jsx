import { useState } from 'react';

const FormularioEvento = ({ onEventoCreado }) => {
    const [evento, setEvento] = useState({
        nombre: '',
        descripcion: '',
        lugar: '',
        capacidadMaxima: 1,
        organizador: '',
        fecha: ''
    });

    // Estado para controlar qué IDs de categorías han sido seleccionados
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setEvento({ ...evento, [name]: value });
    };

    // Agrega o remueve el ID del array dependiendo de si se marca o desmarca el checkbox
   // Reemplaza esta función exacta en tu FormularioEvento.jsx
const manejarCheckbox = (id) => {
    setCategoriasSeleccionadas((prevSeleccionadas) => {
        if (prevSeleccionadas.includes(id)) {
            // Si ya estaba seleccionado, lo quitamos
            return prevSeleccionadas.filter(cId => cId !== id);
        } else {
            // Si no estaba, lo agregamos al array anterior usando el operador spread (...)
            return [...prevSeleccionadas, id];
        }
    });
};
    const enviarFormulario = async (e) => {
        e.preventDefault();
        
        try {
            // CONVERSIÓN CLAVE: Transformamos [1, 2] en [ {id: 1}, {id: 2} ] para JPA
            const eventoConCategorias = {
                ...evento,
                categorias: categoriasSeleccionadas.map(id => ({ id: id }))
            };

            // Ejecuta la función que viene desde App.jsx para hacer el POST al backend
            await onEventoCreado(eventoConCategorias); 
            
            // Limpiamos los campos del formulario tras el éxito
            setEvento({ 
                nombre: '', 
                descripcion: '', 
                lugar: '', 
                capacidadMaxima: 1, 
                organizador: '', 
                fecha: '' 
            });
            setCategoriasSeleccionadas([]); // Vaciamos los checkboxes
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    };

    return (
        <form onSubmit={enviarFormulario} style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#fff'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Crear Nuevo Evento</h3>
            
            <input 
                name="nombre" 
                placeholder="Nombre del evento" 
                value={evento.nombre} 
                onChange={manejarCambio} 
                required 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <input 
                name="descripcion" 
                placeholder="Descripción" 
                value={evento.descripcion} 
                onChange={manejarCambio} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <input 
                name="lugar" 
                placeholder="Lugar" 
                value={evento.lugar} 
                onChange={manejarCambio} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '-5px' }}>Capacidad Máxima:</label>
            <input 
                name="capacidadMaxima" 
                type="number" 
                value={evento.capacidadMaxima} 
                onChange={manejarCambio} 
                min="1" 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <input 
                name="organizador" 
                placeholder="Organizador (opcional)" 
                value={evento.organizador} 
                onChange={manejarCambio} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <input 
                name="fecha" 
                type="datetime-local" 
                value={evento.fecha} 
                onChange={manejarCambio} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            {/* SECCIÓN DE CHECKBOXES PARA RELACIÓN MUCHOS A MUCHOS */}
            <div style={{ margin: '10px 0', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
                    Selecciona las Categorías del Evento:
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input 
                            type="checkbox" 
                            checked={categoriasSeleccionadas.includes(1)} 
                            onChange={() => manejarCheckbox(1)} 
                        />
                        Tecnología (ID: 1)
                    </label>
                    <label style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input 
                            type="checkbox" 
                            checked={categoriasSeleccionadas.includes(2)} 
                            onChange={() => manejarCheckbox(2)} 
                        />
                        Educación (ID: 2)
                    </label>
                </div>
            </div>
            
            <button type="submit" style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '12px', 
                cursor: 'pointer', 
                border: 'none', 
                borderRadius: '5px',
                fontWeight: 'bold',
                marginTop: '10px',
                transition: '0.2s'
            }}>
                Guardar Evento
            </button>
        </form>
    );
};

export default FormularioEvento;