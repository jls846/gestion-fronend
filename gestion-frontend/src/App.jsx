import { useState, useEffect } from 'react';
import axios from 'axios';
import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';

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
      alert("¡Evento creado!");
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

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '300px' }}>
          <h2>Bienvenido</h2>
          <input type="text" placeholder="Usuario" required style={{ width: '100%', margin: '10px 0', padding: '12px' }} onChange={(e) => setCredentials({...credentials, user: e.target.value})} />
          <input type="password" placeholder="Contraseña" required style={{ width: '100%', margin: '10px 0', padding: '12px' }} onChange={(e) => setCredentials({...credentials, pass: e.target.value})} />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestión de Eventos </h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div style={{ display: 'flex', gap: '20px', margin: '30px 0' }}>
        <StatCard title="Eventos en Sistema" value={eventos.length}/>
        <StatCard title="Asistentes Totales" value={totalAsistentes} />
      </div>

      <FormularioEvento onEventoCreado={crearEvento} />
      <hr style={{ margin: '40px 0' }} />
      <ListaEventos eventos={eventos} onCambio={() => setRecargar(prev => prev + 1)} />
    </div>
  );
}

export default App;