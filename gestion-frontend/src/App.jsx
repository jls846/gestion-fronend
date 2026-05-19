import { useState, useEffect } from 'react';
import axios from 'axios';
import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';
import { RegistroUsuario } from './components/RegistroUsuario';

const StatCard = ({ title, value, icon }) => (
  <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', flex: 1 }}>
    <div style={{ fontSize: '1.2rem', color: '#666' }}>{icon} {title}</div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{value}</div>
  </div>
);

function App() {
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('sesion_activa') === 'true');
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  
  // NUENO ESTADO: Controla si el formulario de creación está abierto o cerrado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerTodosLosEventos = () => {
    axios.get(`http://localhost:8080/api/eventos`) 
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al cargar eventos:", err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      obtenerTodosLosEventos();
    }
  }, [isLoggedIn, recargar]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('http://localhost:8080/api/usuarios/login', {
        username: credentials.user,
        password: credentials.pass
      });
      
      localStorage.setItem('usuario', JSON.stringify(respuesta.data)); 
      localStorage.setItem('usuarioLogueado', respuesta.data.username);
      localStorage.setItem('sesion_activa', 'true');
      setIsLoggedIn(true);
    } catch {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const crearEvento = async (nuevoEvento) => {
    const username = localStorage.getItem('usuarioLogueado');
    try {
      await axios.post(`http://localhost:8080/api/eventos/usuario/${username}`, {
        ...nuevoEvento,
        capacidadMaxima: Number(nuevoEvento.capacidadMaxima)
      });
      alert("¡Evento creado con éxito!");
      setMostrarFormulario(false); // Cerramos el formulario automáticamente al terminar
      setRecargar(prev => prev + 1);
    } catch (error) {
      alert("Error: " + (error.response?.data || "No se pudo crear"));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear(); 
  };

  const totalAsistentes = eventos.reduce((total, ev) => total + (ev.inscripciones?.length || 0), 0);

  // VISTA SI NO ESTÁ LOGUEADO
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', flexDirection: 'column' }}>
        {mostrarRegistro ? (
          <div>
            <RegistroUsuario />
            <button onClick={() => setMostrarRegistro(false)} style={{ display: 'block', margin: '15px auto', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
              ¿Ya tienes cuenta? Inicia Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '300px' }}>
            <h2>Bienvenido</h2>
            <input type="text" placeholder="Usuario" required style={{ width: '100%', margin: '10px 0', padding: '12px', boxSizing: 'border-box' }} onChange={(e) => setCredentials({...credentials, user: e.target.value})} />
            <input type="password" placeholder="Contraseña" required style={{ width: '100%', margin: '10px 0', padding: '12px', boxSizing: 'border-box' }} onChange={(e) => setCredentials({...credentials, pass: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '15px' }}>Entrar</button>
            <button type="button" onClick={() => setMostrarRegistro(true)} style={{ width: '100%', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </form>
        )}
      </div>
    );
  }

  // VISTA PRINCIPAL (LOGUEADO)
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SUPERIOR CON DISEÑO PROFESIONAL */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h1>Gestión de Eventos</h1>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* BOTÓN DE CREAR EVENTO CON UN MÁS (+) */}
          <button 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: mostrarFormulario ? '#6c757d' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {mostrarFormulario ? '✕ Cerrar' : '＋ Crear Evento'}
          </button>

          <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div style={{ display: 'flex', gap: '20px', margin: '30px 0' }}>
        <StatCard title="Eventos en Sistema" value={eventos.length}/>
        <StatCard title="Asistentes Totales" value={totalAsistentes} />
      </div>

      {/* RENDERIZADO CONDICIONAL DEL FORMULARIO */}
      {mostrarFormulario && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Nuevo Evento</h3>
          <FormularioEvento onEventoCreado={crearEvento} />
        </div>
      )}

      {/* TABLA O LISTA DE EVENTOS (SIEMPRE VISIBLE) */}
      <ListaEventos eventos={eventos} onCambio={() => setRecargar(prev => prev + 1)} />
    </div>
  );
}

export default App;