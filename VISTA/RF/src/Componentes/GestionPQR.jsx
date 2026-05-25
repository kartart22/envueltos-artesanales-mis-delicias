import { useState, useMemo } from "react";

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  .mgr-wrap { font-family:'IBM Plex Sans',sans-serif; background:#f7f5f0; min-height:100vh; }
  .mgr-sidebar { width:220px; background:#1c1c1c; position:fixed; top:0; left:0; height:100vh; padding:1.5rem 1rem; }
  .mgr-sidebar-logo { font-family:'IBM Plex Mono',monospace; font-size:0.8rem; color:#5a5a5a; margin-bottom:2rem; letter-spacing:0.08em; text-transform:uppercase; }
  .mgr-sidebar-logo strong { color:#f0e6c8; display:block; font-size:1rem; margin-bottom:0.1rem; }
  .sidebar-stat { padding:0.8rem; background:#2a2a2a; border-radius:6px; margin-bottom:0.5rem; }
  .sidebar-stat-num { font-family:'IBM Plex Mono',monospace; font-size:1.4rem; color:#f0e6c8; font-weight:500; }
  .sidebar-stat-label { font-size:0.72rem; color:#5a5a5a; margin-top:0.1rem; text-transform:uppercase; letter-spacing:0.05em; }
  .sidebar-stat.urgente .sidebar-stat-num { color:#e07070; }
  .mgr-main { margin-left:220px; padding:2rem; }
  .mgr-topbar { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .mgr-title { font-size:1.4rem; font-weight:600; color:#1c1c1c; margin-right:auto; }
  .filter-pill { padding:0.4rem 0.9rem; border-radius:20px; border:1.5px solid #d8d3c8; background:#fff; cursor:pointer; font-size:0.78rem; color:#5a5050; transition:all 0.15s; font-family:'IBM Plex Sans',sans-serif; }
  .filter-pill:hover { border-color:#9a8a6a; color:#2a2a2a; }
  .filter-pill.active { background:#1c1c1c; border-color:#1c1c1c; color:#f0e6c8; }
  .filter-select { padding:0.4rem 0.75rem; border-radius:6px; border:1.5px solid #d8d3c8; background:#fff; font-family:'IBM Plex Sans',sans-serif; font-size:0.78rem; color:#3a3330; outline:none; cursor:pointer; }
  .filter-select:focus { border-color:#9a8a6a; }
  .mgr-table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 10px #00000008; }
  .mgr-table th { background:#f0ece3; font-size:0.72rem; font-weight:600; color:#7a7060; text-transform:uppercase; letter-spacing:0.07em; padding:0.75rem 1rem; text-align:left; border-bottom:1px solid #e0dbd0; }
  .mgr-table td { padding:0.85rem 1rem; border-bottom:1px solid #f0ece3; font-size:0.85rem; vertical-align:middle; }
  .mgr-table tr:last-child td { border-bottom:none; }
  .mgr-table tr:hover td { background:#faf8f3; }
  .tipo-tag { display:inline-block; padding:0.2rem 0.6rem; border-radius:3px; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
  .tipo-tag.queja { background:#fde8e8; color:#c04040; }
  .tipo-tag.peticion { background:#e8eefe; color:#3050c0; }
  .tipo-tag.reclamo { background:#fef3e8; color:#b05010; }
  .estado-dot { display:inline-flex; align-items:center; gap:0.4rem; font-size:0.78rem; color:#4a4440; }
  .estado-dot::before { content:''; display:inline-block; width:7px; height:7px; border-radius:50%; }
  .estado-dot.radicado::before { background:#9ab0d8; }
  .estado-dot.en_revision::before { background:#d8c060; }
  .estado-dot.en_proceso::before { background:#60b870; }
  .estado-dot.resuelto::before { background:#50a050; }
  .estado-dot.cerrado::before { background:#aaa; }
  .asignar-select { padding:0.3rem 0.6rem; border:1px solid #d8d3c8; border-radius:4px; font-family:'IBM Plex Sans',sans-serif; font-size:0.78rem; background:#faf8f3; color:#3a3330; outline:none; cursor:pointer; min-width:130px; }
  .asignar-select:focus { border-color:#9a8a6a; }
  .asignar-select.asignado { background:#f0ece3; font-weight:500; color:#1c1c1c; }
  .pqr-num-mono { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:#8a8070; }
  .fecha-mono { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:#8a8070; }
  .sort-btn { background:none; border:none; cursor:pointer; color:#9a8a6a; font-size:0.8rem; padding:0 0.2rem; }
  .sort-btn:hover { color:#1c1c1c; }
  .search-input { padding:0.42rem 0.85rem; border:1.5px solid #d8d3c8; border-radius:6px; font-family:'IBM Plex Sans',sans-serif; font-size:0.82rem; background:#fff; color:#2a2a2a; outline:none; min-width:200px; }
  .search-input:focus { border-color:#9a8a6a; }
  .empty-msg { text-align:center; padding:3rem; color:#b0a898; font-style:italic; }
  .btn-detalle { padding:0.28rem 0.7rem; border:1px solid #d8d3c8; background:transparent; border-radius:4px; font-size:0.72rem; color:#5a5050; cursor:pointer; font-family:'IBM Plex Sans',sans-serif; transition:all 0.15s; }
  .btn-detalle:hover { background:#1c1c1c; color:#f0e6c8; border-color:#1c1c1c; }
  .toast-mgr { position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%); background:#1c1c1c; color:#f0e6c8; padding:0.7rem 1.5rem; border-radius:6px; font-size:0.82rem; z-index:100; animation:fadeIn 0.25s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }
`;

const equipo = ["Sin asignar", "Ana García", "Carlos Mendoza", "Laura Torres", "Miguel Ríos"];
const estadoLabel = { radicado: "Radicado", en_revision: "En revisión", en_proceso: "En proceso", resuelto: "Resuelto", cerrado: "Cerrado" };

const inicial = [
  { id: "PQR-482901", tipo: "reclamo", asunto: "Pedido llegó con libro equivocado", estado: "en_proceso", fecha: "2026-05-19", asignado: "Carlos Mendoza" },
  { id: "PQR-471234", tipo: "peticion", asunto: "Solicitud de catálogo mayo", estado: "resuelto", fecha: "2026-05-12", asignado: "Ana García" },
  { id: "PQR-463500", tipo: "queja", asunto: "Atención en tienda deficiente", estado: "en_revision", fecha: "2026-05-22", asignado: "Sin asignar" },
  { id: "PQR-459020", tipo: "queja", asunto: "Demora excesiva en respuesta de soporte", estado: "radicado", fecha: "2026-05-23", asignado: "Sin asignar" },
  { id: "PQR-450118", tipo: "reclamo", asunto: "Cobro doble en la misma compra", estado: "en_revision", fecha: "2026-05-20", asignado: "Laura Torres" },
  { id: "PQR-441007", tipo: "peticion", asunto: "Solicitud de factura electrónica", estado: "cerrado", fecha: "2026-05-10", asignado: "Miguel Ríos" },
  { id: "PQR-438800", tipo: "queja", asunto: "Libro llegó con páginas deterioradas", estado: "en_proceso", fecha: "2026-05-21", asignado: "Carlos Mendoza" },
];

export default function GestionPQR() {
  const [pqrs, setPqrs] = useState(inicial);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("desc");
  const [toast, setToast] = useState(null);

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const asignar = (id, persona) => {
    setPqrs(prev => prev.map(p => p.id === id ? { ...p, asignado: persona } : p));
    if (persona !== "Sin asignar") mostrarToast(`${id} asignado a ${persona}`);
  };

  const filtrados = useMemo(() => {
    let lista = [...pqrs];
    if (filtroTipo !== "todos") lista = lista.filter(p => p.tipo === filtroTipo);
    if (filtroEstado !== "todos") lista = lista.filter(p => p.estado === filtroEstado);
    if (busqueda.trim()) lista = lista.filter(p =>
      p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.asunto.toLowerCase().includes(busqueda.toLowerCase())
    );
    lista.sort((a, b) => ordenFecha === "desc"
      ? b.fecha.localeCompare(a.fecha) : a.fecha.localeCompare(b.fecha)
    );
    return lista;
  }, [pqrs, filtroTipo, filtroEstado, busqueda, ordenFecha]);

  const stats = {
    total: pqrs.length,
    sinAsignar: pqrs.filter(p => p.asignado === "Sin asignar").length,
    urgentes: pqrs.filter(p => ["radicado", "en_revision"].includes(p.estado)).length,
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="mgr-wrap">
        {/* Sidebar */}
        <div className="mgr-sidebar">
          <div className="mgr-sidebar-logo">
            <strong>Librería Cultural</strong>
            Panel gerente
          </div>
          <div className="sidebar-stat">
            <div className="sidebar-stat-num">{stats.total}</div>
            <div className="sidebar-stat-label">Total PQR</div>
          </div>
          <div className="sidebar-stat urgente">
            <div className="sidebar-stat-num">{stats.urgentes}</div>
            <div className="sidebar-stat-label">Pendientes</div>
          </div>
          <div className="sidebar-stat">
            <div className="sidebar-stat-num">{stats.sinAsignar}</div>
            <div className="sidebar-stat-label">Sin asignar</div>
          </div>
        </div>

        {/* Main */}
        <div className="mgr-main">
          <div className="mgr-topbar">
            <span className="mgr-title">Gestión de PQR</span>
            <input
              className="search-input"
              placeholder="Buscar PQR…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {["todos", "queja", "peticion", "reclamo"].map(t => (
              <button
                key={t}
                className={`filter-pill${filtroTipo === t ? " active" : ""}`}
                onClick={() => setFiltroTipo(t)}
              >
                {t === "todos" ? "Todos los tipos" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <div style={{ width: "1px", height: "24px", background: "#d8d3c8", margin: "0 0.25rem" }} />
            <select className="filter-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="todos">Todos los estados</option>
              {Object.entries(estadoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* Tabla */}
          <table className="mgr-table">
            <thead>
              <tr>
                <th>N° PQR</th>
                <th>Tipo</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>
                  Fecha
                  <button className="sort-btn" onClick={() => setOrdenFecha(o => o === "desc" ? "asc" : "desc")}>
                    {ordenFecha === "desc" ? "↓" : "↑"}
                  </button>
                </th>
                <th>Asignado a</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} className="empty-msg">No hay PQR que coincidan con los filtros</td></tr>
              ) : filtrados.map(pqr => (
                <tr key={pqr.id}>
                  <td><span className="pqr-num-mono">{pqr.id}</span></td>
                  <td><span className={`tipo-tag ${pqr.tipo}`}>{pqr.tipo}</span></td>
                  <td style={{ maxWidth: "200px" }}>{pqr.asunto}</td>
                  <td><span className={`estado-dot ${pqr.estado}`}>{estadoLabel[pqr.estado]}</span></td>
                  <td><span className="fecha-mono">{pqr.fecha.split("-").reverse().join("/")}</span></td>
                  <td>
                    <select
                      className={`asignar-select${pqr.asignado !== "Sin asignar" ? " asignado" : ""}`}
                      value={pqr.asignado}
                      onChange={e => asignar(pqr.id, e.target.value)}
                    >
                      {equipo.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn-detalle">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#9a9080", fontFamily: "'IBM Plex Mono',monospace" }}>
            {filtrados.length} de {pqrs.length} registros
          </div>
        </div>

        {toast && <div className="toast-mgr">{toast}</div>}
      </div>
    </>
  );
}
