import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  CalendarDays,
  User,
  Users,
  Pencil,
  BadgeCheck
} from "lucide-react";

import "./ListaEventos.css";

const ListaEventos = ({ eventos, onCambio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    lugar: "",
    capacidadMaxima: "",
  });

  const obtenerUsuarioSesion = () => {
    const usuarioStored = localStorage.getItem("usuario");
    return usuarioStored ? JSON.parse(usuarioStored) : null;
  };

  const manejarInscripcion = async (eventoId) => {
    const usuarioLogueado = obtenerUsuarioSesion();

    if (!usuarioLogueado) {
      alert("Debes iniciar sesión para inscribirte.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/inscripciones/evento/${eventoId}/usuario/${usuarioLogueado.id}`
      );

      alert("¡Inscripción exitosa!");

      if (onCambio) onCambio();

    } catch (err) {
      alert(err.response?.data || "Error al registrarse");
    }
  };

  const abrirModalEditar = (evento) => {
    setEventoAEditar(evento);

    setFormData({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      lugar: evento.lugar,
      capacidadMaxima: evento.capacidadMaxima,
    });

    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEventoAEditar(null);
  };

  const manejarInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const manejarGuardarCambios = async (e) => {
    e.preventDefault();

    const eventoActualizado = {
      id: eventoAEditar.id,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      lugar: formData.lugar,
      capacidadMaxima: parseInt(formData.capacidadMaxima, 10),
      fecha: eventoAEditar.fecha,
      categorias: eventoAEditar.categorias || [],
    };

    try {
      await axios.put(
        `http://localhost:8080/api/eventos/${eventoAEditar.id}`,
        eventoActualizado
      );

      alert("¡Evento actualizado con éxito!");

      cerrarModal();

      if (onCambio) onCambio();

    } catch (err) {
      console.error("Error en la petición:", err.response);

      const mensaje =
        err.response?.data?.message ||
        err.response?.data ||
        "Error al actualizar";

      alert(mensaje);
    }
  };

  const usuarioLogueado = obtenerUsuarioSesion();

  return (
    <div className="eventos-container">

      <h2 className="titulo-eventos">
        Eventos Disponibles
      </h2>

      <div className="eventos-grid">

        {eventos.map((evento) => {
          const esMiEvento =
            evento.creador &&
            usuarioLogueado &&
            evento.creador.username.toLowerCase() ===
              usuarioLogueado.username.toLowerCase();

          const estaLleno =
            evento.inscripciones?.length >= evento.capacidadMaxima;

          return (
            <div className="evento-card" key={evento.id}>

              <img
                className="evento-imagen"
                src={`https://picsum.photos/500/300?random=${evento.id}`}
                alt={evento.nombre}
              />

              <div className="evento-content">

                <div>

                  <div className="evento-header">

                    <h3>{evento.nombre}</h3>

                    {esMiEvento && (
                      <span className="organizador-badge">
                        <BadgeCheck size={14} />
                        ORGANIZADOR
                      </span>
                    )}

                  </div>

                  <p className="evento-descripcion">
                    {evento.descripcion}
                  </p>

                  <div className="evento-info">

                    <div className="info-box">
                      <MapPin size={16} />
                      {evento.lugar}
                    </div>

                    <div className="info-box">
                      <CalendarDays size={16} />
                      {new Date(evento.fecha).toLocaleString()}
                    </div>

                    <div className="info-box">
                      <User size={16} />
                      {evento.creador?.username || "Sistema"}
                    </div>

                  </div>

                  <div className="categorias">

                    {evento.categorias && evento.categorias.length > 0 ? (
                      evento.categorias.map((cat, index) => (
                        <span
                          className="categoria"
                          key={`evento-${evento.id}-${index}`}
                        >
                          {cat.categoria ||
                            cat.nombreCategoria ||
                            `Categoría ${cat.id}`}
                        </span>
                      ))
                    ) : (
                      <span className="categoria">
                        Sin categorías
                      </span>
                    )}

                  </div>

                </div>

                <div className="evento-footer">

                  <div className="cupo">
                    <Users size={16} />
                    Cupo: {evento.inscripciones?.length || 0}/{evento.capacidadMaxima}
                  </div>

                  <div className="botones">

                    {esMiEvento && (
                      <button
                        className="btn btn-editar"
                        onClick={() => abrirModalEditar(evento)}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                    )}

                    <button
                      disabled={esMiEvento || estaLleno}
                      onClick={() => manejarInscripcion(evento.id)}
                      className={
                        esMiEvento || estaLleno
                          ? "btn btn-disabled"
                          : "btn btn-inscribirse"
                      }
                    >
                      {esMiEvento
                        ? "Tu Evento"
                        : estaLleno
                        ? "Cupo Lleno"
                        : "Inscribirme"}
                    </button>

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {isModalOpen && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>Editar Evento</h3>

            <form onSubmit={manejarGuardarCambios}>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={manejarInputChange}
                required
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={manejarInputChange}
                rows="4"
              />

              <input
                type="text"
                name="lugar"
                placeholder="Lugar"
                value={formData.lugar}
                onChange={manejarInputChange}
                required
              />

              <input
                type="number"
                name="capacidadMaxima"
                placeholder="Capacidad"
                value={formData.capacidadMaxima}
                onChange={manejarInputChange}
                required
              />

              <div className="modal-buttons">

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                >
                  Guardar
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default ListaEventos;