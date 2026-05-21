import { useState, useEffect } from 'react';
import axios from 'axios';
import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';
import { RegistroUsuario } from './components/RegistroUsuario';

// COMPONENTE NAVBAR 
const UserProfileNav = ({ username, onLogout }) => {
  const nombreMostrar = username || 'Usuario';
  const inicial = nombreMostrar.charAt(0).toUpperCase();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      backgroundColor: '#f8f9fa',
      padding: '6px 14px',
      borderRadius: '25px',
      border: '1px solid #e9ecef'
    }}>
      {/* Avatar Circular con Inicial */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1rem',
        boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
      }}>
        {inicial}
      </div>

      {/* Info del usuario y Botón de Salida */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#495057' }}>
          {nombreMostrar}
        </span>
        <button 
          onClick={onLogout} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#dc3545', 
            fontSize: '0.75rem', 
            padding: 0, 
            cursor: 'pointer', 
            textDecoration: 'underline',
            marginTop: '-2px'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Nombre del usuario logueado con el Avatar
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('usuarioLogueado') || '');

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
      
      const usernameBackend = respuesta.data.username || credentials.user;

      localStorage.setItem('usuario', JSON.stringify(respuesta.data)); 
      localStorage.setItem('usuarioLogueado', usernameBackend);
      localStorage.setItem('sesion_activa', 'true');
      
      // Actualizamos los estados juntos para evitar desfases visuales
      setUsuarioLogueado(usernameBackend);
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
      setMostrarFormulario(false);
      setRecargar(prev => prev + 1);
    } catch (error) {
      alert("Error: " + (error.response?.data || "No se pudo crear"));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsuarioLogueado('');
    localStorage.clear(); 
  };

  const totalAsistentes = eventos.reduce((total, ev) => total + (ev.inscripciones?.length || 0), 0);

  // VISTA NO LOGUEADO
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

  // VISTA PRINCIPAL
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Gestión de Eventos</h1>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* BOTÓN DE CREAR EVENTO */}
          <button 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: mostrarFormulario ? '#6c757d' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {mostrarFormulario ? '✕ Cerrar' : '＋ Crear Evento'}
          </button>

          {/* COMPONENTE DE PERFIL FLOTANTE CON LA PROP ENLAZADA */}
          <UserProfileNav username={usuarioLogueado} onLogout={handleLogout} />
        </div>
      </header>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div style={{ display: 'flex', gap: '20px', margin: '30px 0'}}>
        <StatCard title="Eventos en Sistema" value={eventos.length} />
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

      {/* TABLA O LISTA DE EVENTOS */}
      <ListaEventos eventos={eventos} onCambio={() => setRecargar(prev => prev + 1)} />
    </div>
  );
}

export default App;