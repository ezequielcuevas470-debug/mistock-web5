'use client';

import { useState, useEffect, useCallback, useTransition, useId } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN Y TIPOS PROFESIONALES
// ==========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydqmwtwyiuogthqyxthj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW13dHd5aXVvZ3RocXl4dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTgxNTYsImV4cCI6MjA5OTk3NDE1Nn0.SbCzxMDdSr-_3iLCBxIsw8t-ZdCiN2FwVYNoAEo9L6k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Producto {
  readonly id: number;
  readonly nombre: string;
  readonly precio: string;
  readonly img: string;
  readonly stock: number;
  readonly categoria?: string;
}

export interface Cita {
  readonly id: number;
  readonly nombre_cliente: string;
  readonly telefono?: string;
  readonly servicio: string;
  readonly barbero: string;
  readonly fecha: string;
  readonly hora: string;
  readonly estado: string;
}

export interface Transaccion {
  readonly id: number;
  readonly tipo: 'ingreso' | 'gasto';
  readonly concepto: string;
  readonly monto: number;
  readonly fecha: string;
}

export interface Membresia {
  readonly id: number;
  readonly nombre_cliente: string;
  readonly telefono: string;
  readonly plan: string;
  readonly metodo_pago?: string;
  readonly fecha_inicio: string;
  readonly fecha_vencimiento: string;
  readonly estado: string;
}

interface EstadoPago {
  readonly texto: string;
  readonly color: string;
  readonly dias: number;
}

// Credenciales protegidas mediante variables de entorno recomendadas
const USUARIO_ADMIN = process.env.NEXT_PUBLIC_ADMIN_USER || 'otroflow';
const PASSWORD_ADMIN = process.env.NEXT_PUBLIC_ADMIN_PASS || 'barberia2026';
const SESSION_KEY = 'admin_otro_flow_secure_session';

