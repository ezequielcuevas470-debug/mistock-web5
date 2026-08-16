'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydqmwtwyiuogthqyxthj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW13dHd5aXVvZ3RocXl4dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTgxNTYsImV4cCI6MjA5OTk3NDE1Nn0.SbCzxMDdSr-_3iLCBxIsw8t-ZdCiN2FwVYNoAEo9L6k';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  precioAnterior?: string;
  img: string;
  stock: number;
  categoria?: string;
  exclusivo?: boolean;
  descripcion?: string;
  detalles?: string[];
}

// ⚙️ DATOS OFICIALES
const TELEFONO_BARBERIA = '8492844395';
const UBICACION_TIENDA = 'Villa Carmen, Santo Domingo Este, R.D.';

// --- ICONOS VECTORIALES REFINADOS ---
const IconTijeras = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0A3 3 0 104.879 4.879a3 3 0 004.242 4.242zm0 0L12 12m-7.121 7.121a3 3 0 104.242-4.242 3 3 0 00-4.242 4.242z" />
  </svg>
);

const IconBarba = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconNavaja = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconDomicilio = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconLocation = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconX = ({ className = "w-5 h-5 text-zinc-400" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconEye = ({ className = "w-4 h-4 text-[#e0b875]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [productoQuickView, setProductoQuickView] = useState<Producto | null>(null);

  // Configuración de la foto Hero
  const [fotoHero, setFotoHero] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80');

  // Formulario Reserva
  const [nombreReserva, setNombreReserva] = useState('');
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [servicioReserva, setServicioReserva] = useState('Corte Executive — RD$400');
  const [barberoReserva, setBarberoReserva] = useState('Ezequiel Cuevas (Master Barber)');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('10:00 AM');
  const [direccionDomicilio, setDireccionDomicilio] = useState('');

  const horariosDisponibles = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

  useEffect(() => {
    fetchProductosTienda();
    fetchConfiguracion();
  }, []);

  const fetchConfiguracion = async () => {
    try {
      const { data } = await supabase.from('configuracion').select('*');
      if (data && data.length > 0) {
        const configObj = data.reduce((acc: any, item: any) => {
          if (item.clave && item.valor) acc[item.clave] = item.valor;
          return acc;
        }, {});
        if (configObj.img_hero) setFotoHero(configObj.img_hero);
      }
    } catch (e) {
      console.error("Error al cargar configuración:", e);
    }
  };

  const fetchProductosTienda = async () => {
    try {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: false });

      if (data && data.length > 0) {
        setProductos(data);
      } else {
        setProductos([
          { 
            id: 1, 
            nombre: 'SNEAKERS URBAN FLOW LIMITED', 
            precio: 'RD$5,800', 
            precioAnterior: 'RD$6,500',
            img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80', 
            stock: 3, 
            categoria: 'Tenis', 
            exclusivo: true,
            descripcion: 'Edición limitada con suela ergonómica de amortiguación alta y acabado en piel nobuck con detalles dorados.'
          },
          { 
            id: 2, 
            nombre: 'GORRA EC BLACK EMBOSSED', 
            precio: 'RD$1,500', 
            img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80', 
            stock: 6, 
            categoria: 'Gorras', 
            exclusivo: true,
            descripcion: 'Diseño estructural de corona alta con bordado 3D en relieve mate e interior absorbente.'
          },
          { 
            id: 3, 
            nombre: 'SLIDES EXECUTIVE COMFORT', 
            precio: 'RD$2,200', 
            img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80', 
            stock: 5, 
            categoria: 'Sandalias', 
            exclusivo: false,
            descripcion: 'Chanclas de descanso ortopédicas de densidad dual, perfectas para después del entrenamiento o estancia casual.'
          },
          { 
            id: 4, 
            nombre: 'PERFUME DE AUTOR "EC" 50ML', 
            precio: 'RD$2,800', 
            img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80', 
            stock: 4, 
            categoria: 'Perfumes', 
            exclusivo: true,
            descripcion: 'Extracto de perfume intenso con notas de madera de cedro, ámbar gris, bergamota y fondo de cuero ahumado.'
          },
        ]);
      }
    } catch (err) {
      console.log('Usando productos por defecto.');
    }
  };

  const handleReservarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReserva || !telefonoReserva || !servicioReserva || !barberoReserva || !horaReserva || !fechaReserva) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const esDomicilio = servicioReserva.toLowerCase().includes('domicilio');
    if (esDomicilio && !direccionDomicilio) {
      alert('Por favor indica la dirección exacta para el servicio VIP a domicilio.');
      return;
    }

    try {
      await supabase.from('citas').insert([
        {
          nombre_cliente: nombreReserva,
          telefono: telefonoReserva,
          servicio: servicioReserva + (esDomicilio ? ` [Dir: ${direccionDomicilio}]` : ''),
          barbero: barberoReserva,
          fecha: fechaReserva,
          hora: horaReserva,
          estado: 'Pendiente'
        }
      ]);
    } catch (e) {
      console.error(e);
    }

    let mensaje = `*SOLICITUD DE RESERVA - EC BARBERSHOP*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Cliente:* ${nombreReserva}%0A` +
      `📞 *Teléfono:* ${telefonoReserva}%0A` +
      `✂️ *Servicio:* ${servicioReserva}%0A` +
      `💈 *Especialista:* ${barberoReserva}%0A` +
      `📅 *Fecha:* ${fechaReserva}%0A` +
      `⏰ *Hora Elegida:* ${horaReserva}`;

    if (esDomicilio) mensaje += `%0A🚗 *Dirección Domicilio:* ${direccionDomicilio}`;

    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
    setModalReservaOpen(false);
  };

  const handleSolicitarProducto = (prod: Producto) => {
    const mensaje = `*SOLICITUD STORE - EC BARBERSHOP*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `🛍️ *Artículo:* ${prod.nombre}%0A` +
      `💰 *Precio:* ${prod.precio}%0A` +
      `Hola, deseo consultar la disponibilidad y pedir este producto exclusivo.`;
    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
  };

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => {
        const catProducto = (p.categoria || '').trim().toLowerCase();
        const catActiva = categoriaActiva.trim().toLowerCase();
        return catProducto === catActiva;
      });

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-[#e0b875] selection:text-black relative overflow-x-hidden">
      
      {/* BARRA SUPERIOR DE ANUNCIOS */}
      <div className="bg-gradient-to-r from-[#0e0d0b] via-[#1c170e] to-[#0e0d0b] border-b border-[#e0b875]/20 py-2.5 px-4 text-center text-[10px] uppercase font-bold tracking-[0.25em] text-[#e0b875] flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>ABIERTO HOY EN VILLA CARMEN</span>
        </div>
        <span className="hidden sm:inline text-white/20">•</span>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <IconLocation className="w-3.5 h-3.5 text-[#e0b875]" />
          <span>{UBICACION_TIENDA}</span>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#070709]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <a href="#inicio" className="flex flex-col group">
            <span className="text-xl sm:text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#e0b875] to-amber-600 font-serif leading-none">
              EC BARBERSHOP
            </span>
            <span className="text-[8px] font-black tracking-[0.45em] text-zinc-500 uppercase mt-1 group-hover:text-[#e0b875] transition-colors">
              STUDIO & IMAGE
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-9 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
            <a href="#inicio" className="hover:text-[#e0b875] transition-colors">INICIO</a>
            <a href="#servicios" className="hover:text-[#e0b875] transition-colors">SERVICIOS</a>
            <a href="#store" className="hover:text-[#e0b875] transition-colors text-[#e0b875]">VAULT STORE</a>
            <a href="#ubicacion" className="hover:text-[#e0b875] transition-colors">UBICACIÓN</a>
          </nav>

          <button
            onClick={() => setModalReservaOpen(true)}
            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none shadow-lg shadow-amber-500/10"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-[#e0b875] to-amber-700 rounded-xl" />
            <div className="relative px-5 py-2.5 bg-[#0e0e12] rounded-[11px] transition-all duration-300 group-hover:bg-transparent">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b875] group-hover:text-black flex items-center gap-2">
                <IconCalendar className="w-3.5 h-3.5 text-current" />
                RESERVAR TURNO
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-32 relative z-10">

        {/* HERO SECTION */}
        <section id="inicio" className="relative rounded-3xl bg-gradient-to-br from-[#0c0c10] to-[#070709] border border-[#e0b875]/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center p-8 sm:p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e0b875]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e0b875]/30 bg-[#12100e] text-[9px] font-black tracking-[0.3em] text-[#e0b875] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e0b875]" />
              SANTO DOMINGO ESTE • VILLA CARMEN
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.92] font-serif text-white">
              EL ESTÁNDAR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#e0b875] to-amber-500">
                DE LA ELEGANCIA.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light tracking-wide">
            "Más que un corte, una experiencia de confianza. Bienvenidos a nuestro espacio
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => setModalReservaOpen(true)}
                className="bg-gradient-to-r from-[#e0b875] via-[#d4af37] to-[#aa833e] hover:opacity-95 text-black font-black text-xs px-9 py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_35px_rgba(224,184,117,0.25)] flex items-center gap-3"
              >
                <IconCalendar className="w-4 h-4 text-black" />
                <span>AGENDAR MI EXPERIENCIA</span>
              </button>
            </div>
          </div>

          {/* Imagen Hero */}
          <div className="lg:col-span-5 relative h-96 sm:h-[520px] rounded-2xl overflow-hidden border border-[#e0b875]/30 mt-10 lg:mt-0 shadow-2xl group">
            <img
              src={fotoHero}
              alt="EC Barbershop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-90 contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>
        </section>

        {/* SERVICIOS (MENÚ SIN FOTOS) */}
        <section id="servicios" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#e0b875] uppercase block">
                MENÚ DE TRATAMIENTOS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
                SERVICIOS DE AUTOR
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                titulo: 'CORTE EXECUTIVE',
                desc: 'Diseño personalizado según morfología craneal y estilo personal.',
                duracion: '45 MIN',
                precio: 'RD$400',
                icono: <IconTijeras />
              },
              {
                titulo: 'CORTE + BARBA ROYAL',
                desc: 'perfilado de barba y corte ejecutivo.',
                duracion: '60 MIN',
                precio: 'RD$650',
                icono: <IconBarba />
              },
              {
                titulo: 'PERFILADO Y TRATAMIENTO',
                desc: 'Alineación de barba a navaja.',
                duracion: '30 MIN',
                precio: 'RD$350',
                icono: <IconNavaja />
              },
              {
                titulo: 'SERVICIO A DOMICILIO VIP',
                desc: 'Llevamos el sillón executive y la experiencia completa a tu residencia u oficina.',
                duracion: 'PERSONALIZADO',
                precio: 'DESDE RD$1,000+',
                icono: <IconDomicilio />
              },
            ].map((serv, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setServicioReserva(`${serv.titulo} — ${serv.precio}`);
                  setModalReservaOpen(true);
                }}
                className="bg-[#0b0b0f] border border-white/10 hover:border-[#e0b875] rounded-3xl p-6 group cursor-pointer transition-all duration-500 shadow-xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(224,184,117,0.15)]"
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-[#e0b875]/40 flex items-center justify-center shadow-xl">
                      {serv.icono}
                    </div>
                    <span className="bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-mono px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1">
                      <IconClock className="w-3 h-3 text-[#e0b875]" />
                      {serv.duracion}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#e0b875] transition-colors">{serv.titulo}</h3>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{serv.desc}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-[#e0b875]">{serv.precio}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                    RESERVAR →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VAULT STORE / TIENDA */}
        <section id="store" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#e0b875] uppercase block">
                EXECUTIVE VAULT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
                EC PRIVATE STORE
              </h2>
            </div>

            {/* BOTONES DE CATEGORÍAS */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Tenis', 'Gorras', 'Sandalias', 'Perfumes', 'Ropa', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    categoriaActiva === cat
                      ? 'bg-[#e0b875] text-black border-[#e0b875] shadow-lg shadow-[#e0b875]/20'
                      : 'bg-[#0b0b0f] text-zinc-400 border-white/10 hover:border-[#e0b875]/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 italic border border-dashed border-white/10 rounded-3xl">
              No hay artículos disponibles en la categoría <span className="text-[#e0b875] font-bold">{categoriaActiva}</span> actualmente.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0b0b0f] border border-white/10 hover:border-[#e0b875]/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center">
                    <img
                      src={prod.img || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f'}
                      alt={prod.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <span className="absolute top-3 right-3 bg-black/85 backdrop-blur-md text-[9px] font-black px-3 py-1 rounded-full border border-white/10 text-zinc-300 uppercase tracking-widest">
                      STOCK: {prod.stock} UNID.
                    </span>

                    {prod.exclusivo && (
                      <span className="absolute top-3 left-3 bg-[#e0b875] text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                        VIP EXCLUSIVE
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setProductoQuickView(prod)}
                        className="bg-black/90 hover:bg-black text-white p-3 rounded-xl border border-white/20 transition-all shadow-lg"
                        title="Vista rápida"
                      >
                        <IconEye className="w-4 h-4 text-[#e0b875]" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold tracking-widest text-[#e0b875] uppercase">
                        {prod.categoria || 'GENERAL'}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-2 uppercase tracking-wide">{prod.nombre}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <span className="text-base font-black font-mono text-white block">
                          {prod.precio}
                        </span>
                        {prod.precioAnterior && (
                          <span className="text-[10px] text-zinc-500 line-through font-mono">
                            {prod.precioAnterior}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleSolicitarProducto(prod)}
                        className="bg-[#e0b875] hover:opacity-90 text-black font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow"
                      >
                        SOLICITAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UBICACIÓN DE LA TIENDA */}
        <section id="ubicacion" className="space-y-12">
          <div className="border-b border-white/10 pb-6 space-y-2">
            <span className="text-[9px] font-black tracking-[0.35em] text-[#e0b875] uppercase block">
              ENCUÉNTRANOS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
              UBICACIÓN DE LA TIENDA
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0b0b0f] border border-[#e0b875]/20 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12100e] border border-[#e0b875]/30 text-[9px] font-black tracking-widest text-[#e0b875] uppercase">
                  SANTO DOMINGO ESTE • VILLA CARMEN
                </div>
                <h3 className="text-2xl font-black text-white font-serif uppercase tracking-wide">
                  EC BARBERSHOP
                </h3>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Te esperamos en nuestra sede principal ubicada en Villa Carmen, Santo Domingo Este. Un espacio diseñado con un ambiente y atención preferencial.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-zinc-300">
                  <div className="mt-0.5 p-2 rounded-xl bg-black border border-white/10">
                    <IconLocation />
                  </div>
                  <div>
                    <strong className="text-white block uppercase tracking-wide text-[10px] text-[#e0b875]">Dirección Oficial:</strong>
                    <span>{UBICACION_TIENDA}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-zinc-300">
                  <div className="mt-0.5 p-2 rounded-xl bg-black border border-white/10">
                    <IconClock />
                  </div>
                  <div>
                    <strong className="text-white block uppercase tracking-wide text-[10px] text-[#e0b875]">Horario de Atención:</strong>
                    <span>Lunes a Sábado: 9:00 AM — 8:00 PM<br />Domingos: Previa Cita</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(UBICACION_TIENDA)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-black border border-[#e0b875]/40 text-[#e0b875] px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                >
                  <IconLocation className="w-4 h-4 text-[#e0b875]" />
                  <span>VER EN GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative bg-black">
              <iframe
                title="Ubicación Villa Carmen Santo Domingo Este"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.150!2d-69.835!3d18.515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea563!2sVilla+Carmen%2C+Santo+Domingo+Este!5e0!3m2!1ses!2sdo!4v1650000000000!5m2!1ses!2sdo"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#040406] py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#e0b875] to-amber-600 font-serif">
              EC BARBERSHOP
            </span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Executive Barbershop & Vault Store • Villa Carmen, S.D.E.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-light">
            © {new Date().getFullYear()} Ezequiel Cuevas. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href={`https://wa.me/${TELEFONO_BARBERIA}?text=Hola,%20quiero%20agendar%20una%20cita%20o%20consultar%20sobre%20los%20servicios%20de%20EC%20Barbershop.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        title="Escríbenos por WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* MODAL DE RESERVA */}
      {modalReservaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-[#e0b875]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalReservaOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-black border border-white/10 hover:border-[#e0b875] transition-colors"
            >
              <IconX />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#e0b875] uppercase">
                SISTEMA DE CITAS
              </span>
              <h3 className="text-xl font-black uppercase text-white font-serif tracking-wider">
                RESERVAR TU TURNO
              </h3>
            </div>

            <form onSubmit={handleReservarWhatsApp} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Tu Nombre</label>
                <input
                  type="text"
                  required
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  placeholder="Ej. Ezequiel Peña"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  placeholder="Ej. 8490000000"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Seleccionar Servicio</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                >
                  <option value="Corte Executive — RD$400">Corte Executive — RD$400</option>
                  <option value="Corte + Barba Royal — RD$650">Corte + Barba Royal — RD$650</option>
                  <option value="Perfilado y Tratamiento — RD$350">Perfilado y Tratamiento — RD$350</option>
                  <option value="Servicio a Domicilio VIP — DESDE RD$1,000+">Servicio a Domicilio VIP — DESDE RD$1,000+</option>
                </select>
              </div>

              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div className="space-y-1 bg-[#15120e] p-3.5 rounded-xl border border-[#e0b875]/30">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#e0b875] block">Dirección Exacta (Domicilio)</label>
                  <input
                    type="text"
                    required
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    placeholder="Calle, número, sector o referencia..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#e0b875] outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Barbero Especialista</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                >
                  <option value="Ezequiel Cuevas (Master Barber)">Ezequiel Cuevas (Master Barber)</option>
                  <option value="Cualquier Especialista Disponible">Cualquier Especialista Disponible</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Hora</label>
                  <select
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#e0b875] outline-none transition-colors"
                  >
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalReservaOpen(false)}
                  className="w-1/2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#e0b875] hover:opacity-90 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  ENVIAR A WHATSAPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISTA RÁPIDA DE PRODUCTOS */}
      {productoQuickView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-[#e0b875]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setProductoQuickView(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-black border border-white/10 hover:border-[#e0b875] transition-colors"
            >
              <IconX />
            </button>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-black border border-white/10">
              <img src={productoQuickView.img} alt={productoQuickView.nombre} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-black/85 text-[9px] font-black px-3 py-1 rounded-full text-zinc-300">
                STOCK: {productoQuickView.stock}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#e0b875] uppercase">
                {productoQuickView.categoria || 'GENERAL'}
              </span>
              <h3 className="text-lg font-black uppercase text-white font-serif">{productoQuickView.nombre}</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {productoQuickView.descripcion || 'Artículo exclusivo disponible en EC Barbershop Vault Store.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xl font-black font-mono text-[#e0b875]">{productoQuickView.precio}</span>
              <button
                onClick={() => {
                  handleSolicitarProducto(productoQuickView);
                  setProductoQuickView(null);
                }}
                className="bg-[#e0b875] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg"
              >
                SOLICITAR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}