'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Supabase
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

const TELEFONO_BARBERIA = '8492844395';

export default function Home() {
  // --- ESTADOS ---
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [estaAbierto, setEstaAbierto] = useState(false);

  // Campos Reserva
  const [nombreReserva, setNombreReserva] = useState('');
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [servicioReserva, setServicioReserva] = useState('');
  const [barberoReserva, setBarberoReserva] = useState('Ezequiel Cuevas (CEO & Master Barber)');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');
  const [direccionDomicilio, setDireccionDomicilio] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchProductosTienda();
    verificarHorario();
  }, []);

  const verificarHorario = () => {
    const horaActual = new Date().getHours();
    // Abierto todos los días de 9 AM a 7 PM (19:00)
    setEstaAbierto(horaActual >= 9 && horaActual < 19);
  };

  const fetchProductosTienda = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });
    setProductos(data || []);
  };

  // --- HANDLERS ---
  const handleReservarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReserva || !telefonoReserva || !servicioReserva || !barberoReserva || !horaReserva || !fechaReserva) {
      alert('Por favor completa todos los campos requeridos para la reserva.');
      return;
    }

    const esDomicilio = servicioReserva.toLowerCase().includes('domicilio');
    if (esDomicilio && !direccionDomicilio) {
      alert('Por favor ingresa la dirección exacta para el servicio a domicilio.');
      return;
    }

    // 1. Guardar cita en Supabase
    const { error } = await supabase.from('citas').insert([
      {
        nombre_cliente: nombreReserva,
        telefono: telefonoReserva,
        servicio: servicioReserva + (esDomicilio ? ` [Dirección: ${direccionDomicilio}]` : ''),
        barbero: barberoReserva,
        fecha: fechaReserva,
        hora: horaReserva,
        estado: 'Pendiente'
      }
    ]);

    if (error) {
      alert('Error al registrar la cita: ' + error.message);
      return;
    }

    // 2. Formatear y Enviar Mensaje a WhatsApp
    let mensaje = `¡Hola! 👋 Quiero confirmar una cita en *OTRO FLOW BARBERSHOP*:%0A%0A` +
      `👤 *Cliente:* ${nombreReserva}%0A` +
      `📞 *Teléfono:* ${telefonoReserva}%0A` +
      `✂️ *Servicio:* ${servicioReserva}%0A` +
      `💈 *Atendido por:* ${barberoReserva}%0A` +
      `📅 *Fecha:* ${fechaReserva}%0A` +
      `⏰ *Hora:* ${horaReserva}`;

    if (esDomicilio) {
      mensaje += `%0A🚗 *Dirección Domicilio:* ${direccionDomicilio}`;
    }

    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');

    // Limpiar Formulario
    setNombreReserva('');
    setTelefonoReserva('');
    setServicioReserva('');
    setDireccionDomicilio('');
    setHoraReserva('');
    setFechaReserva('');
  };

  const handleComprarWhatsApp = (prod: Producto) => {
    if (prod.stock <= 0) return;
    const mensaje = `¡Hola! 👋 Me interesa comprar este artículo de la tienda:%0A%0A- *Producto:* ${prod.nombre}%0A- *Precio:* ${prod.precio}%0A%0A¿Tienen disponibilidad?`;
    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
  };

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-[11px] font-black uppercase tracking-widest text-center py-2 px-4 flex items-center justify-center gap-3 shadow-md">
        <span>🚗 SERVICIO VIP A DOMICILIO DISPONIBLE</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">📅 ABIERTOS TODOS LOS DÍAS DE LA SEMANA (9 AM - 7 PM)</span>
      </div>

      {/* 2. BOTÓN FLOTANTE WHATSAPP */}
      <a
        href={`https://wa.me/${TELEFONO_BARBERIA}?text=¡Hola!%20Quiero%20información%20sobre%20sus%20servicios%20o%20servicio%20a%20domicilio%20en%20Otro%20Flow.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform hover:scale-110 flex items-center justify-center border border-emerald-400/50"
        title="Escríbenos directamente"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* 3. NAVBAR HEADER */}
      <header className="sticky top-0 z-40 bg-[#08080a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-amber-400 leading-none">OTRO FLOW</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase mt-0.5">PREMIUM BARBERSHOP</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest">
              <span className={`w-2 h-2 rounded-full ${estaAbierto ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-zinc-300 font-medium">
                {estaAbierto ? 'Abierto (Lunes a Domingo)' : 'Consultas vía WhatsApp'}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <a href="#inicio" className="hover:text-amber-400 transition-colors">Inicio</a>
            <a href="#boss" className="hover:text-amber-400 transition-colors">El Boss</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">Servicios</a>
            <a href="#reserva" className="hover:text-amber-400 transition-colors">Reservar Cita</a>
            <a href="#tienda" className="hover:text-amber-400 transition-colors">Tienda</a>
          </nav>

          <a
            href="#reserva"
            className="border border-amber-500/60 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 font-bold text-xs px-5 py-2.5 rounded-xl tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-500/10"
          >
            Reservar Cita
          </a>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* HERO SECTION */}
        <section id="inicio" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-sm">
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-amber-400 font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/5">
                ESTILO • PRECISIÓN • EXCLUSIVIDAD
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                🚗 Servicio a Domicilio
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none">
              MÁS QUE UN CORTE,<br />
              <span className="text-amber-400 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                UN ESTILO DE VIDA
              </span>
            </h1>
            
            <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
              En Otro Flow diseñamos tu imagen con estándares de alta barbería. Visítanos en nuestro local o solicita atención VIP en la comodidad de tu hogar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#reserva"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5"
              >
                <span>💬</span> RESERVAR CITA
              </a>
              <a
                href="#tienda"
                className="border border-amber-500/40 hover:border-amber-400 text-amber-400 hover:text-white font-bold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                <span>🛍️</span> EXPLORAR TIENDA
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80"
              alt="Otro Flow Barbershop VIP"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-80" />
          </div>
        </section>

        {/* SECCIÓN DEL BOSS (EZEQUIEL CUEVAS) */}
        <section id="boss" className="relative bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl">
                <img 
                  src="image_7fe6a0.jpg" 
                  alt="Ezequiel Cuevas" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-amber-300 whitespace-nowrap">
                👑 THE BOSS
              </span>
            </div>

            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">Ezequiel Cuevas</h3>
                  <p className="text-amber-400 font-extrabold text-xs tracking-widest uppercase mt-0.5">
                    Fundador • CEO & Master Barber
                  </p>
                </div>
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase self-center md:self-auto backdrop-blur-md">
                  ★ Atención Exclusiva Personalizada
                </span>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-light">
                Visionario y creador de la marca Otro Flow. Especialista en recortes de alta precisión, diseño urbano y perfilado VIP. Cada servicio es supervisado bajo sus estándares directos.
              </p>
            </div>

          </div>
        </section>

        {/* GRID PRINCIPAL: SERVICIOS - RESERVA - TIENDA */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLUMNA 1: SERVICIOS */}
          <div id="servicios" className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase text-amber-400 mb-4 flex items-center gap-2">
                NUESTROS SERVICIOS
              </h2>

              <ul className="space-y-3 text-xs font-semibold">
                {[
                  { icon: '✂️', nombre: 'CORTE PREMIUM', precio: 'RD$400' },
                  { icon: '💈', nombre: 'CORTE + BARBA VIP', precio: 'RD$650' },
                  { icon: '🪒', nombre: 'PERFILADO DE BARBA', precio: 'RD$300' },
                  { icon: '🎨', nombre: 'DISEÑO URBANO', precio: 'RD$200' },
                  { icon: '🧴', nombre: 'LAVADO & TRATAMIENTO', precio: 'RD$150' },
                  { icon: '🚗', nombre: 'SERVICIO A DOMICILIO VIP', precio: 'RD$1,000+' },
                ].map((s, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <span className="flex items-center gap-2 text-zinc-200">
                      <span>{s.icon}</span> {s.nombre}
                    </span>
                    <span className="text-amber-400 font-bold">{s.precio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-950/80 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <p className="text-xs font-bold text-white">¿Prefieres no desplazarte?</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Servicio VIP en tu hogar u oficina</p>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: FORMULARIO DE RESERVA */}
          <div id="reserva" className="bg-neutral-900/60 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl font-black uppercase text-amber-400 tracking-wider">RESERVA TU CITA</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">EN LOCAL O A DOMICILIO</p>
            </div>

            <form onSubmit={handleReservarWhatsApp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">NOMBRE</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Manuel"
                    value={nombreReserva}
                    onChange={(e) => setNombreReserva(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">WHATSAPP</label>
                  <input
                    type="tel"
                    placeholder="Ej. 8491234567"
                    value={telefonoReserva}
                    onChange={(e) => setTelefonoReserva(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">TIPO DE SERVICIO</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-amber-400 outline-none transition-all"
                  required
                >
                  <option value="" className="bg-neutral-900">Selecciona el servicio...</option>
                  <option value="Corte Premium (En Local)" className="bg-neutral-900">Corte Premium (En Local)</option>
                  <option value="Corte + Barba VIP (En Local)" className="bg-neutral-900">Corte + Barba VIP (En Local)</option>
                  <option value="Perfilado de Barba (En Local)" className="bg-neutral-900">Perfilado de Barba (En Local)</option>
                  <option value="Servicio A DOMICILIO (VIP)" className="bg-neutral-900">🚗 Servicio A DOMICILIO (VIP)</option>
                </select>
              </div>

              {/* DIRECCIÓN A DOMICILIO DINÁMICA */}
              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div className="animate-fadeIn">
                  <label className="block text-[10px] font-bold uppercase text-amber-400 mb-1">DIRECCIÓN EXACTA</label>
                  <input
                    type="text"
                    placeholder="Ej. Calle 3 #15, Ensanche Ozama"
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    className="w-full bg-neutral-950 border border-amber-500/60 rounded-xl p-3 text-white focus:border-amber-400 outline-none transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">SELECCIONAR BARBERO</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-amber-400 outline-none transition-all"
                  required
                >
                  <option value="Ezequiel Cuevas (CEO & Master Barber)" className="bg-neutral-900">👑 Ezequiel Cuevas (The Boss)</option>
                  <option value="Barbero Certificado Disponible" className="bg-neutral-900">Barbero Certificado Disponible</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">FECHA</label>
                  <input
                    type="date"
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-amber-400 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">HORA</label>
                  <input
                    type="time"
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-amber-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-4 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 mt-4 transform hover:-translate-y-0.5"
              >
                <span>💬</span> CONFIRMAR CITA POR WHATSAPP
              </button>
            </form>
          </div>

          {/* COLUMNA 3: EXCLUSIVE SHOP */}
          <div id="tienda" className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase text-amber-400 mb-1">EXCLUSIVE SHOP</h2>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mb-3">Productos seleccionados para tu cuidado personal.</p>

              {/* Filtro Categorías */}
              <div className="flex flex-wrap gap-1 mb-4">
                {['Todos', 'Ceras', 'Ropa', 'Accesorios'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                      categoriaActiva === cat 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-neutral-950 border border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Productos */}
              {productosFiltrados.length === 0 ? (
                <div className="bg-neutral-950/50 border border-white/5 p-6 rounded-2xl text-center text-zinc-500 text-xs font-light">
                  Actualizando catálogo...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                  {productosFiltrados.map((prod) => {
                    const sinStock = prod.stock <= 0;
                    return (
                      <div key={prod.id} className="bg-neutral-950 border border-white/5 rounded-2xl p-2 text-center space-y-2 group">
                        <div className="h-20 rounded-xl overflow-hidden bg-neutral-900 relative">
                          <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          {sinStock && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                              <span className="text-[8px] font-bold uppercase text-red-400 tracking-wider">Agotado</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white truncate">{prod.nombre}</p>
                          <p className="text-[10px] font-black text-amber-400">{prod.precio}</p>
                        </div>
                        <button
                          onClick={() => handleComprarWhatsApp(prod)}
                          disabled={sinStock}
                          className={`w-full p-1.5 rounded-lg text-[9px] font-bold uppercase transition-colors flex items-center justify-center gap-1 ${
                            sinStock 
                              ? 'bg-neutral-900 text-zinc-600 cursor-not-allowed' 
                              : 'bg-neutral-900 hover:bg-amber-500 hover:text-black border border-white/10 text-zinc-200'
                          }`}
                        >
                          🛒 {sinStock ? 'Sin Stock' : 'Adquirir'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="#tienda"
              className="w-full text-center border border-amber-500/40 hover:bg-amber-500 hover:text-black text-amber-400 font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition-all block"
            >
              VER TODOS LOS PRODUCTOS
            </a>
          </div>

        </section>

        {/* GALERÍA DE TRABAJOS Y DETALLES */}
        <section id="contacto" className="space-y-6 border-t border-white/5 pt-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">GALERÍA DE ESTILOS</span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=400&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80"
            ].map((img, i) => (
              <div key={i} className="h-28 rounded-2xl overflow-hidden border border-white/10 group">
                <img src={img} alt={`Corte ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-900/30 border border-white/5 p-6 rounded-3xl text-xs">
            <div className="space-y-2">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider">HORARIOS DE ATENCIÓN</h3>
              <p className="text-emerald-400 font-bold uppercase">📅 ABIERTOS LOS 7 DÍAS</p>
              <p className="text-zinc-300"><strong className="text-white">LUNES - DOMINGO:</strong> 9:00 AM - 7:00 PM</p>
              <p className="text-zinc-400 text-[10px]">Citas presenciales y a domicilio.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider">CONTACTO Y UBICACIÓN</h3>
              <p className="text-zinc-300">📞 849-284-4395</p>
              <p className="text-zinc-300">📍 Santo Domingo Este, RD</p>
              <a 
                href="https://www.instagram.com/eezek1/?hl=es" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline block"
              >
                📷 Instagram: @eezek1
              </a>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider">MARCA OFICIAL</h3>
              <p className="text-zinc-400 text-[11px]">
                Liderado por <strong className="text-white">Ezequiel Cuevas</strong>. Elevando la estética masculina en RD con atención directa en local y a domicilio.
              </p>
              <div className="flex gap-3 text-base pt-1">
                <a href="https://www.instagram.com/eezek1/?hl=es" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-neutral-950 border border-white/10 flex items-center justify-center hover:text-amber-400 transition-colors">📸</a>
                <a href={`https://wa.me/${TELEFONO_BARBERIA}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-neutral-950 border border-white/10 flex items-center justify-center hover:text-amber-400 transition-colors">💬</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-6 text-center text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
        © 2026 OTRO FLOW BARBERSHOP • EZEQUIEL CUEVAS. TODOS LOS DERECHOS RESERVADOS.
      </footer>

    </div>
  );
}