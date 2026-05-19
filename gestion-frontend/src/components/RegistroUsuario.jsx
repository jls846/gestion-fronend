
import axios from 'axios';
import { useState } from 'react';

export const RegistroUsuario = () => {
    // Estado para capturar los datos del formulario
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Enviar los datos al backend de Spring Boot
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        // Validación 
        if (!formData.username || !formData.password) {
            setMensaje({ texto: 'Por favor, llena todos los campos obligatorios.', tipo: 'error' });
            return;
        }

        try {
            //URL  @PostMapping de UsuarioController
            const respuesta = await axios.post('http://localhost:8080/api/usuarios/registro', formData);
            
            setMensaje({ texto: `¡Usuario "${respuesta.data.username}" registrado con éxito!`, tipo: 'exito' });
            
            // Limpiar el formulario
            setFormData({ username: '', password: '', email: '' });
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            const errorMsg = error.response?.data || 'No se pudo conectar con el servidor.';
            setMensaje({ texto: `Error: ${errorMsg}`, tipo: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Registro de Usuario</h2>
            
            {mensaje.texto && (
                <div style={{ 
                    padding: '10px', 
                    marginBottom: '15px', 
                    borderRadius: '4px',
                    backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
                    color: mensaje.tipo === 'exito' ? '#155724' : '#721c24'
                }}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        placeholder="Ej. juanito123"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email (Opcional):</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        placeholder="********"
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Registrar Usuario
                </button>
            </form>
        </div>
    );
};