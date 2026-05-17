import axios from 'axios';

const ListaEventos = ({ eventos, onCambio }) => {
    const manejarInscripcion = async (eventoId) => {
        const usuarioStored = localStorage.getItem("usuario");
        if (!usuarioStored) {
            alert("Debes iniciar sesión para inscribirte.");
            return;
        }

        const usuarioLogueado = JSON.parse(usuarioStored);

        try {
            await axios.post(`http://localhost:8080/api/inscripciones/evento/${eventoId}/usuario/${usuarioLogueado.id}`);
            alert("¡Inscripción exitosa!");
            if (onCambio) onCambio(); 
        } catch (err) {
            alert(err.response?.data || "Error al registrarse");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Eventos Disponibles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {eventos.map((evento) => {
                    const miNombreUsuario = localStorage.getItem('usuarioLogueado');
                    
                    console.log("Comparando:", evento.creador?.username, "con", miNombreUsuario);

                    const esMiEvento = evento.creador && 
                                     miNombreUsuario && 
                                     evento.creador.username.toLowerCase() === miNombreUsuario.toLowerCase();

                    const estaLleno = evento.inscripciones?.length >= evento.capacidadMaxima;

                    return (
                        <div key={evento.id} style={{ 
                            border: esMiEvento ? '2px solid #007bff' : '1px solid #ddd', 
                            padding: '20px', 
                            borderRadius: '12px', 
                            backgroundColor: '#fff', 
                            boxShadow: esMiEvento ? '0 6px 12px rgba(0,123,255,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                        
                            {esMiEvento && (
                                <div style={{ 
                                    position: 'absolute', top: '-10px', right: '10px', 
                                    backgroundColor: '#007bff', color: 'white', 
                                    padding: '4px 12px', borderRadius: '50px', 
                                    fontSize: '0.7rem', fontWeight: 'bold', zIndex: 1
                                }}>
                                    ORGANIZADOR
                                </div>
                            )}

                            <div>
                                <h3 style={{ marginTop: '5px', color: esMiEvento ? '#007bff' : '#333' }}>
                                    {evento.nombre}
                                </h3>
                                
                                <p style={{ color: '#666', fontSize: '0.9rem', minHeight: '40px' }}>
                                    {evento.descripcion}
                                </p>
                                
                                {/* SECCIÓN CORREGIDA: Renderizar TODAS las Categorías */}
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
    {evento.categorias && evento.categorias.length > 0 ? (
        evento.categorias.map((cat, index) => {
            // Extraemos el nombre sin importar cómo venga del backend
            const nombreMostrar = cat.categoria || cat.nombreCategoria || `Categoría ${cat.id}`;
            
            return (
                <span 
                    key={`evento-${evento.id}-cat-${cat.id}-${index}`} // Key única combinada para React
                    style={{
                        backgroundColor: '#e7f3ff',
                        color: '#007bff',
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        border: '1px solid #b8daff'
                    }}
                >
                    {nombreMostrar}
                </span>
            );
        })
    ) : (
        <span style={{ color: '#aaa', fontSize: '0.75rem', fontStyle: 'italic' }}>
            Sin categorías
        </span>
    )}
</div>
                                <div style={{ fontSize: '0.85rem', margin: '10px 0', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    <p style={{ margin: '5px 0' }}><strong>Lugar:</strong> {evento.lugar}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleString()}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Organiza:</strong> {evento.creador?.username || 'Sistema'}</p>
                                </div>
                            </div>

                            <div>
                                <div style={{ 
                                    margin: '15px 0', padding: '8px', 
                                    backgroundColor: estaLleno ? '#fff3f3' : '#f0f7ff', 
                                    borderRadius: '5px', textAlign: 'center',
                                    border: estaLleno ? '1px solid #ffcccc' : '1px solid #d0e7ff'
                                }}>
                                    <strong>Cupo:</strong> {evento.inscripciones?.length || 0} / {evento.capacidadMaxima}
                                </div>

                                <button 
                                    disabled={esMiEvento || estaLleno}
                                    onClick={() => manejarInscripcion(evento.id)}
                                    style={{ 
                                        width: '100%',
                                        backgroundColor: esMiEvento ? '#6c757d' : (estaLleno ? '#dc3545' : '#28a745'), 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '12px', 
                                        borderRadius: '6px', 
                                        cursor: (esMiEvento || estaLleno) ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        transition: '0.3s'
                                    }}
                                >
                                    {esMiEvento ? 'Eres el organizador' : (estaLleno ? 'Cupo Lleno' : 'Confirmar Inscripción')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListaEventos;