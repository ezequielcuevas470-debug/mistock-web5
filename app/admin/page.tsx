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

  const [productos, setProductos] = useState<readonly Producto[]>([]);
  const [citas, setCitas] = useState<readonly Cita[]>([]);
  const [transacciones, setTransacciones] = useState<readonly Transaccion[]>([]);
  const [membresias, setMembresias] = useState<readonly Membresia[]>([]);

  const [imgHero, setImgHero] = useState<string>('');
  const [imgBarbero, setImgBarbero] = useState<string>('');
  const [galeriaImgs, setGaleriaImgs] = useState<readonly string[]>([]);

  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoPrecio, setNuevoPrecio] = useState<string>('');
  const [nuevoStock, setNuevoStock] = useState<string>('');
  const [nuevaImg, setNuevaImg] = useState<string>('');
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('Fragancias');
  const [nuevoDesc, setNuevoDesc] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

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

  const [ingresoManual, setIngresoManual] = useState<string>('');
  const [conceptoIngreso, setConceptoIngreso] = useState<string>('');
  const [gastoManual, setGastoManual] = useState<string>('');
  const [conceptoGasto, setConceptoGasto] = useState<string>('');

  const [modalVIPOpen, setModalVIPOpen] = useState<boolean>(false);
  const [vipNombre, setVipNombre] = useState<string>('');
  const [vipTelefono, setVipTelefono] = useState<string>('');
  const [vipPlan, setVipPlan] = useState<string>('PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)');
  const [vipFechaInicio, setVipFechaInicio] = useState<string>(() => new Date().toISOString().split('T')[0]);

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
      console.error('Error sincronizando datos:', error);
    }
  }, []);

  useEffect(() => {
    if (estaAutenticado) {
      fetchDatosAdmin();
    }
  }, [estaAutenticado, fetchDatosAdmin]);

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

  const actualizarEstadoCita = async (id: number, nuevoEstado: string, precioServicioStr?: string) => {
    const { error: errorCita } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (errorCita) {
      alert(`Error al actualizar estado: ${errorCita.message}`);
      return;
    }

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
    if (!confirm('¿Desea eliminar esta cita?')) return;
    const { error } = await supabase.from('citas').delete().eq('id', id);
    if (!error) {
      setCitas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const obtenerEstadoPago = (fechaVencimientoStr: string): EstadoPago => {
    if (!fechaVencimientoStr) {
      return { texto: 'Sin Fecha', color: 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/50', dias: 0 };
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
        color: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/10',
        dias: diasRestantes,
      };
    } else if (diasRestantes <= 5) {
      return {
        texto: `Cobrar Hoy / ${diasRestantes}d`,
        color: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10',
        dias: diasRestantes,
      };
    } else {
      return {
        texto: `Al Día (${diasRestantes}d)`,
        color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10',
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
      alert('Error registrando socio VIP.');
    }
  };

  const handleRenovarMembresia = async (vip: Membresia) => {
    if (!confirm(`¿Confirmar renovación para ${vip.nombre_cliente}?`)) return;

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
      alert('¡Membresía renovada con éxito!');
      fetchDatosAdmin();
    }
  };

  const handleEnviarRecordatorioVIPWA = (vip: Membresia) => {
    const msg = `Hola *${vip.nombre_cliente}*, te saludamos de *OTRO FLOW BARBERSHOP* 💈 para recordarte tu membresía VIP (*${vip.plan}*). ¡Te esperamos!`;
    const telLimpio = vip.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${telLimpio}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEliminarMembresia = async (id: number) => {
    if (confirm('¿Eliminar membresía?')) {
      await supabase.from('membresias').delete().eq('id', id);
      fetchDatosAdmin();
    }
  };

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
    const imgDefault = nuevaImg.trim() !== '' ? nuevaImg : 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60';

    const { error } = await supabase.from('productos').insert([
      {
        nombre: nuevoNombre,
        precio: nuevoPrecio,
        stock: parseInt(nuevoStock, 10) || 0,
        img: imgDefault,
        categoria: nuevaCategoria,
        descripcion: nuevoDesc || 'Artículo exclusivo.',
      },
    ]);

    setCargando(false);
    if (!error) {
      alert('¡Producto agregado!');
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoStock('');
      setNuevaImg('');
      setNuevoDesc('');
      fetchDatosAdmin();
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
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
    }
  };

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

  if (cargandoAuth) {
    return (
      <main className="min-h-screen bg-[#030305] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-500/20"></div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-semibold">Cargando Sistema...</p>
        </div>
      </main>
    );
  }

  if (!estaAutenticado) {
    return (
      <main className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#030305] to-[#030305]">
        <section className="bg-[#0b0b0f]/90 border border-white/[0.08] p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/80 max-w-md w-full space-y-8 backdrop-blur-2xl">
          <header className="text-center space-y-3">
            <span className="text-amber-400 font-bold tracking-[0.25em] text-[10px] uppercase bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full shadow-inner">
              Acceso Exclusivo Gerencial
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-1 text-white">Otro Flow Pro</h1>
            <p className="text-xs text-zinc-400">Introduce tus credenciales para administrar el negocio.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor={usuarioId} className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2 ml-1">Usuario</label>
              <input
                id={usuarioId}
                type="text"
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder:text-zinc-600"
                placeholder="Nombre de usuario"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor={passwordId} className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2 ml-1">Contraseña</label>
              <input
                id={passwordId}
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder:text-zinc-600"
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] cursor-pointer shadow-xl shadow-amber-500/20 transition-all transform active:scale-[0.98]"
            >
              {isPending ? 'Verificando...' : 'Acceder al Panel 🚀'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030305] text-white p-6 md:p-12 max-w-7xl mx-auto space-y-12 selection:bg-amber-500 selection:text-black font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/20 via-[#030305] to-[#030305]">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-amber-400 font-extrabold tracking-[0.25em] text-[10px] uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Sistema Operativo Activo
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Otro Flow Barbershop
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-bold text-xs px-5 py-3 rounded-2xl border border-white/10 transition-all shadow-sm hover:border-white/20"
          >
            Ver Web Pública ↗
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs px-5 py-3 rounded-2xl border border-red-500/20 transition-all cursor-pointer shadow-sm"
          >
            Cerrar Sesión 🔒
          </button>
        </div>
      </header>

      {/* MÉTRICAS FINANCIERAS Y NEGOCIO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <article className="bg-[#09090d]/80 border border-white/[0.08] p-6 rounded-3xl shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <p className="text-zinc-400 text-[11px] font-extrabold uppercase tracking-wider">Ingresos Totales</p>
          <p className="text-3xl font-black text-emerald-400 mt-2 tracking-tight">${totalIngresos.toLocaleString()} <span className="text-sm font-bold text-emerald-500/80">RD$</span></p>
        </article>

        <article className="bg-[#09090d]/80 border border-white/[0.08] p-6 rounded-3xl shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
          <p className="text-zinc-400 text-[11px] font-extrabold uppercase tracking-wider">Egresos / Gastos</p>
          <p className="text-3xl font-black text-red-400 mt-2 tracking-tight">${totalGastos.toLocaleString()} <span className="text-sm font-bold text-red-500/80">RD$</span></p>
        </article>

        <article className="bg-gradient-to-br from-[#0b0b10] to-[#120d04] border border-amber-500/30 p-6 rounded-3xl shadow-xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <p className="text-amber-400 text-[11px] font-extrabold uppercase tracking-wider">Ganancia Neta</p>
          <p className="text-3xl font-black text-amber-400 mt-2 tracking-tight">${gananciaNeta.toLocaleString()} <span className="text-sm font-bold text-amber-500/80">RD$</span></p>
        </article>

        <article className="bg-[#09090d]/80 border border-white/[0.08] p-6 rounded-3xl shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          <p className="text-zinc-400 text-[11px] font-extrabold uppercase tracking-wider">Socios VIP Activos</p>
          <p className="text-3xl font-black text-white mt-2 tracking-tight">{membresias.length} <span className="text-sm font-bold text-zinc-400">miembros</span></p>
        </article>
      </section>

      {/* CAMBIAR FOTO HERO DESDE PC */}
      <section className="bg-[#09090d]/90 border border-amber-500/25 p-7 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Personalización Visual</span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">Cambiar Foto de Perfil (Hero)</h2>
          <p className="text-zinc-400 text-xs mt-1">Sube una imagen de alta calidad desde tu computadora para actualizar la portada del sitio web de forma instantánea.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#050507] border border-white/[0.08] p-6 rounded-3xl shadow-inner">
          <img 
            src={imgHero || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60'} 
            alt="Hero actual" 
            className="w-32 h-32 rounded-2xl object-cover border-2 border-white/10 shadow-lg bg-neutral-900" 
          />
          <div className="flex-1 w-full space-y-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-300">Seleccionar nueva foto desde PC:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const { data, error } = await supabase.storage
                  .from('media')
                  .upload(`hero-${Date.now()}.jpg`, file);

                if (error) {
                  alert("Error al subir la imagen: " + error.message);
                  return;
                }

                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(data.path);
                const newUrl = publicUrlData.publicUrl;

                await supabase.from('configuracion').upsert({ clave: 'img_hero', valor: newUrl });

                alert("¡Foto actualizada con éxito!");
                setImgHero(newUrl);
              }}
              className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-zinc-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-amber-500 file:text-neutral-950 file:font-black file:cursor-pointer hover:file:bg-amber-400 transition-all cursor-pointer shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* FINANZAS */}
      <section className="bg-[#09090d]/90 border border-emerald-500/25 p-7 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Control Financiero & Caja</span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">Registro de Ingresos y Egresos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={(e) => registrarTransaccion(e, 'ingreso')} className="bg-[#050507] border border-emerald-500/20 p-6 rounded-3xl space-y-4 shadow-inner">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Registrar Nuevo Ingreso
            </h3>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Concepto / Motivo</label>
              <input
                type="text"
                required
                placeholder="Ej. Venta de Perfume"
                value={conceptoIngreso}
                onChange={(e) => setConceptoIngreso(e.target.value)}
                className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-emerald-400 outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Monto (RD$)</label>
              <input
                type="number"
                required
                placeholder="Ej. 1500"
                value={ingresoManual}
                onChange={(e) => setIngresoManual(e.target.value)}
                className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-emerald-400 outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs py-4 rounded-2xl uppercase tracking-[0.15em] cursor-pointer shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]">
              Registrar Ingreso 💰
            </button>
          </form>

          <form onSubmit={(e) => registrarTransaccion(e, 'gasto')} className="bg-[#050507] border border-red-500/20 p-6 rounded-3xl space-y-4 shadow-inner">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span> Registrar Nuevo Gasto
            </h3>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Concepto / Gasto</label>
              <input
                type="text"
                required
                placeholder="Ej. Suministros o Alquiler"
                value={conceptoGasto}
                onChange={(e) => setConceptoGasto(e.target.value)}
                className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-red-400 outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Monto (RD$)</label>
              <input
                type="number"
                required
                placeholder="Ej. 800"
                value={gastoManual}
                onChange={(e) => setGastoManual(e.target.value)}
                className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-red-400 outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-neutral-950 font-black text-xs py-4 rounded-2xl uppercase tracking-[0.15em] cursor-pointer shadow-lg shadow-red-500/20 transition-all transform active:scale-[0.98]">
              Registrar Egreso 🧾
            </button>
          </form>
        </div>

        {transacciones.length > 0 && (
          <div className="overflow-x-auto max-h-96 rounded-2xl border border-white/10 shadow-inner">
            <table className="w-full text-left text-xs bg-[#050507]">
              <thead className="bg-[#0a0a0e] text-zinc-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transacciones.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        t.tipo === 'ingreso' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-zinc-200">{t.concepto}</td>
                    <td className={`p-4 font-black text-sm ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${t.monto.toLocaleString()} RD$
                    </td>
                    <td className="p-4 text-zinc-400 font-medium">{t.fecha}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => eliminarTransaccion(t.id)} className="text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition-all font-bold cursor-pointer border border-red-500/20">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SOCIOS VIP */}
      <section className="bg-[#09090d]/90 border border-amber-500/25 p-7 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Club Exclusivo</span>
            <h2 className="text-2xl font-black mt-2 tracking-tight">Gestión de Socios VIP & Membresías</h2>
          </div>
          <button onClick={() => setModalVIPOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs px-6 py-4 rounded-2xl uppercase tracking-[0.15em] cursor-pointer shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.98]">
            ✨ Registrar Nuevo Socio
          </button>
        </div>

        {membresias.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
            <table className="w-full text-left text-xs bg-[#050507]">
              <thead className="bg-[#0a0a0e] text-zinc-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Plan VIP</th>
                  <th className="p-4">Vencimiento</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {membresias.map((vip) => {
                  const estadoPago = obtenerEstadoPago(vip.fecha_vencimiento);
                  return (
                    <tr key={vip.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white text-sm">{vip.nombre_cliente}</td>
                      <td className="p-4 text-zinc-300 font-mono">{vip.telefono}</td>
                      <td className="p-4 text-amber-400 font-bold">{vip.plan}</td>
                      <td className="p-4 text-zinc-300 font-medium">{vip.fecha_vencimiento}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${estadoPago.color}`}>
                          {estadoPago.texto}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEnviarRecordatorioVIPWA(vip)} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all">
                          💬 WhatsApp
                        </button>
                        <button onClick={() => handleRenovarMembresia(vip)} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all">
                          🔄 Renovar
                        </button>
                        <button onClick={() => handleEliminarMembresia(vip.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl cursor-pointer transition-all">
                          🗑️
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

      {/* MODAL VIP */}
      {modalVIPOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0f] border border-amber-500/30 p-8 rounded-[2.5rem] max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">Membresías</span>
                <h3 className="text-xl font-black uppercase tracking-tight mt-1 text-white">Registrar Socio VIP</h3>
              </div>
              <button onClick={() => setModalVIPOpen(false)} className="text-zinc-400 bg-white/5 hover:bg-white/10 w-9 h-9 rounded-2xl flex items-center justify-center font-bold cursor-pointer border border-white/10">✕</button>
            </div>
            <form onSubmit={handleGuardarNuevoVIP} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Nombre Completo</label>
                <input type="text" required placeholder="Ej. Carlos Santana" value={vipNombre} onChange={(e) => setVipNombre(e.target.value)} className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Teléfono</label>
                <input type="text" required placeholder="809-000-0000" value={vipTelefono} onChange={(e) => setVipTelefono(e.target.value)} className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Plan VIP</label>
                <select value={vipPlan} onChange={(e) => setVipPlan(e.target.value)} className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none cursor-pointer">
                  <option value="PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)">PLAN INDIVIDUAL EXECUTIVE (RD$ 2,200/mes)</option>
                  <option value="PLAN ELITE DUO (RD$ 3,500/mes)">PLAN ELITE DUO (RD$ 3,500/mes)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Fecha de Inicio</label>
                <input type="date" required value={vipFechaInicio} onChange={(e) => setVipFechaInicio(e.target.value)} className="w-full bg-[#050507] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none cursor-pointer" />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-4 rounded-2xl uppercase tracking-[0.15em] cursor-pointer shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.98]">
                Guardar Suscripción VIP 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CITAS */}
      <section className="bg-[#09090d]/90 border border-white/[0.08] p-7 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-6">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Agenda y Turnos</span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">Gestión de Citas en Tiempo Real</h2>
        </div>

        {citas.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
            <table className="w-full text-left text-xs bg-[#050507]">
              <thead className="bg-[#0a0a0e] text-zinc-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Servicio</th>
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white text-sm">{cita.nombre_cliente}</td>
                    <td className="p-4 text-zinc-300 font-mono">{cita.telefono || 'N/D'}</td>
                    <td className="p-4">
                      <div className="font-bold text-zinc-200">{cita.servicio}</div>
                      <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Barbero: {cita.barbero}</div>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <div className="font-medium">{cita.fecha}</div>
                      <div className="text-amber-400 font-black mt-0.5">{cita.hora}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={cita.estado}
                        onChange={(e) => actualizarEstadoCita(cita.id, e.target.value, '1500')}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0e0e14] text-white border border-white/10 cursor-pointer shadow-sm hover:border-amber-400/50 transition-all"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Completada">Completada (Caja)</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => eliminarCita(cita.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-2 rounded-xl cursor-pointer transition-all font-bold">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* PRODUCTOS E INVENTARIO */}
      <section className="bg-[#09090d]/90 border border-white/[0.08] p-7 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Tienda & Store</span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">Inventario y Catálogo de Productos</h2>
        </div>

        <form onSubmit={handleCrearProducto} className="bg-[#050507] border border-white/[0.08] p-6 sm:p-8 rounded-[2rem] space-y-5 shadow-inner">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Agregar Nuevo Artículo al Inventario
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Nombre</label>
              <input type="text" required placeholder="Ej. Perfume Tom Ford" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Precio</label>
              <input type="text" required placeholder="RD$ 2,500" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Stock Inicial</label>
              <input type="number" required placeholder="10" value={nuevoStock} onChange={(e) => setNuevoStock(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Categoría</label>
              <select value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none cursor-pointer">
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">URL Imagen</label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={nuevaImg} onChange={(e) => setNuevaImg(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-amber-400 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={cargando} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-4 rounded-2xl uppercase tracking-[0.15em] cursor-pointer shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.98]">
            {cargando ? 'Guardando...' : 'Publicar Producto 🛍️'}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-[#050507] border border-white/[0.08] hover:border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between space-y-5 shadow-xl transition-all group">
              {editandoId === prod.id ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 mb-1 block">Nombre</label>
                    <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl p-3 text-xs text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 mb-1 block">Precio</label>
                      <input type="text" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl p-3 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 mb-1 block">Stock</label>
                      <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl p-3 text-xs text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 mb-1 block">Categoría</label>
                    <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl p-3 text-xs text-white cursor-pointer">
                      {categoriasDisponibles.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 mb-1 block">URL Imagen</label>
                    <input type="text" value={editImg} onChange={(e) => setEditImg(e.target.value)} className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl p-3 text-xs text-white" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => guardarEdicion(prod.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs py-3 rounded-xl cursor-pointer transition-all">Guardar</button>
                    <button onClick={() => setEditandoId(null)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-3 rounded-xl cursor-pointer transition-all">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <img src={prod.img} alt={prod.nombre} className="w-20 h-20 rounded-2xl object-cover border border-white/10 bg-neutral-900 shadow-md group-hover:scale-105 transition-transform" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        {prod.categoria || 'General'}
                      </span>
                      <h4 className="font-bold text-sm truncate text-white pt-1">{prod.nombre}</h4>
                      <p className="text-amber-400 font-black text-sm">{prod.precio}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <span className="text-zinc-400">Stock disponible: <strong className="text-white font-mono font-bold text-sm">{prod.stock}</strong></span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => actualizarStock(prod.id, -1)} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl font-bold cursor-pointer border border-white/10 transition-all flex items-center justify-center">-</button>
                      <button onClick={() => actualizarStock(prod.id, 1)} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl font-bold cursor-pointer border border-white/10 transition-all flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button onClick={() => iniciarEdicion(prod)} className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 text-xs font-bold py-2.5 rounded-2xl border border-white/10 cursor-pointer transition-all">✏️ Editar</button>
                    <button onClick={() => eliminarProducto(prod.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-4 py-2.5 rounded-2xl border border-red-500/20 cursor-pointer transition-all">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}