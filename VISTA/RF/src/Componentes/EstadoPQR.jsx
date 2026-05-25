import { useState, useEffect } from "react";

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital@0;1&display=swap');
  * { box-sizing: border-box; }
  .estado-wrap { font-family:'Space Grotesk',sans-serif; background:#0a0f1e; color:#c8d4e8; min-height:100vh; padding:2rem; }
  .estado-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem; }
  .estado-titulo { font-size:1.8rem; font-weight:700; color:#e8f0ff; }
  .estado-sub { font-size:0.8rem; color:#4a5a7a; margin-top:0.2rem; font-family:'Space Mono',monospace; }
  .notif-bell { position:relative; cursor:pointer; }
  .notif-icon { font-size:1.5rem; }
  .notif-badge { position:absolute; top:-4px; right:-6px; background:#4f8ef7; color:#fff; border-radius:50%; width:18px; height:18px; font-size:0.65rem; display:flex; align-items:center; justify-content:center; font-weight:700; }
  .buscar-wrap { display:flex; gap:0.75rem; margin-bottom:1.5rem; }
  .buscar-input { flex:1; background:#131929; border:1px solid #1e2d4a; border-radius:6px; color:#c8d4e8; font-family:'Space Grotesk',sans-serif; font-size:0.88rem; padding:0.65rem 1rem; outline:none; transition:border-color 0.2s; }
  .buscar-input:focus { border-color:#4f8ef7; }
  .buscar-input::placeholder { color:#2e3f5a; }
  .pqr-list { display:flex; flex-direction:column; gap:0.75rem; }
  .pqr-item { background:#0f1828; border:1px solid #1e2d4a; border-radius:8px; overflow:hidden; cursor:pointer; transition:border-color 0.2s; }
  .pqr-item:hover { border-color:#2e4a7a; }
  .pqr-item.expanded { border-color:#4f8ef7; }
  .pqr-item-header { display:flex; align-items:center; gap:1rem; padding:1rem 1.2rem; }
  .tipo-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .tipo-dot.queja { background:#f76e6e; }
  .tipo-dot.peticion { background:#6e9ef7; }
  .tipo-dot.reclamo { background:#f7b26e; }
  .pqr-num { font-family:'Space Mono',monospace; font-size:0.78rem; color:#4a5a7a; flex-shrink:0; }
  .pqr-asunto { font-size:0.9rem; font-weight:500; color:#e8f0ff; flex:1; }
  .pqr-fecha { font-size:0.75rem; color:#4a5a7a; flex-shrink:0; }
  .estado-chip { padding:0.25rem 0.75rem; border-radius:20px; font-size:0.72rem; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; flex-shrink:0; }
  .estado-chip.radicado { background:#1a2a4a; color:#6e9ef7; }
  .estado-chip.en_revision { background:#2a2010; color:#f7d06e; }
  .estado-chip.en_proceso { background:#0d2a1a; color:#6ef7a0; }
  .estado-chip.resuelto { background:#152a15; color:#5ae85a; }
  .estado-chip.cerrado { background:#1a1a1a; color:#4a5a7a; }
  .pqr-timeline { padding:0 1.2rem 1.2rem 2.6rem; }
  .timeline-line { border-left:1px solid #1e2d4a; padding-left:1.2rem; margin-left:0.4rem; }
  .tl-event { position:relative; margin-bottom:1rem; }
  .tl-event:last-child { margin-bottom:0; }
  .tl-dot { position:absolute; left:-1.6rem; top:0.2rem; width:8px; height:8px; border-radius:50%; background:#1e2d4a; border:2px solid #1e2d4a; }
  .tl-dot.active { background:#4f8ef7; border-color:#4f8ef7; box-shadow:0 0 0 3px #4f8ef710; }
  .tl-fecha { font-family:'Space Mono',monospace; font-size:0.7rem; color:#4a5a7a; margin-bottom:0.15rem; }
  .tl-desc { font-size:0.82rem; color:#c8d4e8; }
  .tl-resp { font-size:0.8rem; color:#8aa8d8; font-style:italic; margin-top:0.3rem; background:#131929; border-radius:4px; padding:0.5rem 0.75rem; border-left:2px solid #4f8ef7; }
  .notif-panel { position:fixed; top:0; right:0; height:100vh; width:320px; background:#0f1828; border-left:1px solid #1e2d4a; padding:1.5rem; z-index:50; overflow-y:auto; transform:translateX(100%); transition:transform 0.3s ease; }
  .notif-panel.open { transform:translateX(0); }
  .notif-panel-title { font-size:1rem; font-weight:600; color:#e8f0ff; margin-bottom:1.2rem; display:flex; justify-content:space-between; }
  .notif-close { background:none; border:none; color:#4a5a7a; cursor:pointer; font-size:1.2rem; }
  .notif-card { background:#131929; border-radius:6px; padding:0.85rem 1rem; margin-bottom:0.6rem; border-left:3px solid #4f8ef7; }
  .notif-card.nueva { border-left-color:#6ef7a0; }
  .notif-card-asunto { font-size:0.82rem; font-weight:600; color:#e8f0ff; margin-bottom:0.2rem; }
  .notif-card-msg { font-size:0.78rem; color:#8aa8d8; }
  .notif-card-hora { font-family:'Space Mono',monospace; font-size:0.68rem; color:#4a5a7a; margin-top:0.3rem; }
  .overlay { position:fixed; inset:0; background:#00000060; z-index:40; }
`;

const estadoOrder = ["radicado", "en_revision", "en_proceso", "resuelto"];

const pqrData = [
  {
    id: "PQR-482901", tipo: "reclamo", asunto: "Pedido llegó con libro equivocado",
    estado: "en_proceso", fecha: "19 may 2026",
    timeline: [
      { fecha: "19 may · 10:22", desc: "Solicitud radicada", activo: false },
      { fecha: "19 may · 14:05", desc: "En revisión por el equipo", activo: false },
      { fecha: "20 may · 09:30", desc: "En proceso de solución", resp: "Hemos identificado el error en bodega. Procederemos a enviar el libro correcto sin costo adicional.", activo: true },
    ]
  },
  {
    id: "PQR-471234", tipo: "peticion", asunto: "Solicitud de catálogo de novedades mayo",
    estado: "resuelto", fecha: "12 may 2026",
    timeline: [
      { fecha: "12 may · 08:15", desc: "Solicitud radicada", activo: false },
      { fecha: "12 may · 11:40", desc: "En revisión", activo: false },
      { fecha: "13 may · 10:00", desc: "Resuelta", resp: "Se ha enviado a tu correo el catálogo de novedades de mayo. ¡Gracias por tu interés!", activo: true },
    ]
  },
  {
    id: "PQR-463500", tipo: "queja", asunto: "Atención en tienda fue deficiente",
    estado: "en_revision", fecha: "22 may 2026",
    timeline: [
      { fecha: "22 may · 16:50", desc: "Solicitud radicada", activo: false },
      { fecha: "23 may · 09:10", desc: "Asignada para revisión", activo: true },
    ]
  },
];

const notificaciones = [
  { id: 1, num: "PQR-482901", msg: "Tu reclamo está en proceso de solución", hora: "hace 2 h", nueva: true },
  { id: 2, num: "PQR-471234", msg: "Tu petición fue resuelta. ¡Revisa tu correo!", hora: "hace 3 días", nueva: false },
  { id: 3, num: "PQR-463500", msg: "Tu queja fue asignada a un agente", hora: "hace 1 día", nueva: true },
];

const estadoLabel = { radicado: "Radicado", en_revision: "En revisión", en_proceso: "En proceso", resuelto: "Resuelto", cerrado: "Cerrado" };

export default function EstadoPQR() {
  const [expandido, setExpandido] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notificaciones);

  const nuevasCount = notifs.filter(n => n.nueva).length;

  const filtrados = pqrData.filter(p =>
    p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.asunto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNotif = () => {
    setNotifOpen(true);
    setNotifs(prev => prev.map(n => ({ ...n, nueva: false })));
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="estado-wrap">
        <div className="estado-header">
          <div>
            <h1 className="estado-titulo">Mis PQR</h1>
            <p className="estado-sub">SEGUIMIENTO EN TIEMPO REAL</p>
          </div>
          <div className="notif-bell" onClick={abrirNotif}>
            <span className="notif-icon">🔔</span>
            {nuevasCount > 0 && <span className="notif-badge">{nuevasCount}</span>}
          </div>
        </div>

        <div className="buscar-wrap">
          <input
            className="buscar-input"
            placeholder="Buscar por número o asunto…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="pqr-list">
          {filtrados.map(pqr => (
            <div
              key={pqr.id}
              className={`pqr-item${expandido === pqr.id ? " expanded" : ""}`}
            >
              <div
                className="pqr-item-header"
                onClick={() => setExpandido(expandido === pqr.id ? null : pqr.id)}
              >
                <span className={`tipo-dot ${pqr.tipo}`} />
                <span className="pqr-num">{pqr.id}</span>
                <span className="pqr-asunto">{pqr.asunto}</span>
                <span className={`estado-chip ${pqr.estado}`}>{estadoLabel[pqr.estado]}</span>
                <span className="pqr-fecha">{pqr.fecha}</span>
              </div>

              {expandido === pqr.id && (
                <div className="pqr-timeline">
                  <div style={{ fontSize: "0.75rem", color: "#4a5a7a", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Historial de seguimiento
                  </div>
                  <div className="timeline-line">
                    {pqr.timeline.map((ev, i) => (
                      <div key={i} className="tl-event">
                        <div className={`tl-dot${ev.activo ? " active" : ""}`} />
                        <div className="tl-fecha">{ev.fecha}</div>
                        <div className="tl-desc">{ev.desc}</div>
                        {ev.resp && <div className="tl-resp">💬 {ev.resp}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Barra de progreso */}
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.25rem" }}>
                    {estadoOrder.map((s, i) => (
                      <div key={s} style={{
                        flex: 1, height: "3px", borderRadius: "2px",
                        background: estadoOrder.indexOf(pqr.estado) >= i ? "#4f8ef7" : "#1e2d4a",
                        transition: "background 0.3s"
                      }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem", fontSize: "0.65rem", color: "#2e3f5a", fontFamily: "'Space Mono',monospace" }}>
                    {estadoOrder.map(s => <span key={s}>{estadoLabel[s]}</span>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Panel de notificaciones */}
        {notifOpen && <div className="overlay" onClick={() => setNotifOpen(false)} />}
        <div className={`notif-panel${notifOpen ? " open" : ""}`}>
          <div className="notif-panel-title">
            Notificaciones
            <button className="notif-close" onClick={() => setNotifOpen(false)}>×</button>
          </div>
          {notifs.map(n => (
            <div key={n.id} className={`notif-card${n.nueva ? " nueva" : ""}`}>
              <div className="notif-card-asunto">{n.num}</div>
              <div className="notif-card-msg">{n.msg}</div>
              <div className="notif-card-hora">{n.hora}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
