import { useState } from "react";

const productos = [
  { id: 1, nombre: "El amor en los tiempos del cólera", precio: 32000, stock: 12, categoria: "Novela" },
  { id: 2, nombre: "Cien años de soledad", precio: 38000, stock: 8, categoria: "Novela" },
  { id: 3, nombre: "La hojarasca", precio: 25000, stock: 15, categoria: "Novela" },
  { id: 4, nombre: "Cuaderno de caligrafía", precio: 12000, stock: 30, categoria: "Papelería" },
  { id: 5, nombre: "Marcadores artísticos x6", precio: 18000, stock: 20, categoria: "Papelería" },
  { id: 6, nombre: "Agenda literaria 2026", precio: 22000, stock: 10, categoria: "Papelería" },
];

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .pkg-wrap { font-family: 'DM Sans', sans-serif; background: #0f0e0c; color: #e8e2d5; min-height: 100vh; padding: 2rem; }
  .pkg-header { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #c9a84c; margin-bottom: 0.3rem; }
  .pkg-sub { color: #7a7265; font-size: 0.9rem; margin-bottom: 2.5rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .pkg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media(max-width:700px){ .pkg-grid{ grid-template-columns:1fr; } }
  .pkg-section-title { font-family:'Playfair Display',serif; font-style:italic; font-size:1.1rem; color:#c9a84c; margin-bottom:1rem; }
  .prod-card { background:#1a1915; border:1px solid #2e2b25; border-radius:4px; padding:0.85rem 1rem; display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; cursor:pointer; transition:border-color 0.2s, background 0.2s; }
  .prod-card:hover { border-color:#c9a84c44; background:#201e18; }
  .prod-card.selected { border-color:#c9a84c; background:#1e1c14; }
  .prod-name { font-size:0.88rem; font-weight:500; }
  .prod-meta { font-size:0.75rem; color:#7a7265; margin-top:0.15rem; }
  .prod-precio { font-size:0.85rem; color:#c9a84c; font-weight:500; }
  .prod-stock-badge { font-size:0.7rem; padding:0.15rem 0.5rem; border-radius:20px; background:#2e2b25; color:#7a7265; margin-left:0.5rem; }
  .prod-stock-badge.low { background:#3a1e1e; color:#e07070; }
  .check-circle { width:18px; height:18px; border-radius:50%; border:2px solid #3a3730; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; margin-right:0.8rem; }
  .check-circle.checked { border-color:#c9a84c; background:#c9a84c; }
  .check-circle.checked::after { content:'✓'; color:#0f0e0c; font-size:10px; font-weight:700; }
  .panel-resumen { background:#131210; border:1px solid #2e2b25; border-radius:8px; padding:1.5rem; position:sticky; top:1rem; }
  .resumen-item { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid #1e1c18; }
  .resumen-item:last-child { border-bottom:none; }
  .resumen-item-name { font-size:0.82rem; color:#b0a890; }
  .resumen-item-price { font-size:0.82rem; color:#e8e2d5; }
  .descuento-row { display:flex; justify-content:space-between; padding:0.6rem 0; }
  .descuento-label { font-size:0.8rem; color:#7a7265; }
  .descuento-val { font-size:0.8rem; color:#6dbe8a; font-weight:500; }
  .total-row { display:flex; justify-content:space-between; padding:1rem 0 0.5rem; border-top:1px solid #2e2b25; margin-top:0.5rem; }
  .total-label { font-family:'Playfair Display',serif; font-size:1.1rem; color:#e8e2d5; }
  .total-val { font-family:'Playfair Display',serif; font-size:1.3rem; color:#c9a84c; }
  .pkg-nombre-input { width:100%; background:#1a1915; border:1px solid #2e2b25; border-radius:4px; color:#e8e2d5; font-family:'DM Sans',sans-serif; font-size:0.88rem; padding:0.6rem 0.9rem; outline:none; margin-bottom:1rem; box-sizing:border-box; transition:border-color 0.2s; }
  .pkg-nombre-input:focus { border-color:#c9a84c55; }
  .pkg-nombre-input::placeholder { color:#3a3730; }
  .descuento-slider-wrap { margin-bottom:1rem; }
  .descuento-slider-label { display:flex; justify-content:space-between; font-size:0.78rem; color:#7a7265; margin-bottom:0.4rem; }
  .descuento-slider-label span:last-child { color:#6dbe8a; font-weight:500; }
  input[type=range] { width:100%; accent-color:#c9a84c; }
  .btn-crear { width:100%; padding:0.85rem; background:#c9a84c; color:#0f0e0c; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.9rem; border:none; border-radius:4px; cursor:pointer; letter-spacing:0.05em; text-transform:uppercase; transition:opacity 0.2s; }
  .btn-crear:hover { opacity:0.88; }
  .btn-crear:disabled { opacity:0.3; cursor:not-allowed; }
  .paquetes-list { margin-top:2.5rem; }
  .pkg-card { background:#1a1915; border:1px solid #2e2b25; border-radius:6px; padding:1.2rem 1.5rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; }
  .pkg-card-info h4 { font-family:'Playfair Display',serif; font-size:1rem; margin:0 0 0.3rem; color:#e8e2d5; }
  .pkg-card-info p { font-size:0.78rem; color:#7a7265; margin:0; }
  .pkg-card-precio { text-align:right; }
  .pkg-card-precio .original { font-size:0.75rem; color:#7a7265; text-decoration:line-through; }
  .pkg-card-precio .especial { font-size:1.1rem; color:#c9a84c; font-weight:700; }
  .pkg-card-precio .badge-dto { font-size:0.7rem; background:#1a2e1a; color:#6dbe8a; padding:0.1rem 0.4rem; border-radius:3px; }
  .btn-vender { padding:0.4rem 1rem; border:1px solid #c9a84c44; background:transparent; color:#c9a84c; font-size:0.78rem; border-radius:3px; cursor:pointer; margin-top:0.5rem; transition:background 0.2s; }
  .btn-vender:hover { background:#c9a84c18; }
  .toast { position:fixed; bottom:2rem; right:2rem; background:#1e2e1e; border:1px solid #3a5a3a; color:#6dbe8a; padding:0.8rem 1.4rem; border-radius:6px; font-size:0.85rem; animation:slideIn 0.3s ease; z-index:100; }
  @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  .empty-state { text-align:center; padding:3rem 1rem; color:#3a3730; font-style:italic; font-family:'Playfair Display',serif; font-size:1rem; }
`;

export default function PaquetesCombinados() {
  const [seleccionados, setSeleccionados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descuento, setDescuento] = useState(10);
  const [paquetes, setPaquetes] = useState([]);
  const [stock, setStock] = useState(Object.fromEntries(productos.map(p => [p.id, p.stock])));
  const [toast, setToast] = useState(null);

  const toggleProducto = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const totalOriginal = seleccionados.reduce((sum, id) => {
    const p = productos.find(x => x.id === id);
    return sum + (p ? p.precio : 0);
  }, 0);

  const totalEspecial = Math.round(totalOriginal * (1 - descuento / 100));

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const crearPaquete = () => {
    if (!nombre.trim() || seleccionados.length < 2) return;
    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      productos: seleccionados.map(id => productos.find(p => p.id === id)),
      descuento,
      totalOriginal,
      totalEspecial,
    };
    setPaquetes(prev => [nuevo, ...prev]);
    setSeleccionados([]);
    setNombre("");
    setDescuento(10);
    mostrarToast(`Paquete "${nuevo.nombre}" creado exitosamente`);
  };

  const venderPaquete = (pkg) => {
    const stockInsuficiente = pkg.productos.some(p => stock[p.id] < 1);
    if (stockInsuficiente) {
      mostrarToast("⚠ Sin stock suficiente para uno de los productos");
      return;
    }
    setStock(prev => {
      const nuevo = { ...prev };
      pkg.productos.forEach(p => { nuevo[p.id] = Math.max(0, nuevo[p.id] - 1); });
      return nuevo;
    });
    mostrarToast(`✓ Venta registrada — stock actualizado`);
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="pkg-wrap">
        <h1 className="pkg-header">Paquetes Combinados</h1>
        <p className="pkg-sub">Crea ofertas especiales · Stock se actualiza automáticamente</p>

        <div className="pkg-grid">
          {/* Columna izquierda: selección */}
          <div>
            <p className="pkg-section-title">Selecciona los productos</p>
            {productos.map(p => (
              <div
                key={p.id}
                className={`prod-card${seleccionados.includes(p.id) ? " selected" : ""}`}
                onClick={() => toggleProducto(p.id)}
              >
                <div className={`check-circle${seleccionados.includes(p.id) ? " checked" : ""}`} />
                <div style={{ flex: 1 }}>
                  <div className="prod-name">{p.nombre}</div>
                  <div className="prod-meta">{p.categoria}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="prod-precio">${p.precio.toLocaleString("es-CO")}</span>
                  <span className={`prod-stock-badge${stock[p.id] < 5 ? " low" : ""}`}>
                    {stock[p.id]} uds.
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Columna derecha: resumen y configuración */}
          <div>
            <p className="pkg-section-title">Configura el paquete</p>
            <div className="panel-resumen">
              <input
                className="pkg-nombre-input"
                placeholder="Nombre del paquete…"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <div className="descuento-slider-wrap">
                <div className="descuento-slider-label">
                  <span>Descuento especial</span>
                  <span>{descuento}% OFF</span>
                </div>
                <input
                  type="range" min={5} max={40} step={5}
                  value={descuento}
                  onChange={e => setDescuento(Number(e.target.value))}
                />
              </div>

              {seleccionados.length === 0 ? (
                <div className="empty-state">Selecciona al menos 2 productos</div>
              ) : (
                <>
                  {seleccionados.map(id => {
                    const p = productos.find(x => x.id === id);
                    return (
                      <div key={id} className="resumen-item">
                        <span className="resumen-item-name">{p.nombre}</span>
                        <span className="resumen-item-price">${p.precio.toLocaleString("es-CO")}</span>
                      </div>
                    );
                  })}
                  <div className="descuento-row">
                    <span className="descuento-label">Descuento ({descuento}%)</span>
                    <span className="descuento-val">− ${(totalOriginal - totalEspecial).toLocaleString("es-CO")}</span>
                  </div>
                  <div className="total-row">
                    <span className="total-label">Total paquete</span>
                    <span className="total-val">${totalEspecial.toLocaleString("es-CO")}</span>
                  </div>
                </>
              )}

              <button
                className="btn-crear"
                disabled={seleccionados.length < 2 || !nombre.trim()}
                onClick={crearPaquete}
                style={{ marginTop: "1rem" }}
              >
                Crear paquete
              </button>
            </div>
          </div>
        </div>

        {/* Lista de paquetes creados */}
        {paquetes.length > 0 && (
          <div className="paquetes-list">
            <p className="pkg-section-title" style={{ marginTop: "2rem" }}>Paquetes activos</p>
            {paquetes.map(pkg => (
              <div key={pkg.id} className="pkg-card">
                <div className="pkg-card-info">
                  <h4>{pkg.nombre}</h4>
                  <p>{pkg.productos.map(p => p.nombre).join(" · ")}</p>
                </div>
                <div className="pkg-card-precio">
                  <div className="original">${pkg.totalOriginal.toLocaleString("es-CO")}</div>
                  <div className="especial">${pkg.totalEspecial.toLocaleString("es-CO")}</div>
                  <span className="badge-dto">{pkg.descuento}% OFF</span>
                  <br />
                  <button className="btn-vender" onClick={() => venderPaquete(pkg)}>
                    Registrar venta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
