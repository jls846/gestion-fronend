import { useState, useEffect } from 'react';
import axios from 'axios';

import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';
import EstadisticasEventos from './components/EstadisticasEventos';
import EventImageUpload from './components/EventImageUpload';//cloudenary

import LoginForm from './components/LoginForm';
import { RegistroUsuario } from './components/RegistroUsuario';

import NavBar from './components/NavBar';

function App() {

  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('sesion_activa') === 'true'
  );

  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vistaActual, setVistaActual] = useState("inicio");

  const [usuarioLogueado, setUsuarioLogueado] = useState(
    () => localStorage.getItem('usuarioLogueado') || ''
  );

  const [eventoRecienCreado, setEventoRecienCreado] = useState(null);

  const obtenerTodosLosEventos = () => {
    axios
      .get('http://localhost:8080/api/eventos')
      .then((res) => setEventos(res.data))
      .catch((err) => console.error('Error al cargar eventos:', err));
  };

  useEffect(() => {
    if (isLoggedIn) obtenerTodosLosEventos();
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
      setUsuarioLogueado(usernameBackend);
      setIsLoggedIn(true);
    } catch {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const crearEvento = async (nuevoEvento) => {
    const username = localStorage.getItem('usuarioLogueado');
    try {
      const respuesta = await axios.post(
        `http://localhost:8080/api/eventos/usuario/${username}`,
        { ...nuevoEvento, capacidadMaxima: Number(nuevoEvento.capacidadMaxima) }
      );
      setEventoRecienCreado(respuesta.data);
      setRecargar((prev) => prev + 1);
    } catch (error) {
      alert('Error: ' + (error.response?.data || 'No se pudo crear'));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsuarioLogueado('');
    localStorage.clear();
  };

  const misEventos = eventos.filter(
    (ev) => ev.creador?.username?.toLowerCase() === usuarioLogueado?.toLowerCase()
  );

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', flexDirection: 'column' }}>
        {mostrarRegistro ? (
          <div>
            <RegistroUsuario />
            <button
              onClick={() => setMostrarRegistro(false)}
              style={{ display: 'block', margin: '15px auto', background: 'none', border: 'none', color: '#ed2553', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ¿Ya tienes cuenta? Inicia Sesión
            </button>
          </div>
        ) : (
          <LoginForm
            handleLogin={handleLogin}
            credentials={credentials}
            setCredentials={setCredentials}
            setMostrarRegistro={setMostrarRegistro}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar
        username={usuarioLogueado}
        onLogout={handleLogout}
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={setMostrarFormulario}
        setVistaActual={(vista) => {
          setVistaActual(vista);
          setEventoRecienCreado(null);
        }}
      />
{/* Cloudenary */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

        {vistaActual === "crear" && (
          <>
            {eventoRecienCreado ? (
              <div style={{ background: "white", borderRadius: "16px", padding: "35px", boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "24px" }}>🎉</span>
                  <h2 style={{ margin: 0, color: "#262626" }}>¡Evento "{eventoRecienCreado.nombre}" creado!</h2>
                </div>
                <p style={{ color: "#888", marginBottom: "1.5rem" }}>
                  Ahora puedes agregar una portada y fotos. Puedes hacerlo ahora o más tarde desde "Editar".
                </p>
                <EventImageUpload
                  eventoId={eventoRecienCreado.id}
                  onGuardado={() => {
                    alert("¡Imágenes guardadas!");
                    setEventoRecienCreado(null);
                    setVistaActual("inicio");
                    setRecargar((prev) => prev + 1);
                  }}
                />
                <button
                  onClick={() => {
                    setEventoRecienCreado(null);
                    setVistaActual("inicio");
                  }}
                  style={{ marginTop: "12px", background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                >
                  Saltar por ahora, agregar fotos después
                </button>
              </div>
            ) : (
              <FormularioEvento onEventoCreado={crearEvento} />
            )}
          </>
        )}

        {vistaActual === "inicio" && (
          <ListaEventos eventos={eventos} onCambio={() => setRecargar((prev) => prev + 1)} />
        )}

        {vistaActual === "misEventos" && (
          <ListaEventos eventos={misEventos} onCambio={() => setRecargar((prev) => prev + 1)} />
        )}

        {vistaActual === "estadisticas" && (
          <EstadisticasEventos eventos={misEventos} />
        )}

      </div>
    </div>
  );
}

export default App;