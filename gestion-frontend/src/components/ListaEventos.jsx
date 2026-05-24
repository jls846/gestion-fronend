import EventImageUpload from "./EventImageUpload";
import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  CalendarDays,
  User,
  Users,
  Pencil,
  BadgeCheck,
  Images,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import "./ListaEventos.css";

const ListaEventos = ({ eventos, onCambio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  {/* CLOUDERY*/}
  const [eventoGaleria, setEventoGaleria] = useState(null);
  const [fotoActual, setFotoActual] = useState(0);

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

{/* CLOUDERY*/}  
  const parsearGaleria = (galeriaUrls) => {
    if (!galeriaUrls) return [];
    try { return JSON.parse(galeriaUrls); }
    catch { return []; }
  };

  const manejarInscripcion = async (eventoId) => {
    const usuarioLogueado = obtenerUsuarioSesion();
    if (!usuarioLogueado) { alert("Debes iniciar sesión para inscribirte."); return; }
    try {
      await axios.post(`http://localhost:8080/api/inscripciones/evento/${eventoId}/usuario/${usuarioLogueado.id}`);
      alert("¡Inscripción exitosa!");
      if (onCambio) onCambio();
    } catch (err) {
      alert(err.response?.data || "Error al registrarse");
    }
  };

  const abrirModalEditar = (evento) => {
    setEventoAEditar(evento);
    setFormData({ nombre: evento.nombre, descripcion: evento.descripcion, lugar: evento.lugar, capacidadMaxima: evento.capacidadMaxima });
    setIsModalOpen(true);
  };

  const cerrarModal = () => { setIsModalOpen(false); setEventoAEditar(null); };

  const abrirGaleria = (evento) => { setEventoGaleria(evento); setFotoActual(0); };
  const cerrarGaleria = () => { setEventoGaleria(null); setFotoActual(0); };

  const manejarInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await axios.put(`http://localhost:8080/api/eventos/${eventoAEditar.id}`, eventoActualizado);
      alert("¡Evento actualizado con éxito!");
      cerrarModal();
      if (onCambio) onCambio();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Error al actualizar");
    }
  };

  const usuarioLogueado = obtenerUsuarioSesion();

  return (
    <div className="eventos-container">
      <h2 className="titulo-eventos">Eventos Disponibles</h2>

      <div className="eventos-grid">
        {eventos.map((evento) => {
          const esMiEvento = evento.creador && usuarioLogueado &&
            evento.creador.username.toLowerCase() === usuarioLogueado.username.toLowerCase();
          const estaLleno = evento.inscripciones?.length >= evento.capacidadMaxima;
          const galeria = parsearGaleria(evento.galeriaUrls);
          const tienePortada = !!evento.portadaUrl;
          const tieneGaleria = galeria.length > 0;

          {/* Cloudery */}
          return (
            <div className="evento-card" key={evento.id}>

              <img
                className="evento-imagen"
                src={tienePortada ? evento.portadaUrl : `https://picsum.photos/500/300?random=${evento.id}`}
                alt={evento.nombre}
              />

              <div className="evento-content">
                <div>
                  <div className="evento-header">
                    <h3>{evento.nombre}</h3>
                    {esMiEvento && (
                      <span className="organizador-badge">
                        <BadgeCheck size={14} /> ORGANIZADOR
                      </span>
                    )}
                  </div>

                  <p className="evento-descripcion">{evento.descripcion}</p>

                  <div className="evento-info">
                    <div className="info-box"><MapPin size={16} />{evento.lugar}</div>
                    <div className="info-box"><CalendarDays size={16} />{new Date(evento.fecha).toLocaleString()}</div>
                    <div className="info-box"><User size={16} />{evento.creador?.username || "Sistema"}</div>
                  </div>

                  <div className="categorias">
                    {evento.categorias && evento.categorias.length > 0 ? (
                      evento.categorias.map((cat, index) => (
                        <span className="categoria" key={`evento-${evento.id}-${index}`}>
                          {cat.categoria || cat.nombreCategoria || `Categoría ${cat.id}`}
                        </span>
                      ))
                    ) : (
                      <span className="categoria">Sin categorías</span>
                    )}
                  </div>

                  {tieneGaleria && (
                    <button
                      onClick={() => abrirGaleria(evento)}
                      style={{ marginTop: "10px", background: "none", border: "1px solid #ddd", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", color: "#555", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <Images size={15} /> Ver fotos ({galeria.length})
                    </button>
                  )}
                </div>

                <div className="evento-footer">
                  <div className="cupo"><Users size={16} />Cupo: {evento.inscripciones?.length || 0}/{evento.capacidadMaxima}</div>
                  <div className="botones">
                    {esMiEvento && (
                      <button className="btn btn-editar" onClick={() => abrirModalEditar(evento)}>
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                    <button
                      disabled={esMiEvento || estaLleno}
                      onClick={() => manejarInscripcion(evento.id)}
                      className={esMiEvento || estaLleno ? "btn btn-disabled" : "btn btn-inscribirse"}
                    >
                      {esMiEvento ? "Tu Evento" : estaLleno ? "Cupo Lleno" : "Inscribirme"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3>Editar Evento</h3>
            <form onSubmit={manejarGuardarCambios}>
              <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={manejarInputChange} required />
              <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={manejarInputChange} rows="4" />
              <input type="text" name="lugar" placeholder="Lugar" value={formData.lugar} onChange={manejarInputChange} required />
              <input type="number" name="capacidadMaxima" placeholder="Capacidad" value={formData.capacidadMaxima} onChange={manejarInputChange} required />
{/* CLOUDERY*/}
              <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem", marginTop: "0.5rem" }}>
                <EventImageUpload
                  eventoId={eventoAEditar.id}
                  portadaActual={eventoAEditar.portadaUrl}
                  galeriaActual={parsearGaleria(eventoAEditar.galeriaUrls)}
                  onGuardado={() => { if (onCambio) onCambio(); }}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GALERÍA */}
      {eventoGaleria && (() => {
        const galeria = parsearGaleria(eventoGaleria.galeriaUrls);
        return (
          <div className="modal-overlay" onClick={cerrarGaleria} style={{ background: "rgba(0,0,0,0.85)" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a1a1a", borderRadius: "16px", padding: "20px", maxWidth: "800px", width: "95%", position: "relative" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ color: "#fff", margin: 0 }}>📸 {eventoGaleria.nombre}</h3>
                <button onClick={cerrarGaleria} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                <img src={galeria[fotoActual]} alt={`Foto ${fotoActual + 1}`} style={{ width: "100%", maxHeight: "450px", objectFit: "cover", display: "block" }} />

                {galeria.length > 1 && (
                  <>
                    <button onClick={() => setFotoActual((prev) => (prev - 1 + galeria.length) % galeria.length)}
                      style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setFotoActual((prev) => (prev + 1) % galeria.length)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div style={{ position: "absolute", bottom: "10px", right: "12px", background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: "20px", padding: "3px 10px", fontSize: "13px" }}>
                  {fotoActual + 1} / {galeria.length}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {galeria.map((url, idx) => (
                  <img key={idx} src={url} alt={`Miniatura ${idx + 1}`} onClick={() => setFotoActual(idx)}
                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", border: idx === fotoActual ? "3px solid #ed2553" : "3px solid transparent", flexShrink: 0, transition: "border 0.15s" }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ListaEventos;