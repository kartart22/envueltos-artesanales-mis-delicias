import React, { useState, useEffect } from 'react';

export default function Login() {
  // --- ESTADOS DE FLUJO Y SEGURIDAD (Login) ---
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Catálogo/Dashboard
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(300); 
  const [errorMessage, setErrorMessage] = useState('');

  // --- NUEVO: DATOS SIMULADOS DEL CATÁLOGO Y STOCK (REQUERIMIENTOS NUEVOS) ---
  const [products, setProducts] = useState([
    { id: 1, name: 'Envuelto de Maíz Dulce', price: 3500, stock: 4, limit: 5, status: 'Disponible', dateRestock: '' },
    { id: 2, name: 'Envuelto de Tres Quesos', price: 4500, stock: 12, limit: 5, status: 'Disponible', dateRestock: '' },
    { id: 3, name: 'Envuelto de Bocadillo y Queso', price: 4000, stock: 0, limit: 3, status: 'Agotado temporalmente', dateRestock: '05/06/2026' },
  ]);

  // Alertas automáticas de Stock Bajo
  const [stockAlerts, setStockAlerts] = useState([]);

  // Monitorear stock bajo automáticamente
  useEffect(() => {
    if (step === 3) {
      const alerts = products.filter(p => p.stock > 0 && p.stock <= p.limit);
      setStockAlerts(alerts);
    }
  }, [products, step]);

  // Temporizadores de Bloqueo y OTP
  useEffect(() => {
    let interval;
    if (isBlocked && blockTimer > 0) {
      interval = setInterval(() => setBlockTimer((prev) => prev - 1), 1000);
    } else if (blockTimer === 0 && isBlocked) {
      setIsBlocked(false);
      setFailedAttempts(0);
      setErrorMessage('');
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimer]);

  useEffect(() => {
    let interval;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    } else if (otpTimer === 0) {
      setErrorMessage('El código OTP ha expirado.');
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (isBlocked) return;
    setOtpTimer(300);
    setStep(2);
    setErrorMessage('');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (isBlocked) return;

    const MOCK_CORRECT_OTP = "123456"; 

    if (otpCode === MOCK_CORRECT_OTP) {
      setStep(3);
      setErrorMessage('');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setIsBlocked(true);
        setBlockTimer(300); 
        setErrorMessage('Seguridad: 3 intentos fallidos. Cuenta bloqueada temporalmente.');
      } else {
        setErrorMessage(`Código incorrecto. Intento ${nextAttempts} de 3.`);
      }
    }
  };

  // Simulación para vender un producto y bajar stock
  const comprarProducto = (id) => {
    setProducts(products.map(p => {
      if (p.id === id && p.stock > 0) {
        return { ...p, stock: p.stock - 1 };
      }
      return p;
    }));
  };

  return (
    <div style={{ background: '#111827', minHeight: '100vh', color: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#1f2937', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: step === 3 ? '700px' : '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', transition: 'max-width 0.3s' }}>
        
        {step < 3 ? (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Portal de Clientes</h2>
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Registro rápido vía SMS</p>

            {errorMessage && (
              <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {/* STEP 1: Teléfono */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '5px' }}>NÚMERO DE CELULAR</label>
                  <input type="tel" required disabled={isBlocked} placeholder="Ej: 3001234567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4b5563', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#9ca3af', cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isBlocked} />
                  Recordarme en este equipo privado
                </label>
                {isBlocked ? (
                  <div style={{ background: '#dc2626', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>
                    INTERFAZ BLOQUEADA — {formatTime(blockTimer)}
                  </div>
                ) : (
                  <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Solicitar Código SMS</button>
                )}
              </form>
            )}

            {/* STEP 2: Código OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                  <span>INGRESA CÓDIGO SMS</span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Expira: {formatTime(otpTimer)}</span>
                </div>
                <input type="text" maxLength={6} required placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4b5563', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '20px', letterSpacing: '4px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Verificar Cuenta</button>
              </form>
            )}
          </>
        ) : (
          /* STEP 3: Panel del Catálogo de Envueltos */
          <div>
            <h2 style={{ textAlign: 'center', color: '#10b981', marginBottom: '20px' }}>✓ ¡Bienvenido al Sistema de Envueltos!</h2>

            {/* Notificaciones Automáticas de Gestión de Reposiciones */}
            {stockAlerts.length > 0 && (
              <div style={{ background: '#7c2d12', border: '1px solid #ea580c', color: '#ffedd5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>⚠️ Alertas Críticas para Administrador (Reposición):</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                  {stockAlerts.map(a => (
                    <li key={a.id}>El producto <strong>{a.name}</strong> bajó del límite configurado ({a.limit} uds). Stock actual: <strong>{a.stock}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            <h3 style={{ borderBottom: '1px solid #4b5563', paddingBottom: '10px' }}>Catálogo Oficial de Productos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {products.map(product => (
                <div key={product.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product.name}</h4>
                    <span style={{ fontSize: '14px', color: '#34d399', fontWeight: 'bold' }}>${product.price} COP</span>
                    
                    {/* Renderizado heurístico de productos agotados temporales */}
                    {product.stock === 0 ? (
                      <div style={{ marginTop: '5px', fontSize: '12px', color: '#f87171', fontWeight: 'bold' }}>
                        ❌ Agotado temporalmente • Reabastecimiento estimado: {product.dateRestock}
                      </div>
                    ) : (
                      <div style={{ marginTop: '5px', fontSize: '12px', color: '#9ca3af' }}>
                        Stock disponible: {product.stock} unidades
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => comprarProducto(product.id)} 
                    disabled={product.stock === 0} 
                    style={{ padding: '8px 15px', background: product.stock === 0 ? '#4b5563' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Simular Venta'}
                  </button>
                </div>
              ))}
            </div>
            
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '10px', background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', marginTop: '20px', cursor: 'pointer' }}>Salir de la simulación</button>
          </div>
        )}

      </div>
    </div>
  );
}