export default function AdminPage() {
  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(false);
  const [usuarioInput, setUsuarioInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [cargandoAuth, setCargandoAuth] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  const usuarioId = useId();
  const passwordId = useId();

  // Estados principales de datos
  const [productos, setProductos] = useState<readonly Producto[]>([]);
  const [citas, setCitas] = useState<readonly Cita[]>([]);
  const [transacciones, setTransacciones] = useState<readonly Transaccion[]>([]);
  const [membresias, setMembresias] = useState<readonly Membresia[]>([]);

  // Configuración visual y multimedia
  const [imgHero, setImgHero] = useState<string>('');
  const [imgBarbero, setImgBarbero] = useState<string>('');
  const [galeriaImgs, setGaleriaImgs] = useState<readonly string[]>([]);
  const [cargandoImagen, setCargandoImagen] = useState<boolean>(false);

  // Formularios de Productos
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoPrecio, setNuevoPrecio] = useState<string>('');
  const [nuevoStock, setNuevoStock] = useState<string>('');
  const [nuevaImg, setNuevaImg] = useState<string>('');
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('Fragancias');
  const [cargando, setCargando] = useState<boolean>(false);

  // Finanzas Manuales
  const [ingresoManual, setIngresoManual] = useState<string>('');
  const [conceptoIngreso, setConceptoIngreso] = useState<string>('');
  const [gastoManual, setGastoManual] = useState<string>('');
  const [conceptoGasto, setConceptoGasto] = useState<string>('');

  // Modales de Socios VIP
  const [modalVIPOpen, setModalVIPOpen] = useState<boolean>(false);
  const [vipNombre, setVipNombre] = useState<string>('');
  const [vipTelefono, setVipTelefono] = useState<string>('');
  const [vipPlan, setVipPlan] = useState<string>('PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)');
  const [vipFechaInicio, setVipFechaInicio] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // ==========================================
  // EFECTOS Y CICLO DE VIDA
  // ==========================================

  useEffect(() => {
    try {
      const sesionGuardada = sessionStorage.getItem(SESSION_KEY);
      if (sesionGuardada === 'true') {
        setEstaAutenticado(true);
      }
    } catch (error) {
      console.error('Error al acceder al almacenamiento de sesión:', error);
    } finally {
      setCargandoAuth(false);
    }
  }, []);

  const fetchDatosAdmin = useCallback(async () => {
    try {
      const [prodRes, citaRes, finRes, membRes, configRes] = await Promise.all([
        supabase.from('productos').select('*').order('id', { ascending: false }),
        supabase.from('citas').select('*').order('id', { ascending: false }),
        supabase.from('finanzas').select('*').order('id', { ascending: false }),
        supabase.from('membresias').select('*').order('id', { ascending: false }),
        supabase.from('configuracion').select('*'),
      ]);

      if (prodRes.data) setProductos(prodRes.data);
      if (citaRes.data) setCitas(citaRes.data);
      if (finRes.data) setTransacciones(finRes.data);
      if (membRes.data) setMembresias(membRes.data);

      if (configRes.data) {
        configRes.data.forEach((item) => {
          if (item.clave === 'img_hero') setImgHero(item.valor);
          if (item.clave === 'img_barbero') setImgBarbero(item.valor);
          if (item.clave === 'galeria') {
            try {
              const parsed = JSON.parse(item.valor);
              if (Array.isArray(parsed)) setGaleriaImgs(parsed);
            } catch {
              setGaleriaImgs([]);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error sincronizando datos del panel administrativo:', error);
    }
  }, []);

  useEffect(() => {
    if (estaAutenticado) {
      fetchDatosAdmin();
    }
  }, [estaAutenticado, fetchDatosAdmin]);

  // ==========================================
  // MANEJO DE AUTENTICACIÓN
  // ==========================================

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      if (usuarioInput.trim() === USUARIO_ADMIN && passwordInput === PASSWORD_ADMIN) {
        setEstaAutenticado(true);
        try {
          sessionStorage.setItem(SESSION_KEY, 'true');
        } catch (error) {
          console.error('No se pudo persistir la sesión:', error);
        }
      } else {
        alert('Credenciales inválidas. Acceso restringido.');
      }
    });
  };

  const handleLogout = () => {
    setEstaAutenticado(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error al limpiar sesión:', error);
    }
    setUsuarioInput('');
    setPasswordInput('');
  };

  // ==========================================
  // GESTIÓN DE SOCIOS VIP
  // ==========================================

  const obtenerEstadoPago = (fechaVencimientoStr: string): EstadoPago => {
    if (!fechaVencimientoStr) {
      return { texto: 'Sin Fecha', color: 'bg-zinc-800 text-zinc-400', dias: 0 };
    }

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
      return {
        texto: `Vencido (${Math.abs(diasRestantes)}d)`,
        color: 'bg-red-500/20 text-red-400 border border-red-500/40',
        dias: diasRestantes,
      };
    } else if (diasRestantes <= 5) {
      return {
        texto: `Cobrar Hoy / ${diasRestantes}d`,
        color: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        dias: diasRestantes,
      };
    } else {
      return {
        texto: `Al Día (${diasRestantes}d)`,
        color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        dias: diasRestantes,
      };
    }
  };

  const handleGuardarNuevoVIP = async (e: React.FormEvent<HTMLFormElement>) => {
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
        estado: 'Activo',
      },
    ]);

    if (!error) {
      setModalVIPOpen(false);
      setVipNombre('');
      setVipTelefono('');
      fetchDatosAdmin();
    } else {
      alert(`Error guardando socio VIP: ${error.message}`);
    }
  };

  const handleRenovarMembresia = async (vip: Membresia) => {
    if (!confirm(`¿Confirmar renovación de mensualidad para ${vip.nombre_cliente} por 30 días adicionales?`)) return;

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
        estado: 'Activo',
      })
      .eq('id', vip.id);

    if (!error) {
      alert(`¡Mensualidad renovada con éxito para ${vip.nombre_cliente}!`);
      fetchDatosAdmin();
    } else {
      alert(`Error al renovar membresía: ${error.message}`);
    }
  };

  const handleEnviarRecordatorioVIPWA = (vip: Membresia) => {
    const estado = obtenerEstadoPago(vip.fecha_vencimiento);
    let msg = '';

    if (estado.dias < 0) {
      msg = `Hola *${vip.nombre_cliente}*, te saludamos de *OTRO FLOW BARBERSHOP* 💈.%0A%0ATu suscripción VIP (*${vip.plan}*) venció el *${vip.fecha_vencimiento}*.%0A%0AIndícanos si prefieres realizar transferencia o pasar por el local para mantener tus privilegios activos. ¡Quedamos atentos bro! 🔥`;
    } else {
      msg = `Hola *${vip.nombre_cliente}*, te saludamos de *OTRO FLOW BARBERSHOP* 💈.%0A%0ARecuerda que tu cuota del *${vip.plan}* vence próximamente (*${vip.fecha_vencimiento}*).%0A%0APuedes gestionar tu renovación para conservar tu atención preferencial. ¡Gracias por ser socio VIP! 🚀`;
    }

    const telLimpio = vip.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${telLimpio}?text=${msg}`, '_blank');
  };

  const handleEliminarMembresia = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta membresía del sistema?')) {
      await supabase.from('membresias').delete().eq('id', id);
      fetchDatosAdmin();
    }
  };

  // ==========================================
  // GESTIÓN DE IMÁGENES Y MULTIMEDIA
  // ==========================================

  const handleSubirFoto = (e: React.ChangeEvent<HTMLInputElement>, clave: string, indexGaleria?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('La imagen excede el límite permitido. Seleccione un archivo menor a 4MB.');
      return;
    }

    setCargandoImagen(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const urlFinal = reader.result as string;
      let errorResult: any = null;

      if (clave === 'img_hero') {
        setImgHero(urlFinal);
        const { error } = await supabase.from('configuracion').upsert({ clave: 'img_hero', valor: urlFinal }, { onConflict: 'clave' });
        errorResult = error;
      } else if (clave === 'img_barbero') {
        setImgBarbero(urlFinal);
        const { error } = await supabase.from('configuracion').upsert({ clave: 'img_barbero', valor: urlFinal }, { onConflict: 'clave' });
        errorResult = error;
      } else if (clave === 'galeria') {
        const nuevaGaleria = [...galeriaImgs];
        if (typeof indexGaleria === 'number') {
          nuevaGaleria[indexGaleria] = urlFinal;
        } else {
          nuevaGaleria.push(urlFinal);
        }
        setGaleriaImgs(nuevaGaleria);
        const { error } = await supabase.from('configuracion').upsert({ clave: 'galeria', valor: JSON.stringify(nuevaGaleria) }, { onConflict: 'clave' });
        errorResult = error;
      }

      setCargandoImagen(false);

      if (errorResult) {
        alert(`Error al sincronizar con la base de datos: ${errorResult.message}`);
      } else {
        alert('¡Imagen actualizada con éxito en la plataforma!');
      }
    };
    reader.readAsDataURL(file);
  };

  const eliminarFotoGaleria = async (index: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería pública?')) return;
    const nuevaGaleria = galeriaImgs.filter((_, i) => i !== index);
    setGaleriaImgs(nuevaGaleria);
    await supabase.from('configuracion').upsert({ clave: 'galeria', valor: JSON.stringify(nuevaGaleria) }, { onConflict: 'clave' });
  };

  // ==========================================
  // GESTIÓN DE PRODUCTOS E INVENTARIO
  // ==========================================

  const actualizarStock = async (id: number, stockActual: number, cambio: number) => {
    const nuevoStockVal = Math.max(0, stockActual + cambio);
    const { error } = await supabase.from('productos').update({ stock: nuevoStockVal }).eq('id', id);
    if (!error) {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, stock: nuevoStockVal } : p)));
    }
  };

  const handleCrearProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio || !nuevoStock) return;

    setCargando(true);
    const precioLimpio = nuevoPrecio.replace('%', '$');

    const { error } = await supabase.from('productos').insert([
      {
        nombre: nuevoNombre,
        precio: precioLimpio,
        stock: parseInt(nuevoStock, 10),
        img: nuevaImg || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&auto=format&fit=crop&q=60',
        categoria: nuevaCategoria,
      },
    ]);

    setCargando(false);
    if (!error) {
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoStock('');
      setNuevaImg('');
      fetchDatosAdmin();
    } else {
      alert(`Error al registrar el producto: ${error.message}`);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Desea eliminar este producto del inventario?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (!error) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // ==========================================
  // GESTIÓN DE CITAS Y NOTIFICACIONES
  // ==========================================

  const cambiarEstadoCita = async (id: number, nuevoEstado: string) => {
    const { error } = await supabase.from('citas').update({ estado: nuevoEstado }).eq('id', id);
    if (!error) {
      setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
    }
  };

  const enviarWhatsApp = (cita: Cita) => {
    if (!cita.telefono) {
      alert('El cliente no cuenta con un número telefónico registrado.');
      return;
    }
    const telefonoLimpiado = cita.telefono.replace(/\D/g, '');
    const mensaje = `¡Hola ${cita.nombre_cliente}! Te recordamos tu cita para el servicio de *${cita.servicio}* hoy a las *${cita.hora}* en Otro Flow Barbershop 💈✨. ¡Te esperamos!`;
    const url = `https://wa.me/${telefonoLimpiado}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // ==========================================
  // GESTIÓN FINANCIERA
  // ==========================================

  const registrarTransaccion = async (e: React.FormEvent<HTMLFormElement>, tipo: 'ingreso' | 'gasto') => {
    e.preventDefault();
    const concepto = tipo === 'ingreso' ? conceptoIngreso : conceptoGasto;
    const montoStr = tipo === 'ingreso' ? ingresoManual : gastoManual;

    if (!concepto || !montoStr) return;

    const nuevaTrans = {
      tipo,
      concepto,
      monto: parseFloat(montoStr) || 0,
      fecha: new Date().toLocaleDateString(),
    };

    const { data, error } = await supabase.from('finanzas').insert([nuevaTrans]).select();
    if (!error && data) {
      setTransacciones((prev) => [data[0], ...prev]);
      if (tipo === 'ingreso') {
        setConceptoIngreso('');
        setIngresoManual('');
      } else {
        setConceptoGasto('');
        setGastoManual('');
      }
    } else if (error) {
      alert(`Error al registrar la transacción financiera: ${error.message}`);
    }
  };

  const eliminarTransaccion = async (id: number) => {
    const { error } = await supabase.from('finanzas').delete().eq('id', id);
    if (!error) {
      setTransacciones((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Métricas calculadas
  const totalIngresos = transacciones.filter((t) => t.tipo === 'ingreso').reduce((acc, curr) => acc + curr.monto, 0);
  const totalGastos = transacciones.filter((t) => t.tipo === 'gasto').reduce((acc, curr) => acc + curr.monto, 0);
  const gananciaNeta = totalIngresos - totalGastos;

  // ==========================================
  // RENDERIZADO DE INTERFACES (UI)
  // ==========================================

  if (cargandoAuth) {
    return (
      <main className="min-h-screen bg-[#070708] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-zinc-400">Verificando protocolos de seguridad...</p>
        </div>
      </main>
    );
  }

  if (!estaAutenticado) {
    return (
      <main className="min-h-screen bg-[#070708] text-white flex items-center justify-center p-6 selection:bg-amber-500 selection:text-black">
        <section aria-labelledby="auth-title" className="bg-neutral-900/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl max-w-md w-full space-y-6 backdrop-blur-xl">
          <header className="text-center space-y-2">
            <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Área Restringida
            </span>
            <h1 id="auth-title" className="text-2xl font-black mt-2 tracking-tight">Otro Flow — Autenticación Pro</h1>
            <p className="text-zinc-400 text-xs">Ingrese sus credenciales administrativas para gestionar el sistema.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor={usuarioId} className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Usuario</label>
              <input
                id={usuarioId}
                type="text"
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-400 outline-none transition-colors"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor={passwordId} className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Contraseña</label>
              <input
                id={passwordId}
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-400 outline-none transition-colors"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {isPending ? 'Verificando...' : 'Desbloquear Panel 🔓'}
            </button>
          </form>

          <footer className="text-center pt-2">
            <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">← Volver al sitio público</a>
          </footer>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white p-6 md:p-12 max-w-6xl mx-auto space-y-10 selection:bg-amber-500 selection:text-black font-sans">
      {/* CABECERA GENERAL */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Panel Gerencial Pro
          </span>
          <h1 className="text-3xl font-black mt-2 tracking-tight">Otro Flow Barbershop</h1>
          <p className="text-zinc-400 text-xs mt-1">Control centralizado de citas, finanzas, inventario y experiencia multimedia.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all"
          >
            Ver Web Pública →
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-red-500/20 transition-all cursor-pointer"
          >
            Cerrar Sesión 🔒
          </button>
        </div>
      </header>

      {/* MÉTRICAS PRINCIPALES */}
      <section aria-label="Estadísticas Financieras" className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <article className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Ingresos Totales</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            ${totalIngresos.toLocaleString()} <span className="text-xs text-zinc-500">RD</span>
          </p>
        </article>
        <article className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Egresos / Gastos</p>
          <p className="text-2xl font-black text-red-400 mt-1">
            ${totalGastos.toLocaleString()} <span className="text-xs text-zinc-500">RD</span>
          </p>
        </article>
        <article className="bg-neutral-900/50 border border-amber-500/30 p-5 rounded-2xl bg-gradient-to-br from-neutral-900/80 to-amber-950/20 shadow-lg">
          <p className="text-amber-400 text-xs font-bold uppercase">Ganancia Neta</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            ${gananciaNeta.toLocaleString()} <span className="text-xs text-zinc-400">RD</span>
          </p>
        </article>
        <article className="bg-neutral-900/50 border border-white/10 p-5 rounded-2xl shadow-lg">
          <p className="text-zinc-400 text-xs font-bold uppercase">Socios VIP Activos</p>
          <p className="text-2xl font-black text-white mt-1">
            {membresias.length} <span className="text-xs text-zinc-500">miembros</span>
          </p>
        </article>
      </section>

      {/* CONTROL DE SOCIOS VIP */}
      <section className="bg-neutral-900/80 border border-amber-500/30 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Membresías Executive</span>
            <h2 className="text-xl font-black mt-1">Control de Socios VIP y Vencimientos</h2>
            <p className="text-zinc-400 text-xs mt-1">Monitoree el estado de suscripciones, gestione cobros y envíe alertas automáticas vía WhatsApp.</p>
          </div>
          <button
            onClick={() => setModalVIPOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            + Registrar Socio VIP
          </button>
        </div>

        {membresias.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay membresías VIP activas registradas actualmente.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="p-3">Cliente VIP</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3">Estado de Pago</th>
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
                          title="Enviar aviso por WhatsApp"
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          💬 Recordar
                        </button>
                        <button
                          onClick={() => handleRenovarMembresia(vip)}
                          title="Cobrar y renovar por 30 días"
                          className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          💳 Cobrar (+30d)
                        </button>
                        <button
                          onClick={() => handleEliminarMembresia(vip.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 font-bold text-xs cursor-pointer"
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
      </section>

      {/* GESTIÓN DE CITAS */}
      <section className="bg-neutral-900/80 border border-white/15 p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Agenda de Barbería</span>
          <h2 className="text-xl font-black mt-1">Control y Estado de Citas</h2>
          <p className="text-zinc-400 text-xs mt-1">Supervise las reservas de los clientes y coordine recordatorios directos.</p>
        </div>

        {citas.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay citas registradas en la agenda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Servicio</th>
                  <th className="p-3">Barbero</th>
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-bold text-white">
                      {cita.nombre_cliente}
                      <span className="block text-[10px] text-zinc-400 font-mono">{cita.telefono || 'Sin teléfono'}</span>
                    </td>
                    <td className="p-3 text-amber-400">{cita.servicio}</td>
                    <td className="p-3 text-zinc-300">{cita.barbero}</td>
                    <td className="p-3 font-mono text-zinc-200">{cita.fecha} — {cita.hora}</td>
                    <td className="p-3">
                      <select
                        value={cita.estado}
                        onChange={(e) => cambiarEstadoCita(cita.id, e.target.value)}
                        className="bg-neutral-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-400"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      {cita.telefono && (
                        <button
                          onClick={() => enviarWhatsApp(cita)}
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          💬 WhatsApp
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL PARA NUEVO SOCIO VIP */}
      {modalVIPOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-5 relative shadow-2xl text-white">
            <button
              onClick={() => setModalVIPOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase block">Registro Exclusivo</span>
              <h2 className="text-xl font-black uppercase">Nuevo Socio VIP</h2>
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
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Plan de Membresía</label>
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
                <label className="block text-zinc-400 uppercase font-bold text-[10px] mb-1">Fecha de Inicio</label>
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
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl uppercase tracking-widest transition-all mt-2 cursor-pointer"
              >
                Registrar y Activar 30 Días
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PERSONALIZACIÓN VISUAL Y MULTIMEDIA */}
      <section className="bg-neutral-900/80 border border-amber-500/30 p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Multimedia y Diseño</span>
          <h2 className="text-xl font-black mt-1">Gestión de Imágenes del Sitio Web</h2>
          <p className="text-zinc-400 text-xs mt-1">Actualice la identidad visual de la barbería cargando nuevas fotografías corporativas o de la galería.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HERO */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-bold text-sm text-amber-400">1. Imagen de Cabecera (Hero)</h3>
            <div className="w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-neutral-900 relative">
              {imgHero ? (
                <img src={imgHero} alt="Hero principal" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">Sin imagen configurada</div>
              )}
            </div>
            <label className="block cursor-pointer">
              <span className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider block text-center transition-all">
                {cargandoImagen ? 'Procesando...' : '📁 Seleccionar Imagen Hero'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'img_hero')} />
            </label>
          </div>

          {/* BARBERO */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-bold text-sm text-amber-400">2. Fotografía del Master Barber</h3>
            <div className="w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-neutral-900 relative">
              {imgBarbero ? (
                <img src={imgBarbero} alt="Master Barber" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">Sin imagen configurada</div>
              )}
            </div>
            <label className="block cursor-pointer">
              <span className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider block text-center transition-all">
                {cargandoImagen ? 'Procesando...' : '📁 Seleccionar Foto Barber'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'img_barbero')} />
            </label>
          </div>
        </div>

        {/* GALERÍA */}
        <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-amber-400">3. Galería Exclusiva (Trabajos Realizados)</h3>
            <label className="cursor-pointer">
              <span className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all inline-block">
                + Agregar foto a galería
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirFoto(e, 'galeria')} />
            </label>
          </div>

          {galeriaImgs.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No hay imágenes en la galería actualmente.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galeriaImgs.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 h-32 bg-neutral-900">
                  <img src={imgUrl} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => eliminarFotoGaleria(idx)}
                      className="bg-red-500 text-white p-2 rounded-lg text-xs font-bold cursor-pointer"
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GESTIÓN DE PRODUCTOS E INVENTARIO */}
      <section className="bg-neutral-900/80 border border-white/15 p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Inventario y Tienda</span>
          <h2 className="text-xl font-black mt-1">Control de Stock y Productos</h2>
        </div>

        <form onSubmit={handleCrearProducto} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-neutral-950 p-4 rounded-2xl border border-white/10">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
          />
          <input
            type="text"
            placeholder="Precio (Ej. $1,500)"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
            required
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
          />
          <input
            type="number"
            placeholder="Stock inicial"
            value={nuevoStock}
            onChange={(e) => setNuevoStock(e.target.value)}
            required
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
          />
          <select
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
          >
            <option value="Fragancias">Fragancias</option>
            <option value="Cuidado Capilar">Cuidado Capilar</option>
            <option value="Accesorios">Accesorios</option>
          </select>
          <button
            type="submit"
            disabled={cargando}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            {cargando ? 'Guardando...' : '+ Añadir Producto'}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {productos.map((prod) => (
            <article key={prod.id} className="bg-neutral-950 p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-3">
                <img src={prod.img} alt={prod.nombre} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                <div>
                  <h3 className="font-bold text-sm text-white">{prod.nombre}</h3>
                  <p className="text-amber-400 text-xs font-mono">{prod.precio}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-zinc-400">Stock: <strong className="text-white">{prod.stock}</strong></span>
                <div className="space-x-1">
                  <button
                    onClick={() => actualizarStock(prod.id, prod.stock, -1)}
                    className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => actualizarStock(prod.id, prod.stock, 1)}
                    className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-bold cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => eliminarProducto(prod.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* REGISTRO FINANCIERO MANUAL */}
      <section className="bg-neutral-900/80 border border-white/15 p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Caja y Finanzas</span>
          <h2 className="text-xl font-black mt-1">Registro de Ingresos y Gastos Manuales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={(e) => registrarTransaccion(e, 'ingreso')} className="bg-neutral-950 p-5 rounded-2xl border border-emerald-500/20 space-y-3">
            <h3 className="font-bold text-sm text-emerald-400">Registrar Ingreso Extra</h3>
            <input
              type="text"
              placeholder="Concepto (Ej. Venta caja directa)"
              value={conceptoIngreso}
              onChange={(e) => setConceptoIngreso(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
            />
            <input
              type="number"
              placeholder="Monto en RD$"
              value={ingresoManual}
              onChange={(e) => setIngresoManual(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer">
              Registrar Ingreso
            </button>
          </form>

          <form onSubmit={(e) => registrarTransaccion(e, 'gasto')} className="bg-neutral-950 p-5 rounded-2xl border border-red-500/20 space-y-3">
            <h3 className="font-bold text-sm text-red-400">Registrar Gasto / Egreso</h3>
            <input
              type="text"
              placeholder="Concepto (Ej. Compra insumos / luz)"
              value={conceptoGasto}
              onChange={(e) => setConceptoGasto(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-400"
            />
            <input
              type="number"
              placeholder="Monto en RD$"
              value={gastoManual}
              onChange={(e) => setGastoManual(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-400"
            />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer">
              Registrar Gasto
            </button>
          </form>
        </div>

        {transacciones.length > 0 && (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {transacciones.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.tipo === 'ingreso' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="p-3 text-white">{t.concepto}</td>
                    <td className={`p-3 font-mono font-bold ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${t.monto.toLocaleString()} RD$
                    </td>
                    <td className="p-3 text-zinc-400 font-mono">{t.fecha}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => eliminarTransaccion(t.id)} className="text-zinc-600 hover:text-red-400 font-bold cursor-pointer">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}