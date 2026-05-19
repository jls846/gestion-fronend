import { useState } from "react";
import axios from "axios";

const ListaEventos = ({ eventos, onCambio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    lugar: "",
    capacidadMaxima: "",
  });

  // Helper para obtener el usuario del localStorage de forma segura
  const obtenerUsuarioSesion = () => {
    const usuarioStored = localStorage.getItem("usuario"); // Usamos "usuario" uniformemente
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
    setFormData({ ...formData, [name]: value });
  };

  const manejarGuardarCambios = async (e) => {
    e.preventDefault();

    // Re-adjuntamos las categorías y datos sensibles que no están en el formulario 
    // para evitar que el backend los borre o reescriba como null
    const eventoActualizado = {
      id: eventoAEditar.id,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      lugar: formData.lugar,
      capacidadMaxima: parseInt(formData.capacidadMaxima, 10),
      fecha: eventoAEditar.fecha,
      categorias: eventoAEditar.categorias || [] 
    };

    try {
      await axios.put(`http://localhost:8080/api/eventos/${eventoAEditar.id}`, eventoActualizado);
      alert("¡Evento actualizado con éxito!");
      cerrarModal();
      if (onCambio) onCambio(); 
    } catch (err) {
      console.error("Error en la petición:", err.response);
      const mensaje = err.response?.data?.message || err.response?.data || "Error al actualizar";
      alert(mensaje);
    }
  };

  // Obtenemos el usuario una sola vez para la renderización
  const usuarioLogueado = obtenerUsuarioSesion();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Eventos Disponibles
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {eventos.map((evento) => {
          // Comprobación usando el mismo objeto consistente del localStorage
          const esMiEvento =
            evento.creador &&
            usuarioLogueado &&
            evento.creador.username.toLowerCase() === usuarioLogueado.username.toLowerCase();

          const estaLleno = evento.inscripciones?.length >= evento.capacidadMaxima;

          return (
            <div
              key={evento.id}
              style={{
                border: esMiEvento ? "2px solid #007bff" : "1px solid #ddd",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: esMiEvento ? "0 6px 12px rgba(0,123,255,0.2)" : "0 4px 6px rgba(0,0,0,0.1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {esMiEvento && (
                <div style={{
                  position: "absolute", top: "-10px", right: "10px",
                  backgroundColor: "#007bff", color: "white", padding: "4px 12px",
                  borderRadius: "50px", fontSize: "0.7rem", fontWeight: "bold", zIndex: 1,
                }}>
                  ORGANIZADOR
                </div>
              )}

              <div>
                <h3 style={{ marginTop: "5px", color: esMiEvento ? "#007bff" : "#333" }}>
                  {evento.nombre}
                </h3>
                <p style={{ color: "#666", fontSize: "0.9rem", minHeight: "40px" }}>
                  {evento.descripcion}
                </p>

                {/* Categorías */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "10px 0" }}>
                  {evento.categorias && evento.categorias.length > 0 ? (
                    evento.categorias.map((cat, index) => (
                      <span
                        key={`evento-${evento.id}-cat-${cat.id}-${index}`}
                        style={{
                          backgroundColor: "#e7f3ff", color: "#007bff", padding: "4px 10px",
                          borderRadius: "50px", fontSize: "0.75rem", fontWeight: "bold", border: "1px solid #b8daff",
                        }}
                      >
                        {cat.categoria || cat.nombreCategoria || `Categoría ${cat.id}`}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#aaa", fontSize: "0.75rem", fontStyle: "italic" }}>
                      Sin categorías
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.85rem", margin: "10px 0", borderTop: "1px solid #eee", paddingTop: "10px" }}>
                  <p style={{ margin: "5px 0" }}><strong>Lugar:</strong> {evento.lugar}</p>
                  <p style={{ margin: "5px 0" }}><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleString()}</p>
                  <p style={{ margin: "5px 0" }}><strong>Organiza:</strong> {evento.creador?.username || "Sistema"}</p>
                </div>
              </div>

              <div>
                <div style={{
                  margin: "15px 0", padding: "8px", backgroundColor: estaLleno ? "#fff3f3" : "#f0f7ff",
                  borderRadius: "5px", textAlign: "center", border: estaLleno ? "1px solid #ffcccc" : "1px solid #d0e7ff",
                }}>
                  <strong>Cupo:</strong> {evento.inscripciones?.length || 0} / {evento.capacidadMaxima}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {esMiEvento && (
                    <button
                      onClick={() => abrirModalEditar(evento)}
                      style={{
                        flex: 1, backgroundColor: "#ffc107", color: "#212529", border: "none",
                        padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold",
                      }}
                    >
                      Editar
                    </button>
                  )}

                  <button
                    disabled={esMiEvento || estaLleno}
                    onClick={() => manejarInscripcion(evento.id)}
                    style={{
                      flex: esMiEvento ? 1.5 : 1,
                      backgroundColor: esMiEvento ? "#e2e3e5" : estaLleno ? "#dc3545" : "#28a745",
                      color: esMiEvento ? "#383d41" : "white", border: "none", padding: "12px",
                      borderRadius: "6px", cursor: esMiEvento || estaLleno ? "not-allowed" : "pointer", fontWeight: "bold",
                    }}
                  >
                    {esMiEvento ? "Dueño" : estaLleno ? "Cupo Lleno" : "Confirmar Inscripción"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white", padding: "30px", borderRadius: "12px",
            width: "100%", maxWidth: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", boxSizing: "border-box"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333", textAlign: "center" }}>
              Modificar Detalles del Evento
            </h3>
            
            <form onSubmit={manejarGuardarCambios}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Nombre del Evento</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={manejarInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={manejarInputChange} required rows="3" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", resize: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Lugar</label>
                <input type="text" name="lugar" value={formData.lugar} onChange={manejarInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Capacidad Máxima</label>
                <input type="number" name="capacidadMaxima" value={formData.capacidadMaxima} onChange={manejarInputChange} required min="1" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={cerrarModal} style={{ padding: "10px 15px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#f8f9fa", cursor: "pointer", fontWeight: "bold" }}>Cancelar</button>
                <button type="submit" style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer", fontWeight: "bold" }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEventos;