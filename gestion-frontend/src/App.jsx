import { useState, useEffect } from 'react';
import axios from 'axios';

import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';
import EstadisticasEventos from './components/EstadisticasEventos';

import LoginForm from './components/LoginForm';
import { RegistroUsuario } from './components/RegistroUsuario';

import NavBar from './components/NavBar';

function App() {

  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('sesion_activa') === 'true'
  );

  const [credentials, setCredentials] = useState({
    user: '',
    pass: ''
  });

  const [mostrarRegistro, setMostrarRegistro] =
    useState(false);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [vistaActual, setVistaActual] =
    useState("inicio");

  const [usuarioLogueado, setUsuarioLogueado] =
    useState(
      () =>
        localStorage.getItem('usuarioLogueado') || ''
    );

  // OBTENER EVENTOS

  const obtenerTodosLosEventos = () => {

    axios
      .get('http://localhost:8080/api/eventos')

      .then((res) => setEventos(res.data))

      .catch((err) =>
        console.error(
          'Error al cargar eventos:',
          err
        )
      );
  };

  useEffect(() => {

    if (isLoggedIn) {
      obtenerTodosLosEventos();
    }

  }, [isLoggedIn, recargar]);

  // LOGIN

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const respuesta = await axios.post(
        'http://localhost:8080/api/usuarios/login',
        {
          username: credentials.user,
          password: credentials.pass
        }
      );

      const usernameBackend =
        respuesta.data.username ||
        credentials.user;

      localStorage.setItem(
        'usuario',
        JSON.stringify(respuesta.data)
      );

      localStorage.setItem(
        'usuarioLogueado',
        usernameBackend
      );

      localStorage.setItem(
        'sesion_activa',
        'true'
      );

      setUsuarioLogueado(usernameBackend);

      setIsLoggedIn(true);

    } catch {

      alert('Usuario o contraseña incorrectos');
    }
  };

  // CREAR EVENTO

  const crearEvento = async (nuevoEvento) => {

    const username =
      localStorage.getItem('usuarioLogueado');

    try {

      await axios.post(
        `http://localhost:8080/api/eventos/usuario/${username}`,
        {
          ...nuevoEvento,

          capacidadMaxima: Number(
            nuevoEvento.capacidadMaxima
          )
        }
      );

      alert('¡Evento creado con éxito!');

      setMostrarFormulario(false);

      setVistaActual("inicio");

      setRecargar((prev) => prev + 1);

    } catch (error) {

      alert(
        'Error: ' +
        (error.response?.data ||
          'No se pudo crear')
      );
    }
  };

  // LOGOUT

  const handleLogout = () => {

    setIsLoggedIn(false);

    setUsuarioLogueado('');

    localStorage.clear();
  };

  // FILTRAR MIS EVENTOS

  const misEventos = eventos.filter(
    (ev) =>
      ev.creador?.username?.toLowerCase() ===
      usuarioLogueado?.toLowerCase()
  );

  // PANTALLA LOGIN

  if (!isLoggedIn) {

    return (

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f4f4f4',
          flexDirection: 'column'
        }}
      >

        {mostrarRegistro ? (

          <div>

            <RegistroUsuario />

            <button
              onClick={() =>
                setMostrarRegistro(false)
              }

              style={{
                display: 'block',
                margin: '15px auto',
                background: 'none',
                border: 'none',
                color: '#ed2553',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
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

  // APP PRINCIPAL

  return (

    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}
    >

      <NavBar
        username={usuarioLogueado}
        onLogout={handleLogout}
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={
          setMostrarFormulario
        }
        setVistaActual={setVistaActual}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px'
        }}
      >

        {/* CREAR EVENTO */}

        {vistaActual === "crear" && (

          <FormularioEvento
            onEventoCreado={crearEvento}
          />

        )}

        {/* TODOS LOS EVENTOS */}

        {vistaActual === "inicio" && (

          <ListaEventos
            eventos={eventos}
            onCambio={() =>
              setRecargar((prev) => prev + 1)
            }
          />

        )}

        {/* MIS EVENTOS */}

        {vistaActual === "misEventos" && (

          <ListaEventos
            eventos={misEventos}
            onCambio={() =>
              setRecargar((prev) => prev + 1)
            }
          />

        )}

        {/* ESTADISTICAS */}

        {vistaActual === "estadisticas" && (

          <EstadisticasEventos
            eventos={misEventos}
          />

        )}

      </div>

    </div>
  );
}

export default App;