//NUEVO COMPONENTE PARA SUBIR LAS IMAGENES A CLOUDENARY DESDE LA COMPUTADORA DEL USUARIO
import { useState, useRef } from "react";

const CLOUD_NAME = "drx6v6klb";
const UPLOAD_PRESET = "eventos_preset";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function subirImagenACloudinary(archivo) {
  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Error al subir imagen");
  const data = await res.json();
  return data.secure_url;
}

export default function EventImageUpload({ eventoId, onGuardado }) {
  const [portadaArchivo, setPortadaArchivo] = useState(null);
  const [galeriaArchivos, setGaleriaArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleGuardar = async () => {
    if (!portadaArchivo && galeriaArchivos.length === 0) {
      setMensaje("Selecciona al menos una imagen.");
      return;
    }
    setCargando(true);
    setMensaje("");
    try {
      let portadaUrl = null;
      if (portadaArchivo) {
        portadaUrl = await subirImagenACloudinary(portadaArchivo);
      }
      const galeriaUrls = await Promise.all(
        galeriaArchivos.map((f) => subirImagenACloudinary(f))
      );
      const res = await fetch(`http://localhost:8080/api/eventos/${eventoId}/imagenes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portadaUrl, galeriaUrls }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setMensaje("✅ Imágenes guardadas correctamente");
      if (onGuardado) onGuardado();
    } catch (err) {
      setMensaje("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px 0" }}>
      <p style={{ fontWeight: 600, margin: 0, color: "#262626" }}>Imágenes del evento</p>

      <div>
        <label style={{ fontSize: "13px", color: "#666" }}>Portada:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPortadaArchivo(e.target.files[0])}
          style={{ display: "block", marginTop: "4px" }}
        />
      </div>

      <div>
        <label style={{ fontSize: "13px", color: "#666" }}>Fotos adicionales:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setGaleriaArchivos([...e.target.files])}
          style={{ display: "block", marginTop: "4px" }}
        />
      </div>

      {mensaje && <p style={{ margin: 0, fontSize: "13px" }}>{mensaje}</p>}

      <button
        onClick={handleGuardar}
        disabled={cargando}
        style={{ padding: "10px", background: cargando ? "#ccc" : "#ed2553", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: cargando ? "not-allowed" : "pointer" }}
      >
        {cargando ? "Subiendo..." : "Guardar imágenes"}
      </button>
    </div>
  );
}