'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydqmwtwyiuogthqyxthj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW13dHd5aXVvZ3RocXl4dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTgxNTYsImV4cCI6MjA5OTk3NDE1Nn0.SbCzxMDdSr-_3iLCBxIsw8t-ZdCiN2FwVYNoAEo9L6k';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  img: string;
  stock: number;
  categoria?: string;
}

interface Cita {
  id: number;
  nombre_cliente: string;
  telefono?: string;
  servicio: string;
  barbero: string;
  fecha: string;
  hora: string;
  estado: string;
}

interface Transaccion {
  id: number;
  tipo: 'ingreso' | 'gasto';
  concepto: string;
  monto: number;
  fecha: string;
}

interface Membresia {
  id: number;
  nombre_cliente: string;
  telefono: string;
  plan: string;
  metodo_pago?: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: string;
}

export default function AdminPage() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // Credenciales protegidas exclusivas
  const USUARIO_ADMIN = 'otroflow';
  const PASSWORD_ADMIN = 'barberia2026';

  const [productos, setProductos] = useState<Producto[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  
  // Fotos de la web
  const [imgHero, setImgHero] = useState<string>('');
  const [imgBarbero, setImgBarbero] = useState<string>('');
  const [galeriaImgs, setGaleriaImgs] = useState<string[]>([]);
  const [cargandoImagen, setCargandoImagen] = useState(false);

  // Formularios Productos & Finanzas
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');
  const [nuevaImg, setNuevaImg] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Fragancias');
  const [cargando, setCargando] = useState(false);

  const [ingresoManual, setIngresoManual] = useState('');
  const [conceptoIngreso, setConceptoIngreso] = useState('');

  const [gastoManual, setGastoManual] = useState('');
  const [conceptoGasto, setConceptoGasto] = useState('');

  // Formulario VIP / Modal
  const [modalVIPOpen, setModalVIPOpen] = useState(false);
  const [vipNombre, setVipNombre] = useState('');
  const [vipTelefono, setVipTelefono] = useState('');
  const [vipPlan, setVipPlan] = useState('PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)');
  const [vipFechaInicio, setVipFechaInicio] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('admin_otro_flow');
    if (sesionGuardada === 'true') {
      setEstaAutenticado(true);
    }
    setCargandoAuth(false);
  }, []);

  useEffect(() => {
    if (estaAutenticado) {
      fetchDatosAdmin();
    }
  }, [estaAutenticado]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioInput.trim() === USUARIO_ADMIN && passwordInput === PASSWORD_ADMIN) {
      setEstaAutenticado(true);
      localStorage.setItem('admin_otro_flow', 'true');
    } else {
      alert('Usuario o contraseña incorrectos ❌. Acceso denegado.');
    }
  };

  const handleLogout = () => {
    setEstaAutenticado(false);
    localStorage.removeItem('admin_otro_flow');
    setUsuarioInput('');
    setPasswordInput('');
  };

  const fetchDatosAdmin = async () => {
    const { data: prodData } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(prodData || []);

    const { data: citaData } = await supabase.from('citas').select('*').order('id', { ascending: false });
    setCitas(citaData || []);

    const { data: finData } = await supabase.from('finanzas').select('*').order('id', { ascending: false });
    setTransacciones(finData || []);

    const { data: membData } = await supabase.from('membresias').select('*').order('id', { ascending: false });
    setMembresias(membData || []);

    // Cargar fotos guardadas
    const { data: configData } = await supabase.from('configuracion').select('*');
    if (configData) {
      configData.forEach(item => {
        if (item.clave === 'img_hero') setImgHero(item.valor);
        if (item.clave === 'img_barbero') setImgBarbero(item.valor);
        if (item.clave === 'galeria') {
          try { setGaleriaImgs(JSON.parse(item.valor)); } catch (e) { setGaleriaImgs([]); }
        }
      });
    }
  };

  // --- LÓGICA MEMBRESÍAS VIP ---
  const obtenerEstadoPago = (fechaVencimientoStr: string) => {
    if (!fechaVencimientoStr) return { texto: 'Sin Fecha', color: 'bg-zinc-800 text-zinc-400', dias: 0 };

    let isoDateStr = fechaVencimientoStr;
    const fechaPartes = fechaVencimientoStr.split('/');
    if (fechaPartes.length === 3) {
      isoDateStr = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(isoDateStr);
    vencimiento.setHours(0, 0, 0, 0);

    const diferenciaMs = vencimiento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 3600 * 24));

    if (diasRestantes < 0) {
      return { texto: `Vencido (${Math.abs(diasRestantes)}d)`, color: 'bg-red-500/20 text-red-400 border border-red-500/40', dias: diasRestantes };
    } else if (diasRestantes <= 5) {
      return { texto: `Cobra Hoy / ${diasRestantes}d`, color: 'bg-amber-500/20 text-amber-400 border border-amber-500/40', dias: diasRestantes };
    } else {
      return { texto: `Al Día (${diasRestantes}d)`, color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40', dias: diasRestantes };
    }
  };

  const handleGuardarNuevoVIP = async (e: React.FormEvent) => {
    e.preventDefault();
    const inicio = new Date(vipFechaInicio);
    const vencimiento = new Date(inicio);
    vencimiento.setDate(vencimiento.getDate() + 30);

    const inicioFmt = inicio.toISOString().split('T')[0];
    const vencimientoFmt = vencimiento.toISOString().split('T')[0];

    const { error } = await supabase.from('membresias').insert([
      {
        nombre_cliente: vipNombre,
        telefono: vipTelefono,
        plan: vipPlan,
        metodo_pago: 'Efectivo / Presencial',
        fecha_inicio: inicioFmt,
        fecha_vencimiento: vencimientoFmt,
        estado: 'Activo'
      }
    ]);

    if (!error) {
      setModalVIPOpen(false);
      setVipNombre('');
      setVipTelefono('');
      fetchDatosAdmin();
    } else {
      alert('Error guardando socio VIP: ' + error.message);
    }
  };

  const handleRenovarMembresia = async (vip: Membresia) => {
    if (!confirm(`¿Confirmar cobro de mensualidad para ${vip.nombre_cliente}? Se renovará por 30 días.`)) return;

    const hoy = new Date();
    const nuevoVencimiento = new Date(hoy);
    nuevoVencimiento.setDate(nuevoVencimiento.getDate() + 30);

    const inicioFmt = hoy.toISOString().split('T')[0];
    const vencimientoFmt = nuevoVencimiento.toISOString().split('T')[0];

    const { error } = await supabase
      .from('membresias')
      .update({
        fecha_inicio: inicioFmt,
        fecha_vencimiento: vencimientoFmt,
        estado: 'Activo'
      })
      .eq('id', vip.id);

    if (!error) {
      alert(`✅ ¡Mensualidad renovada para ${vip.nombre_cliente}! Próximo pago: ${vencimientoFmt}`);
      fetchDatosAdmin();
    } else {
      alert('Error al renovar: ' + error.message);
    }
  };

  const handleEnviarRecordatorioVIPWA = (vip: Membresia) => {
    const estado = obtenerEstadoPago(vip.fecha_vencimiento);
    let msg = '';

    if (estado.dias < 0) {
      msg = `Hola *${vip.nombre_cliente}*, te saludamos de *OTRO FLOW BARBERSHOP* 💈.%0A%0ATe recordamos que tu suscripción VIP (*${vip.plan}*) venció el *${vip.fecha_vencimiento}*.%0A%0APor favor indícanos si realizas transferencia o si pasas por el local para mantener tus turnos y beneficios activos.%0A%0A¡Quedamos atentos bro! 🔥`;
    } else {
      msg = `Hola *${vip.nombre_cliente}*, te saludamos de *OTRO FLOW BARBERSHOP* 💈.%0A%0ATe escribimos para recordarte que tu cuota del *${vip.plan}* vence pronto (*${vip.fecha_vencimiento}*).%0A%0APuedes realizar tu transferencia para renovar tu mes y mantener tu atención preferencial. ¡Gracias por ser socio VIP! 🚀`;
    }

    const telLimpio = vip.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${telLimpio}?text=${msg}`, '_blank');
  };

  const handleEliminarMembresia = async (id: number) => {
    if (confirm('¿Eliminar esta membresía VIP?')) {
      await supabase.from('membresias').delete().eq('id', id);
      fetchDatosAdmin();
    }
  };

  // --- SUBIR Y CAMBIAR IMÁGENES ---
  const handleSubirFoto = (e: React.ChangeEvent<HTMLInputElement>, clave: string, indexGaleria?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('La imagen es muy pesada. Selecciona una imagen menor a 4MB.');
      return;
    }

    setCargandoImagen(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const urlFinal = reader.result as string;
      let errorResult: any = null;

      if (clave === 'img_hero') {
        setImgHero(urlFinal);
        localStorage.setItem('fotoHeroPrincipal', urlFinal);
        const { error } = await supabase.from('configuracion').upsert({ clave: 'img_hero', valor: urlFinal }, { onConflict: 'clave' });
        errorResult = error;
      } else if (clave === 'img_barbero') {
        setImgBarbero(urlFinal);
        localStorage.setItem('fotoBarberPerfil', urlFinal);
        const { error } = await supabase.from('configuracion').upsert({ clave: 'img_barbero', valor: urlFinal }, { onConflict: 'clave' });
        errorResult = error;
      } else if (clave === 'galeria') {
        let nuevaGaleria = [...galeriaImgs];
        if (typeof indexGaleria === 'number') {
          nuevaGaleria[indexGaleria] = urlFinal;
        } else {
          nuevaGaleria.push(urlFinal);
        }
        setGaleriaImgs(nuevaGaleria);
        localStorage.setItem('galeriaVIP', JSON.stringify(nuevaGaleria));
        const { error } = await supabase.from('configuracion').upsert({ clave: 'galeria', valor: JSON.stringify(nuevaGaleria) }, { onConflict: 'clave' });
        errorResult = error;
      }

      setCargandoImagen(false);

      if (errorResult) {
        alert('Error al guardar en Supabase: ' + errorResult.message);
      } else {
        alert('¡Foto guardada correctamente en la base de datos! 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const eliminarFotoGaleria = async (index: number) => {
    const nuevaGaleria = galeriaImgs.filter((_, i) => i !== index);
    setGaleriaImgs(nuevaGaleria);
    await supabase.from('configuracion').upsert({ clave: 'galeria', valor: JSON.stringify(nuevaGaleria) }, { onConflict: 'clave' });
  };

  // --- PRODUCTOS ---
  const actualizarStock = async (id: number, stockActual: number, cambio: number) => {
    const nuevoStockVal = Math.max(0, stockActual + cambio);
    const { error } = await supabase.from('productos').update({ stock: nuevoStockVal }).eq('id', id);
    if (!error) {
      setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStockVal } : p));
    }
  };

  const handleCrearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio || !nuevoStock) return;

    setCargando(true);
    const precioLimpio = nuevoPrecio.replace('%', '$');

    const { error } = await supabase.from('productos').insert([
      {
        nombre: nuevoNombre,
        precio: precioLimpio,
        stock: parseInt(nuevoStock),
        img: nuevaImg || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&auto=format&fit=crop&q=60',
        categoria: nuevaCategoria
      }
    ]);

    setCargando(false);
    if (!error) {
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoStock('');
      setNuevaImg('');
      fetchDatosAdmin();
    } else {
      alert('Error al crear producto: ' + error.message);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (!error) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  // --- CITAS Y WHATSAPP ---
  const cambiarEstadoCita = async (id: number, nuevoEstado: string) => {
    const { error } = await supabase.from('citas').update({ estado: nuevoEstado }).eq('id', id);
    if (!error) {
      setCitas(citas.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    }
  };

  const enviarWhatsApp = (cita: Cita) => {
    if (!cita.telefono) {
      alert('Este cliente no tiene un número de teléfono registrado.');
      return;
    }
    const telefonoLimpiado = cita.telefono.replace(/\D/g, '');
    const mensaje = `¡Hola ${cita.nombre_cliente}! Te recordamos tu cita para el servicio de *${cita.servicio}* hoy a las *${cita.hora}* en Otro Flow 💈✨. ¡Te esperamos!`;
    const url = `https://wa.me/${telefonoLimpiado}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // --- FINANZAS ---
  const registrarTransaccion = async (e: React.FormEvent, tipo: 'ingreso' | 'gasto') => {
    e.preventDefault();
    const concepto = tipo === 'ingreso' ? conceptoIngreso : conceptoGasto;
    const montoStr = tipo === 'ingreso' ? ingresoManual : gastoManual;

    if (!concepto || !montoStr) return;

    const nuevaTrans = {
      tipo,
      concepto,
      monto: parseFloat(montoStr) || 0,
      fecha: new Date().toLocaleDateString()
    };

    const { data, error } = await supabase.from('finanzas').insert([nuevaTrans]).select();
    if (!error && data) {
      setTransacciones([data[0], ...transacciones]);
      if (tipo === 'ingreso') {
        setConceptoIngreso('');
        setIngresoManual('');
      } else {
        setConceptoGasto('');
        setGastoManual('');
      }
    } else if (error) {
      alert('Error al registrar transacción: ' + error.message);
    }
  };

  const eliminarTransaccion = async (id: number) => {
    const { error } = await supabase.from('finanzas').delete().eq('id', id);
    if (!error) {
      setTransacciones(transacciones.filter(t => t.id !== id));
    }
  };

  // Cálculos
  const productosAgotados = productos.filter(p => p.stock <= 0).length;
  const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((acc, curr) => acc + curr.monto, 0);
  const totalGastos = transacciones.filter(t => t.tipo === 'gasto').reduce((acc, curr) => acc + curr.monto, 0);
  const gananciaNeta = totalIngresos - totalGastos;

  if (cargandoAuth) {
    return <div className="min-h-screen bg-[#070708] text-white flex items-center justify-center">Verificando seguridad...</div>;
  }

  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex items-center justify-center p-6 selection:bg-amber-500 selection:text-black">
        <div className="bg-neutral-900/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl max-w-md w-full space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Zona Privada y Restringida
            </span>
            <h1 className="text-2xl font-black mt-2 tracking-tight">Otro Flow - Acceso Admin</h1>
            <p className="text-zinc-400 text-xs">Introduce tu usuario y contraseña secreta para entrar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Usuario</label>
              <input 
                type="text" 
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-400 outline-none"
                required 
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Contraseña</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-400 outline-none"
                required 
              />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20">
              Desbloquear Panel 🔓
            </button>
          </form>
          <div className="text-center pt-2">
            <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-all">← Volver a la web pública</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-white p-6 md:p-12 max-w-5xl mx-auto space-y-10 selection:bg-amber-500 selection:text-black">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Panel de Control Pro (Seguro)
          </span>
          <h1 className="text-3xl font-black mt-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-400 text-xs mt-1">Sesión iniciada con éxito. Gestione imágenes, socios VIP, citas e inventario.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all">Ver Web →</a>
          <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-red-500/20 transition-all">Cerrar Sesión 🔒</button>
        </div>
      </div>

      {/* ESTADÍSTICAS GENERALES */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Ingresos Totales</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">${totalIngresos.toLocaleString()} <span className="text-xs text-zinc-500">RD</span></p>
        </div>
        <div className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Gastos / Egresos</p>
          <p className="text-2xl font-black text-red-400 mt-1">${totalGastos.toLocaleString()} <span className="text-xs text-zinc-500">RD</span></p>
        </div>
        <div className="bg-neutral-900/50 border border-amber-500/30 p-5 rounded-2xl bg-gradient-to-br from-neutral-900/80 to-amber-950/20 shadow-lg">
          <p className="text-amber-400 text-xs font-bold uppercase">Ganancia Neta</p>
          <p className="text-2xl font-black text-amber-400 mt-1">${gananciaNeta.toLocaleString()} <span className="text-xs text-zinc-400">RD</span></p>
        </div>
        <div className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Socios VIP Activos</p>
          <p className="text-2xl font-black text-white mt-1">{membresias.length} <span className="text-xs text-zinc-500">socios</span></p>
        </div>
      </div>

      {/* 👑 GESTIÓN DE SOCIOS VIP (NUEVO MÓDULO) */}
      <div className="bg-neutral-900/80 border border-amber-500/30 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Membresías VIP Executive</span>
            <h3 className="text-xl font-black mt-1">👑 Control de Socios VIP y Vencimientos de Pago</h3>
            <p className="text-zinc-400 text-xs mt-1">Monitorea el estado de cada plan VIP, recibe alertas de cobro y envía recordatorios por WhatsApp en 1 clic.</p>
          </div>
          <button
            onClick={() => setModalVIPOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
          >
            + Registrar VIP
          </button>
        </div>

        {membresias.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay socios VIP registrados en el sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="p-3">Cliente VIP</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Fecha Vencimiento</th>
                  <th className="p-3">Estado Cobro</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {membresias.map((vip) => {
                  const status = obtenerEstadoPago(vip.fecha_vencimiento);
                  return (
                    <tr key={vip.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-bold text-white uppercase">{vip.nombre_cliente}</td>
                      <td className="p-3 text-zinc-300 font-mono">{vip.telefono}</td>
                      <td className="p-3 text-amber-400 text-[11px]">{vip.plan}</td>
                      <td className="p-3 font-mono text-zinc-200">{vip.fecha_vencimiento}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${status.color}`}>
                          {status.texto}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleEnviarRecordatorioVIPWA(vip)}
                          title="Enviar recordatorio por WhatsApp"
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          💬 Recordar
                        </button>

                        <button
                          onClick={() => handleRenovarMembresia(vip)}
                          title="Cobrar y renovar 30 días"
                          className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          💳 Cobrar (+30d)
                        </button>

                        <button
                          onClick={() => handleEliminarMembresia(vip.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 font-bold text-xs"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA AGREGAR NUEVO VIP */}
      {modalVIPOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-5 relative shadow-2xl text-white">
            <button
              onClick={() => setModalVIPOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase block">Nuevo Socio VIP</span>
              <h3 className="text-xl font-black uppercase">Registrar Cliente Executive</h3>
            </div>

            <form onSubmit={handleGuardarNuevoVIP} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={vipNombre}
                  onChange={(e) => setVipNombre(e.target.value)}
                  placeholder="Ej. Manuel Rosario"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Teléfono WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={vipTelefono}
                  onChange={(e) => setVipTelefono(e.target.value)}
                  placeholder="Ej. 8091234567"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Plan Membresía</label>
                <select
                  value={vipPlan}
                  onChange={(e) => setVipPlan(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none"
                >
                  <option value="PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)">PLAN INDIVIDUAL EXECUTIVE — RD$ 2,200/mes</option>
                  <option value="PLAN EXECUTIVE DUO (RD$ 4,000/mes)">PLAN EXECUTIVE DUO — RD$ 4,000/mes</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Fecha de Inicio de Pago</label>
                <input
                  type="date"
                  required
                  value={vipFechaInicio}
                  onChange={(e) => setVipFechaInicio(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl uppercase tracking-widest transition-all mt-2"
              >
                Registrar y Activar 30 Días
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 📸 GESTIÓN DE FOTOS DEL SITIO */}
      <div className="bg-neutral-900/80 border border-amber-500/30 p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Personalización Visual</span>
          <h3 className="text-xl font-black mt-1">📸 Cambiar Fotos de la Web (Selección Directa)</h3>
          <p className="text-zinc-400 text-xs mt-1">Presiona el botón en cualquiera de las secciones para elegir una foto desde tu galería o computadora.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FOTO PRINCIPAL (HERO) */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-400">1. Foto Principal (Entrada / Hero)</h4>
            <div className="w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-neutral-900 relative">
              {imgHero ? (
                <img src={imgHero} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">Sin foto personalizada</div>
              )}
            </div>
            <label className="block cursor-pointer">
              <span className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider block text-center transition-all">
                {cargandoImagen ? 'Guardando...' : '📁 Seleccionar Foto Principal'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'img_hero')} />
            </label>
          </div>

          {/* FOTO MASTER BARBER */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-400">2. Tu Foto de Perfil (Master Barber)</h4>
            <div className="w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-neutral-900 relative">
              {imgBarbero ? (
                <img src={imgBarbero} alt="Master Barber" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">Sin foto personalizada</div>
              )}
            </div>
            <label className="block cursor-pointer">
              <span className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider block text-center transition-all">
                {cargandoImagen ? 'Guardando...' : '📁 Seleccionar Foto Barber'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'img_barbero')} />
            </label>
          </div>
        </div>

        {/* GALERÍA EXCLUSIVA / WORKBOOK VIP */}
        <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-amber-400">3. Galería Exclusiva (Workbook VIP)</h4>
            <label className="cursor-pointer">
              <span className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all inline-block">
                + Agregar nueva foto a la Galería
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'galeria')} />
            </label>
          </div>

          {galeriaImgs.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No has agregado fotos a la galería VIP aún.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galeriaImgs.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 h-28 bg-neutral-900">
                  <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                    <label className="cursor-pointer bg-amber-500 text-black px-2 py-1 rounded text-[10px] font-bold">
                      Cambiar
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'galeria', idx)} />
                    </label>
                    <button onClick={() => eliminarFotoGaleria(idx)} className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GESTIÓN DE CITAS */}
      <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Agenda en Supabase</span>
          <h3 className="text-lg font-black mt-0.5">Control de Citas de Clientes</h3>
        </div>

        {citas.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay citas registradas todavía en la base de datos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Servicio</th>
                  <th className="p-3">Barbero</th>
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">{cita.nombre_cliente}</td>
                    <td className="p-3 text-zinc-300 font-mono">{cita.telefono || 'Sin número'}</td>
                    <td className="p-3 text-amber-400">{cita.servicio}</td>
                    <td className="p-3 text-zinc-300">{cita.barbero}</td>
                    <td className="p-3 text-zinc-400">{cita.fecha} • {cita.hora}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        cita.estado === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        cita.estado === 'Completada' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button 
                        onClick={() => enviarWhatsApp(cita)} 
                        title="Enviar recordatorio por WhatsApp"
                        className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-bold inline-flex items-center gap-1"
                      >
                        💬 WhatsApp
                      </button>
                      <button onClick={() => cambiarEstadoCita(cita.id, 'Completada')} className="bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-semibold">Completar</button>
                      <button onClick={() => cambiarEstadoCita(cita.id, 'Cancelada')} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-semibold">Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONTABILIDAD (INGRESOS Y GASTOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-base font-black text-emerald-400">+ Registrar Entrada de Dinero</h3>
          <form onSubmit={(e) => registrarTransaccion(e, 'ingreso')} className="space-y-3">
            <input type="text" placeholder="Concepto (Ej. Corte + Barba)" value={conceptoIngreso} onChange={(e) => setConceptoIngreso(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none" required />
            <input type="number" placeholder="Monto en RD$" value={ingresoManual} onChange={(e) => setIngresoManual(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none" required />
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all">Guardar Ingreso</button>
          </form>
        </div>

        <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-base font-black text-red-400">- Registrar Gasto / Egreso</h3>
          <form onSubmit={(e) => registrarTransaccion(e, 'gasto')} className="space-y-3">
            <input type="text" placeholder="Concepto (Ej. Compra Cuchillas)" value={conceptoGasto} onChange={(e) => setConceptoGasto(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none" required />
            <input type="number" placeholder="Monto en RD$" value={gastoManual} onChange={(e) => setGastoManual(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none" required />
            <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all">Guardar Gasto</button>
          </form>
        </div>
      </div>

      {/* HISTORIAL DE MOVIMIENTOS FINANCIEROS */}
      {transacciones.length > 0 && (
        <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-3xl shadow-xl space-y-3">
          <h3 className="text-sm font-black uppercase text-zinc-400 tracking-wider">Historial de Caja y Movimientos</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {transacciones.map((t) => (
              <div key={t.id} className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-white/5 text-xs">
                <div>
                  <span className={`font-bold mr-2 px-2 py-0.5 rounded text-[10px] ${t.tipo === 'ingreso' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.tipo.toUpperCase()}
                  </span>
                  <span className="text-zinc-200">{t.concepto}</span>
                  <span className="text-zinc-500 text-[10px] ml-2">({t.fecha})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.tipo === 'ingreso' ? '+' : '-'}${t.monto.toLocaleString()} RD
                  </span>
                  <button onClick={() => eliminarTransaccion(t.id)} className="text-zinc-600 hover:text-red-400 font-bold px-1.5 py-0.5 rounded">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGREGAR PRODUCTO */}
      <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-3xl shadow-xl">
        <h3 className="text-lg font-black mb-4">Agregar Nuevo Producto a la Tienda</h3>
        <form onSubmit={handleCrearProducto} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Nombre</label>
            <input type="text" placeholder="Ej. Sauvage Dior" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 outline-none" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Precio</label>
            <input type="text" placeholder="Ej. RD$6,800" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 outline-none" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Stock Inicial</label>
            <input type="number" placeholder="Ej. 10" value={nuevoStock} onChange={(e) => setNuevoStock(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 outline-none" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Categoría</label>
            <select value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 outline-none">
              <option value="Fragancias">Fragancias</option>
              <option value="Ceras">Ceras</option>
              <option value="Ropa">Ropa</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">URL de la Imagen</label>
            <input type="text" placeholder="https://images.unsplash.com/..." value={nuevaImg} onChange={(e) => setNuevaImg(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-amber-400 outline-none" />
          </div>
          <div className="sm:col-span-2 pt-2">
            <button type="submit" disabled={cargando} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg">
              {cargando ? 'Guardando...' : 'Publicar Producto'}
            </button>
          </div>
        </form>
      </div>

      {/* CONTROL DE STOCK */}
      <div className="space-y-4">
        <h3 className="text-lg font-black">Inventario Actual (Control de Stock)</h3>
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5">
            {productos.map((prod) => (
              <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-3">
                  <img src={prod.img} alt={prod.nombre} className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-neutral-950" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{prod.nombre}</h4>
                    <p className="text-amber-400 text-xs font-semibold">
                      {prod.precio ? prod.precio.replace('%', '$') : ''} • <span className="text-zinc-400">{prod.categoria || 'General'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-white/10">
                    <button onClick={() => actualizarStock(prod.id, prod.stock, -1)} className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center justify-center text-sm transition-all">-</button>
                    <span className="font-mono font-bold text-sm px-2">{prod.stock}</span>
                    <button onClick={() => actualizarStock(prod.id, prod.stock, 1)} className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center text-sm transition-all">+</button>
                  </div>
                  <button onClick={() => eliminarProducto(prod.id)} className="text-zinc-500 hover:text-red-400 text-xs font-bold transition-all p-2">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}