'use client';

import React, { useState, useEffect, useCallback, useTransition, useId } from 'react';
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
  readonly descripcion?: string;
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

// Credenciales protegidas
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

  // Formularios de Productos
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoPrecio, setNuevoPrecio] = useState<string>('');
  const [nuevoStock, setNuevoStock] = useState<string>('');
  const [nuevaImg, setNuevaImg] = useState<string>('');
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('Fragancias');
  const [nuevoDesc, setNuevoDesc] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  // Estados para modo edición de productos
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState<string>('');
  const [editPrecio, setEditPrecio] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [editImg, setEditImg] = useState<string>('');
  const [editCategoria, setEditCategoria] = useState<string>('');

  const categoriasDisponibles = [
    "Fragancias", 
    "Cuidado Capilar", 
    "Accesorios", 
    "Tenis", 
    "Gorras", 
    "Sandalias", 
    "Ropa"
  ];

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
  // GESTIÓN DE CITAS Y SUS INGRESOS
  // ==========================================

  const actualizarEstadoCita = async (id: number, nuevoEstado: string, precioServicioStr?: string) => {
    const { error: errorCita } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (errorCita) {
      alert(`Error al actualizar estado de la cita: ${errorCita.message}`);
      return;
    }

    // Si la cita se marca como "Completada" o "Confirmada" y trae asociado un costo, registramos automáticamente el ingreso
    if ((nuevoEstado === 'Completada' || nuevoEstado === 'Confirmada') && precioServicioStr) {
      const montoNumerico = parseFloat(precioServicioStr.replace(/[^\d.]/g, '')) || 0;
      if (montoNumerico > 0) {
        const citaObj = citas.find(c => c.id === id);
        await supabase.from('finanzas').insert([
          {
            tipo: 'ingreso',
            concepto: `Cita / Servicio (${citaObj?.servicio || 'Barbería'}): ${citaObj?.nombre_cliente || 'Cliente'}`,
            monto: montoNumerico,
            fecha: new Date().toLocaleDateString(),
          }
        ]);
      }
    }

    fetchDatosAdmin();
  };

  const eliminarCita = async (id: number) => {
    if (!confirm('¿Desea eliminar esta cita del registro?')) return;
    const { error } = await supabase.from('citas').delete().eq('id', id);
    if (!error) {
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(`Error al eliminar cita: ${error.message}`);
    }
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

    const montoMembresia = vipPlan.includes('3,500') ? 3500 : 2200;

    const [membRes, finRes] = await Promise.all([
      supabase.from('membresias').insert([
        {
          nombre_cliente: vipNombre,
          telefono: vipTelefono,
          plan: vipPlan,
          metodo_pago: 'Efectivo / Presencial',
          fecha_inicio: inicioFmt,
          fecha_vencimiento: vencimientoFmt,
          estado: 'Activo',
        },
      ]),
      supabase.from('finanzas').insert([
        {
          tipo: 'ingreso',
          concepto: `Membresía VIP: ${vipNombre} (${vipPlan})`,
          monto: montoMembresia,
          fecha: new Date().toLocaleDateString(),
        }
      ])
    ]);

    if (!membRes.error && !finRes.error) {
      setModalVIPOpen(false);
      setVipNombre('');
      setVipTelefono('');
      fetchDatosAdmin();
    } else {
      alert(`Error registrando socio VIP o su ingreso: ${membRes.error?.message || finRes.error?.message}`);
    }
  };

  const handleRenovarMembresia = async (vip: Membresia) => {
    if (!confirm(`¿Confirmar renovación de mensualidad para ${vip.nombre_cliente} por 30 días adicionales?`)) return;

    const hoy = new Date();
    const nuevoVencimiento = new Date(hoy);
    nuevoVencimiento.setDate(nuevoVencimiento.getDate() + 30);

    const inicioFmt = hoy.toISOString().split('T')[0];
    const vencimientoFmt = nuevoVencimiento.toISOString().split('T')[0];
    const montoMembresia = vip.plan?.includes('3,500') ? 3500 : 2200;

    const [updRes, finRes] = await Promise.all([
      supabase.from('membresias').update({
        fecha_inicio: inicioFmt,
        fecha_vencimiento: vencimientoFmt,
        estado: 'Activo',
      }).eq('id', vip.id),
      supabase.from('finanzas').insert([
        {
          tipo: 'ingreso',
          concepto: `Renovación VIP: ${vip.nombre_cliente}`,
          monto: montoMembresia,
          fecha: new Date().toLocaleDateString(),
        }
      ])
    ]);

    if (!updRes.error && !finRes.error) {
      alert(`¡Mensualidad renovada y registrada en ingresos para ${vip.nombre_cliente}!`);
      fetchDatosAdmin();
    } else {
      alert(`Error al renovar membresía: ${updRes.error?.message || finRes.error?.message}`);
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
  // GESTIÓN DE PRODUCTOS E INVENTARIO
  // ==========================================

  const actualizarStock = async (id: number, cantidad: number) => {
    const productoActual = productos.find(p => p.id === id);
    if (!productoActual) return;
    
    const nuevoStockVal = Math.max(0, productoActual.stock + cantidad);
    const { error } = await supabase.from('productos').update({ stock: nuevoStockVal }).eq('id', id);
    
    if (!error) {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, stock: nuevoStockVal } : p)));
    }
  };

  const handleCrearProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio || !nuevoStock) return;

    setCargando(true);
    const precioFormateado = nuevoPrecio.startsWith('RD$') ? nuevoPrecio : `${nuevoPrecio}`;
    const imgDefault = nuevaImg.trim() !== '' ? nuevaImg : 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60';

    const { error } = await supabase.from('productos').insert([
      {
        nombre: nuevoNombre,
        precio: precioFormateado,
        stock: parseInt(nuevoStock, 10) || 0,
        img: imgDefault,
        categoria: nuevaCategoria,
        descripcion: nuevoDesc || 'Artículo exclusivo disponible en Otro Flow.',
      },
    ]);

    setCargando(false);
    if (!error) {
      alert('¡Producto agregado con éxito!');
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoStock('');
      setNuevaImg('');
      setNuevoDesc('');
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

  const iniciarEdicion = (prod: Producto) => {
    setEditandoId(prod.id);
    setEditNombre(prod.nombre);
    setEditPrecio(prod.precio);
    setEditStock(prod.stock.toString());
    setEditImg(prod.img);
    setEditCategoria(prod.categoria || 'Fragancias');
  };

  const guardarEdicion = async (id: number) => {
    const stockNum = parseInt(editStock, 10) || 0;
    const { error } = await supabase.from('productos').update({
      nombre: editNombre,
      precio: editPrecio,
      stock: stockNum,
      img: editImg,
      categoria: editCategoria,
    }).eq('id', id);

    if (!error) {
      setProductos(
        productos.map((prod) => {
          if (prod.id === id) {
            return {
              ...prod,
              nombre: editNombre,
              precio: editPrecio,
              stock: stockNum,
              img: editImg,
              categoria: editCategoria,
            };
          }
          return prod;
        })
      );
      setEditandoId(null);
    } else {
      alert(`Error al actualizar el producto: ${error.message}`);
    }
  };

  // ==========================================
  // GESTIÓN DE FINANZAS Y CAJA
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
      alert(`Error al registrar la transacción: ${error.message}`);
    }
  };

  const eliminarTransaccion = async (id: number) => {
    const { error } = await supabase.from('finanzas').delete().eq('id', id);
    if (!error) {
      setTransacciones((prev) => prev.filter((t) => t.id !== id));
    }
  };

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
    <main className="min-h-screen bg-[#070708] text-white p-6 md:p-12 max-w-7xl mx-auto space-y-10 selection:bg-amber-500 selection:text-black font-sans">
      
      {/* CABECERA GENERAL */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Panel Gerencial Pro
          </span>
          <h1 className="text-3xl font-black mt-2 tracking-tight">Otro Flow Barbershop</h1>
          <p className="text-zinc-400 text-xs mt-1">Control centralizado de citas, finanzas, inventario y productos.</p>
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

      {/* ========================================== */}
      {/* APARTADO DE FINANZAS Y CONTROL DE CAJA */}
      {/* ========================================== */}
      <section className="bg-neutral-900/80 border border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Control Financiero y Caja</span>
          <h2 className="text-xl font-black mt-1">Registro de Ingresos y Egresos</h2>
          <p className="text-zinc-400 text-xs mt-1">Monitorea y registra todo el dinero que entra y sale de la tienda en tiempo real.</p>
        </div>

        {/* Formularios para Registrar Transacciones Manuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Registrar Ingreso */}
          <form onSubmit={(e) => registrarTransaccion(e, 'ingreso')} className="bg-neutral-950 border border-emerald-500/20 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span>➕</span> Registrar Nuevo Ingreso
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Concepto / Motivo</label>
              <input
                type="text"
                required
                placeholder="Ej. Venta de Perfume o Corte Extra"
                value={conceptoIngreso}
                onChange={(e) => setConceptoIngreso(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Monto (RD$)</label>
              <input
                type="number"
                required
                placeholder="Ej. 1500"
                value={ingresoManual}
                onChange={(e) => setIngresoManual(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-lg"
            >
              Registrar Ingreso 💰
            </button>
          </form>

          {/* Registrar Gasto */}
          <form onSubmit={(e) => registrarTransaccion(e, 'gasto')} className="bg-neutral-950 border border-red-500/20 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2">
              <span>➖</span> Registrar Nuevo Gasto / Egreso
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Concepto / Gasto</label>
              <input
                type="text"
                required
                placeholder="Ej. Compra de Cuchillas o Suministros"
                value={conceptoGasto}
                onChange={(e) => setConceptoGasto(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:border-red-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Monto (RD$)</label>
              <input
                type="number"
                required
                placeholder="Ej. 800"
                value={gastoManual}
                onChange={(e) => setGastoManual(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:border-red-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-400 text-black font-black text-xs py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-lg"
            >
              Registrar Egreso 🧾
            </button>
          </form>

        </div>

        {/* Tabla Historial de Movimientos Financieros */}
        <div className="pt-4 space-y-4">
          <h3 className="text-xs font-bold tracking-widest text-zinc-300 uppercase">Historial de Movimientos de Caja</h3>
          
          {transacciones.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-4">No hay transacciones registradas todavía.</p>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse bg-neutral-950">
                <thead className="bg-neutral-900 sticky top-0 z-10 text-zinc-400 uppercase">
                  <tr>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Concepto</th>
                    <th className="p-3">Monto</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {transacciones.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          t.tipo === 'ingreso' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {t.tipo}
                        </span>
                      </td>
                      <td className="p-3 text-white font-semibold">{t.concepto}</td>
                      <td className={`p-3 font-mono font-bold ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.tipo === 'ingreso' ? '+' : '-'}$ {t.monto.toLocaleString()} RD$
                      </td>
                      <td className="p-3 text-zinc-400 font-mono">{t.fecha}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => eliminarTransaccion(t.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-2.5 py-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer"
                          title="Eliminar registro"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>

      {/* ========================================== */}
      {/* APARTADO DE GESTIÓN DE CITAS (CONFIRMAR/INGRESAR) */}
      {/* ========================================== */}
      <section className="bg-neutral-900/80 border border-amber-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Agenda de Clientes</span>
          <h2 className="text-xl font-black mt-1">Control de Citas y Servicios</h2>
          <p className="text-zinc-400 text-xs mt-1">Gestiona las reservas de los clientes. Al marcar una cita como "Confirmada" o "Completada", el ingreso se reflejará automáticamente en las finanzas de la tienda.</p>
        </div>

        {citas.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay citas registradas actualmente.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs border-collapse bg-neutral-950">
              <thead className="bg-neutral-900 text-zinc-400 uppercase">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Servicio</th>
                  <th className="p-3">Barbero</th>
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-bold text-white">{cita.nombre_cliente}</td>
                    <td className="p-3 text-zinc-300 font-mono">{cita.telefono || 'N/D'}</td>
                    <td className="p-3 text-amber-400 font-semibold">{cita.servicio}</td>
                    <td className="p-3 text-zinc-300">{cita.barbero}</td>
                    <td className="p-3 text-zinc-400 font-mono">{cita.fecha} — {cita.hora}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        cita.estado === 'Completada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        cita.estado === 'Confirmada' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {cita.estado || 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => actualizarEstadoCita(cita.id, 'Confirmada', cita.servicio)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 transition-all cursor-pointer"
                        title="Confirmar cita"
                      >
                        ✓ Confirmar
                      </button>
                      <button
                        onClick={() => actualizarEstadoCita(cita.id, 'Completada', cita.servicio)}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
                        title="Completar cita y sumar a ingresos"
                      >
                        💰 Cobrar
                      </button>
                      <button
                        onClick={() => eliminarCita(cita.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-2.5 py-1 rounded-lg border border-red-500/30 transition-all cursor-pointer"
                        title="Eliminar cita"
                      >
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

      {/* SECCIÓN: CREAR PRODUCTO */}
      <section className="bg-neutral-900/80 border border-amber-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Inventario y Tienda</span>
          <h2 className="text-xl font-black mt-1">Añadir Nuevo Producto</h2>
        </div>

        <form onSubmit={handleCrearProducto} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            required
            placeholder="Nombre del producto"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none"
          />

          <input
            type="text"
            required
            placeholder="Precio (Ej. 1,500)"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
            className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none"
          />

          <input
            type="number"
            required
            placeholder="Stock inicial"
            value={nuevoStock}
            onChange={(e) => setNuevoStock(e.target.value)}
            className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none"
          />

          <input
            type="url"
            placeholder="Link URL de la imagen"
            value={nuevaImg}
            onChange={(e) => setNuevaImg(e.target.value)}
            className="bg-neutral-950 border border-amber-500/40 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none font-mono"
          />

          <select
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none"
          >
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="sm:col-span-2 lg:col-span-5">
            <input
              type="text"
              placeholder="Descripción breve (Opcional)"
              value={nuevoDesc}
              onChange={(e) => setNuevoDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-5 pt-2">
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              {cargando ? 'Guardando...' : '+ AÑADIR PRODUCTO'}
            </button>
          </div>
        </form>
      </section>

      {/* GRILLA DE PRODUCTOS Y CONTROL DE STOCK */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Inventario Actual</span>
          <h2 className="text-xl font-black mt-1">Control de Stock y Productos</h2>
        </div>

        {productos.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No hay productos registrados en el inventario.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((prod) => {
              const estaEditando = editandoId === prod.id;

              return (
                <div 
                  key={prod.id} 
                  className="bg-neutral-900/60 border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-xl hover:border-amber-500/40 transition-all"
                >
                  {estaEditando ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Editando Producto</span>
                        <button 
                          onClick={() => setEditandoId(null)}
                          className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                        >
                          ✕ Cancelar
                        </button>
                      </div>

                      <input 
                        type="text" 
                        value={editNombre} 
                        onChange={(e) => setEditNombre(e.target.value)}
                        placeholder="Nombre"
                        className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={editPrecio} 
                          onChange={(e) => setEditPrecio(e.target.value)}
                          placeholder="Precio"
                          className="bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                        />
                        <input 
                          type="number" 
                          value={editStock} 
                          onChange={(e) => setEditStock(e.target.value)}
                          placeholder="Stock"
                          className="bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <input 
                        type="url" 
                        value={editImg} 
                        onChange={(e) => setEditImg(e.target.value)}
                        placeholder="URL de la imagen"
                        className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400 font-mono"
                      />

                      <select 
                        value={editCategoria} 
                        onChange={(e) => setEditCategoria(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                      >
                        {categoriasDisponibles.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <button 
                        onClick={() => guardarEdicion(prod.id)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-2.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                          <img 
                            src={prod.img && prod.img.trim() !== "" ? prod.img : "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60"} 
                            alt={prod.nombre} 
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.onerror = null; 
                              e.target.src = "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                        <div className="space-y-1 overflow-hidden flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm text-white truncate">{prod.nombre}</h3>
                            <button
                              onClick={() => iniciarEdicion(prod)}
                              className="text-neutral-400 hover:text-amber-400 text-xs ml-2 transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              ✏️
                            </button>
                          </div>
                          <p className="text-amber-400 font-black text-sm">
                            {prod.precio ? `RD$ ${prod.precio}` : <span className="text-neutral-500 text-xs">Sin precio</span>}
                          </p>
                          <span className="inline-block px-2 py-0.5 bg-neutral-800 text-[10px] text-neutral-400 rounded-md">
                            {prod.categoria || "General"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 font-medium">
                          Stock: <strong className="text-white text-sm">{prod.stock}</strong>
                        </span>

                        <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-white/5">
                          <button
                            onClick={() => actualizarStock(prod.id, -1)}
                            className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            onClick={() => actualizarStock(prod.id, 1)}
                            className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod.id)}
                            className="w-7 h-7 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg flex items-center justify-center text-xs transition-colors ml-1 cursor-pointer"
                            title="Eliminar producto"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CONTROL DE SOCIOS VIP */}
      <section className="bg-neutral-900/80 border border-amber-500/30 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Membresías Executive</span>
            <h2 className="text-xl font-black mt-1">Control de Socios VIP y Vencimientos</h2>
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
                      <td className="p-3 font-bold text-white">{vip.nombre_cliente}</td>
                      <td className="p-3 text-zinc-300 font-mono">{vip.telefono}</td>
                      <td className="p-3 text-amber-400">{vip.plan}</td>
                      <td className="p-3 text-zinc-300 font-mono">{vip.fecha_vencimiento}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.color}`}>
                          {status.texto}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleEnviarRecordatorioVIPWA(vip)}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
                          title="Enviar aviso por WhatsApp"
                        >
                          💬 WhatsApp
                        </button>
                        <button
                          onClick={() => handleRenovarMembresia(vip)}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer"
                          title="Renovar por 30 días"
                        >
                          🔄 Renovar
                        </button>
                        <button
                          onClick={() => handleEliminarMembresia(vip.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-2.5 py-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer"
                          title="Eliminar socio"
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

      {/* MODAL NUEVO SOCIO VIP */}
      {modalVIPOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-white">Registrar Nuevo Socio VIP</h3>
              <button 
                onClick={() => setModalVIPOpen(false)}
                className="text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleGuardarNuevoVIP} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={vipNombre}
                  onChange={(e) => setVipNombre(e.target.value)}
                  placeholder="Ej. Carlos Manuel"
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={vipTelefono}
                  onChange={(e) => setVipTelefono(e.target.value)}
                  placeholder="Ej. 8090000000"
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Seleccionar Plan</label>
                <select
                  value={vipPlan}
                  onChange={(e) => setVipPlan(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)">PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)</option>
                  <option value="PLAN VIP PREMIUM (RD$ 3,500/mes)">PLAN VIP PREMIUM (RD$ 3,500/mes)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  required
                  value={vipFechaInicio}
                  onChange={(e) => setVipFechaInicio(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-lg"
              >
                Guardar Suscripción VIP (Registra Ingreso en Caja)
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}