import { useState, useRef } from "react";

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  .pqr-wrap { font-family:'Instrument Sans',sans-serif; background:#f5f2ee; min-height:100vh; padding:2.5rem 2rem; }
  .pqr-header { font-family:'Syne',sans-serif; font-size:2rem; font-weight:800; color:#1a1814; margin-bottom:0.2rem; }
  .pqr-sub { color:#8a8278; font-size:0.85rem; margin-bottom:2rem; letter-spacing:0.06em; }
  .pqr-form { background:#fff; border-radius:12px; padding:2rem; box-shadow:0 2px 20px #0000000a; max-width:640px; }
  .tipo-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; margin-bottom:1.5rem; }
  .tipo-btn { padding:0.9rem 0.5rem; border-radius:8px; border:2px solid #e8e4de; background:#faf9f7; cursor:pointer; text-align:center; transition:all 0.2s; }
  .tipo-btn:hover { border-color:#c9b490; }
  .tipo-btn.active-queja { border-color:#d45c5c; background:#fff5f5; }
  .tipo-btn.active-peticion { border-color:#5c7ed4; background:#f5f7ff; }
  .tipo-btn.active-reclamo { border-color:#d4a05c; background:#fff8f0; }
  .tipo-icon { font-size:1.5rem; margin-bottom:0.3rem; }
  .tipo-label { font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; }
  .tipo-label.queja { color:#d45c5c; }
  .tipo-label.peticion { color:#5c7ed4; }
  .tipo-label.reclamo { color:#d4a05c; }
  .field-label { font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; color:#4a4640; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:0.4rem; display:block; }
  .field-group { margin-bottom:1.2rem; }
  .pqr-input, .pqr-textarea, .pqr-select { width:100%; border:1.5px solid #e0dbd4; border-radius:6px; background:#faf9f7; font-family:'Instrument Sans',sans-serif; font-size:0.9rem; color:#1a1814; padding:0.65rem 0.85rem; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
  .pqr-input:focus, .pqr-textarea:focus, .pqr-select:focus { border-color:#c9b490; background:#fff; }
  .pqr-textarea { resize:vertical; min-height:110px; }
  .pqr-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8278'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.85rem center; }
  .upload-area { border:2px dashed #d8d3cb; border-radius:8px; padding:1.5rem; text-align:center; cursor:pointer; transition:border-color 0.2s, background 0.2s; background:#faf9f7; }
  .upload-area:hover { border-color:#c9b490; background:#fff; }
  .upload-icon { font-size:2rem; margin-bottom:0.4rem; opacity:0.5; }
  .upload-text { font-size:0.82rem; color:#8a8278; }
  .upload-text strong { color:#4a4640; }
  .attachments-grid { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.75rem; }
  .attachment-chip { display:flex; align-items:center; gap:0.4rem; background:#f0ece5; border-radius:20px; padding:0.3rem 0.75rem 0.3rem 0.5rem; font-size:0.75rem; color:#4a4640; }
  .attachment-chip img { width:28px; height:28px; object-fit:cover; border-radius:3px; }
  .attachment-chip .file-icon { font-size:1rem; }
  .attachment-remove { background:none; border:none; cursor:pointer; color:#8a8278; padding:0; line-height:1; font-size:0.9rem; }
  .attachment-remove:hover { color:#d45c5c; }
  .btn-submit { width:100%; padding:0.9rem; background:#1a1814; color:#f5f2ee; font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; border:none; border-radius:8px; cursor:pointer; letter-spacing:0.06em; text-transform:uppercase; transition:opacity 0.2s; margin-top:0.5rem; }
  .btn-submit:hover { opacity:0.85; }
  .btn-submit:disabled { opacity:0.3; cursor:not-allowed; }
  .radicado-banner { background:#eef4ee; border:1.5px solid #a3c9a3; border-radius:8px; padding:1.2rem 1.5rem; margin-top:1.5rem; }
  .radicado-title { font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; color:#2d5a2d; margin-bottom:0.3rem; }
  .radicado-num { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; color:#2d5a2d; letter-spacing:0.08em; }
  .radicado-sub { font-size:0.78rem; color:#5a8a5a; margin-top:0.2rem; }
`;

const tipos = [
  { key: "queja", icon: "😤", label: "Queja", desc: "Expresar inconformidad" },
  { key: "peticion", icon: "📝", label: "Petición", desc: "Solicitar algo" },
  { key: "reclamo", icon: "⚠️", label: "Reclamo", desc: "Exigir un derecho" },
];

const areas = ["Servicio al cliente", "Domicilios", "Tienda física", "Facturación", "Devoluciones"];

export default function CrearPQR() {
  const [tipo, setTipo] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [area, setArea] = useState("");
  const [adjuntos, setAdjuntos] = useState([]);
  const [radicado, setRadicado] = useState(null);
  const fileRef = useRef();

  const handleFiles = (files) => {
    const nuevos = Array.from(files).map(f => ({
      nombre: f.name,
      tipo: f.type,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAdjuntos(prev => [...prev, ...nuevos].slice(0, 5));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const enviar = () => {
    if (!tipo || !asunto.trim() || !descripcion.trim()) return;
    const num = `PQR-${Date.now().toString().slice(-6)}`;
    setRadicado(num);
  };

  const nuevo = () => {
    setTipo(null); setAsunto(""); setDescripcion(""); setArea(""); setAdjuntos([]); setRadicado(null);
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="pqr-wrap">
        <h1 className="pqr-header">Radicación de PQR</h1>
        <p className="pqr-sub">Peticiones · Quejas · Reclamos</p>

        <div className="pqr-form">
          {!radicado ? (
            <>
              {/* Tipo */}
              <div className="field-group">
                <span className="field-label">Tipo de solicitud</span>
                <div className="tipo-grid">
                  {tipos.map(t => (
                    <div
                      key={t.key}
                      className={`tipo-btn${tipo === t.key ? ` active-${t.key}` : ""}`}
                      onClick={() => setTipo(t.key)}
                    >
                      <div className="tipo-icon">{t.icon}</div>
                      <div className={`tipo-label ${t.key}`}>{t.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "#8a8278", marginTop: "0.15rem" }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Área */}
              <div className="field-group">
                <label className="field-label">Área relacionada</label>
                <select className="pqr-select" value={area} onChange={e => setArea(e.target.value)}>
                  <option value="">Selecciona un área…</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Asunto */}
              <div className="field-group">
                <label className="field-label">Asunto</label>
                <input
                  className="pqr-input"
                  placeholder="Resume tu solicitud en una línea…"
                  value={asunto}
                  onChange={e => setAsunto(e.target.value)}
                />
              </div>

              {/* Descripción */}
              <div className="field-group">
                <label className="field-label">Descripción detallada</label>
                <textarea
                  className="pqr-textarea"
                  placeholder="Describe con detalle lo ocurrido, incluyendo fechas, pedidos u otra información relevante…"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                />
              </div>

              {/* Adjuntos */}
              <div className="field-group">
                <label className="field-label">Adjuntar fotos o comprobantes (máx. 5)</label>
                <div
                  className="upload-area"
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                >
                  <div className="upload-icon">📎</div>
                  <div className="upload-text">
                    <strong>Haz clic o arrastra archivos aquí</strong>
                    <br />JPG, PNG, PDF · Máx. 10 MB por archivo
                  </div>
                  <input
                    ref={fileRef} type="file" multiple accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={e => handleFiles(e.target.files)}
                  />
                </div>
                {adjuntos.length > 0 && (
                  <div className="attachments-grid">
                    {adjuntos.map((a, i) => (
                      <div key={i} className="attachment-chip">
                        {a.preview
                          ? <img src={a.preview} alt="" />
                          : <span className="file-icon">📄</span>
                        }
                        <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nombre}</span>
                        <button className="attachment-remove" onClick={() => setAdjuntos(prev => prev.filter((_, j) => j !== i))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="btn-submit"
                disabled={!tipo || !asunto.trim() || !descripcion.trim()}
                onClick={enviar}
              >
                Radicar solicitud
              </button>
            </>
          ) : (
            <div>
              <div className="radicado-banner">
                <div className="radicado-title">✓ Solicitud radicada exitosamente</div>
                <div className="radicado-num">{radicado}</div>
                <div className="radicado-sub">
                  Guarda este número. Recibirás notificaciones sobre el estado de tu {tipo}.
                </div>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#faf9f7", borderRadius: "8px", fontSize: "0.82rem", color: "#6a6460", lineHeight: "1.7" }}>
                <strong style={{ color: "#1a1814" }}>Tipo:</strong> {tipo.charAt(0).toUpperCase() + tipo.slice(1)}<br />
                <strong style={{ color: "#1a1814" }}>Asunto:</strong> {asunto}<br />
                {area && <><strong style={{ color: "#1a1814" }}>Área:</strong> {area}<br /></>}
                <strong style={{ color: "#1a1814" }}>Adjuntos:</strong> {adjuntos.length} archivo(s)
              </div>
              <button className="btn-submit" onClick={nuevo} style={{ marginTop: "1rem" }}>
                Radicar otra solicitud
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
