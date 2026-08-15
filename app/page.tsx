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

// ⚙️ DATOS OFICIALES Y DATOS BANCARIOS PARA DEPÓSITO
const TELEFONO_BARBERIA = '8492844395';
const UBICACION_TIENDA = 'Hainamosa, C. Hermanas Mirabal, Santo Domingo Este';
const INFO_BANCO = 'Cuenta Corriente Popular #830947628 a nombre de Ezequiel Peña Cuevas';

// --- ICONOS VECTORIALES ---
const IconTijeras = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0A3 3 0 104.879 4.879a3 3 0 004.242 4.242zm0 0L12 12m-7.121 7.121a3 3 0 104.242-4.242 3 3 0 00-4.242 4.242z" />
  </svg>
);

const IconBarba = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconNavaja = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconDomicilio = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconLocation = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
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

const IconEye = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconPaperclip = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [modalMembresiaOpen, setModalMembresiaOpen] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('Plan 2');
  const [productoQuickView, setProductoQuickView] = useState<Producto | null>(null);

  const [fotoHero, setFotoHero] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80');

  // Formulario Reserva
  const [nombreReserva, setNombreReserva] = useState('');
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [servicioReserva, setServicioReserva] = useState('Corte Executive — RD$400');
  const [barberoReserva, setBarberoReserva] = useState('Ezequiel Cuevas (Master Barber)');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('10:00 AM');
  const [direccionDomicilio, setDireccionDomicilio] = useState('');

  // Formulario Membresía
  const [nombreMembresia, setNombreMembresia] = useState('');
  const [telefonoMembresia, setTelefonoMembresia] = useState('');
  const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');

  const horariosDisponibles = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

  const membresias = [
    {
      titulo: "Plan 1",
      precio: "RD$ 800",
      frecuencia: "Mensual",
      descripcion: "Ideal para mantener tu estilo fresco todo el mes.",
      beneficios: [
        "4 Cortes de pelo al mes",
        "Perfilado básico incluido",
        
      ],
      popular: false
    },
    {
      titulo: "Plan 2",
      precio: "RD$ 1,500",
      frecuencia: "Mensual",
      descripcion: "La opción preferida para el cuidado constante.",
      beneficios: [
        "5 Cortes de pelo al mes",
        "Perfilado de barba incluido",
        "5% de descuento en productos de la tienda",
        
      ],
      popular: true
    },
    {
      titulo: "Plan 3",
      precio: "RD$ 2,500",
      frecuencia: "Mensual",
      descripcion: "Exclusividad total para ti y un acompañante.",
      beneficios: [
        "Cortes ilimitados durante el mes completo",
        "Incluye 1 acompañante (hijo, hermano, primo, etc.)",
        "Acceso directo vía WhatsApp con tu barbero"
      ],
      popular: false
    }
  ];

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
            nombre: 'GORRA OTRO FLOW BLACK EMBOSSED', 
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
            nombre: 'PERFUME DE AUTOR "OTRO FLOW" 50ML', 
            precio: 'RD$2,800', 
            img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80', 
            stock: 4, 
            categoria: 'Perfumes', 
            exclusivo: true,
            descripcion: 'Extracto de perfume intenso con notas de madera de cedro, ámbar gris, bergarnota y fondo de cuero ahumado.'
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

    let mensaje = `*SOLICITUD DE RESERVA EXECUTIVE*%0A` +
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

  const handleRegistrarMembresia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreMembresia || !telefonoMembresia) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    try {
      await supabase.from('membresias').insert([
        {
          nombre_cliente: nombreMembresia,
          telefono: telefonoMembresia,
          plan: planSeleccionado,
          codigo_verificacion: codigoVerificacion || 'N/A',
          estado: 'Pendiente de Pago'
        }
      ]);
    } catch (e) {
      console.error(e);
    }

    let mensaje = `*SOLICITUD DE MEMBRESÍA VIP*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `👑 *Plan Elegido:* ${planSeleccionado}%0A` +
      `👤 *Cliente:* ${nombreMembresia}%0A` +
      `📞 *Teléfono:* ${telefonoMembresia}%0A`;

    if (codigoVerificacion) {
      mensaje += `🔐 *Código Comprobante:* ${codigoVerificacion}%0A`;
    }

    mensaje += `%0A📌 *Nota:* Ya realicé el depósito a la cuenta corriente Popular (#830947628) a nombre de Ezequiel Peña Cuevas. Envío mi comprobante de pago adjunto.`;

    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
    setModalMembresiaOpen(false);
    setNombreMembresia('');
    setTelefonoMembresia('');
    setArchivoComprobante(null);
    setCodigoVerificacion('');
  };

  const handleSolicitarProducto = (prod: Producto) => {
    const mensaje = `*SOLICITUD STORE - OTRO FLOW*%0A` +
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
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans selection:bg-[#c5a059] selection:text-black relative overflow-x-hidden">
      
      {/* BARRA SUPERIOR DE ANUNCIOS */}
      <div className="bg-gradient-to-r from-[#12100b] via-[#241c0e] to-[#12100b] border-b border-[#c5a059]/20 py-2.5 px-4 text-center text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>ABIERTO HOY EN HAINAMOSA</span>
        </div>
        <span className="hidden sm:inline text-white/20">•</span>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <IconLocation className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>{UBICACION_TIENDA}</span>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#030305]/85 backdrop-blur-xl border-b border-white/5 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <a href="#inicio" className="flex flex-col group">
            <span className="text-xl sm:text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#c5a059] to-amber-600 font-serif leading-none">
              OTRO FLOW
            </span>
            <span className="text-[8px] font-black tracking-[0.45em] text-zinc-500 uppercase mt-1 group-hover:text-[#c5a059] transition-colors">
              EXECUTIVE BARBERSHOP
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-9 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
            <a href="#inicio" className="hover:text-[#c5a059] transition-colors">INICIO</a>
            <a href="#servicios" className="hover:text-[#c5a059] transition-colors">SERVICIOS</a>
            <a href="#membresias" className="hover:text-[#c5a059] transition-colors">MEMBRESÍAS</a>
            <a href="#store" className="hover:text-[#c5a059] transition-colors text-[#c5a059]">VAULT STORE</a>
            <a href="#ubicacion" className="hover:text-[#c5a059] transition-colors">UBICACIÓN</a>
          </nav>

          <button
            onClick={() => setModalReservaOpen(true)}
            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-[#c5a059] to-amber-700 rounded-xl" />
            <div className="relative px-5 py-2.5 bg-[#0a0a0e] rounded-[11px] transition-all duration-300 group-hover:bg-transparent">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] group-hover:text-black flex items-center gap-2">
                <IconCalendar className="w-3.5 h-3.5 text-current" />
                RESERVAR TURNO
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-28 relative z-10">

        {/* HERO */}
        <section id="inicio" className="relative rounded-3xl bg-[#08080c] border border-[#c5a059]/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center p-8 sm:p-16 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c5a059]/30 bg-[#12100b] text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              HAINAMOSA • SANTO DOMINGO ESTE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.92] font-serif text-white">
              EL ESTÁNDAR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#c5a059] to-amber-500">
                DE LA ELEGANCIA.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light tracking-wide">
              Barbería ejecutiva de alto nivel en Hainamosa ({UBICACION_TIENDA}). Cuidado personal superior, ambiente exclusivo y atención personalizada por Ezequiel Cuevas.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => setModalReservaOpen(true)}
                className="bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6d3b] hover:opacity-95 text-black font-black text-xs px-9 py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_35px_rgba(197,160,89,0.3)] flex items-center gap-3 cursor-pointer"
              >
                <IconCalendar className="w-4 h-4 text-black" />
                <span>AGENDAR MI EXPERIENCIA</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-96 sm:h-[520px] rounded-2xl overflow-hidden border border-[#c5a059]/30 mt-10 lg:mt-0 shadow-2xl group">
            <img
              src={fotoHero}
              alt="Otro Flow Executive Barbering"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-90 contrast-[1.1]"
            />
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
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
                icono: <IconTijeras />,
                img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80'
              },
              {
                titulo: 'CORTE + BARBA ROYAL',
                duracion: '60 MIN',
                precio: 'RD$650',
                icono: <IconBarba />,
                img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'
              },
              {
                titulo: 'PERFILADO Y BARBA',
                desc: 'Alineación de barba .',
                duracion: '30 MIN',
                precio: 'RD$350',
                icono: <IconNavaja />,
                img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'
              },
              {
                titulo: 'SERVICIO A DOMICILIO VIP',
                desc: 'Llevamos el sillón executive y la experiencia completa a tu residencia u oficina.',
                duracion: 'PERSONALIZADO',
                precio: 'DESDE RD$1,000+',
                icono: <IconDomicilio />,
                img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80'
              },
            ].map((serv, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setServicioReserva(`${serv.titulo} — ${serv.precio}`);
                  setModalReservaOpen(true);
                }}
                className="bg-[#08080c] border border-white/10 hover:border-[#c5a059] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 shadow-xl flex flex-col justify-between hover:shadow-[0_0_25px_rgba(197,160,89,0.2)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={serv.img}
                    alt={serv.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a059]/40 flex items-center justify-center shadow-xl">
                    {serv.icono}
                  </div>

                  <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-mono px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                    <IconClock className="w-3 h-3 text-[#c5a059]" />
                    {serv.duracion}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#c5a059] transition-colors">{serv.titulo}</h3>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{serv.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-mono font-black text-[#c5a059]">{serv.precio}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                      RESERVAR →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN DE MEMBRESÍAS VIP */}
        <section id="membresias" className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[#c5a059] font-black tracking-[0.3em] text-[9px] uppercase bg-[#c5a059]/10 px-3 py-1 rounded-full border border-[#c5a059]/20">Exclusividad</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-wider uppercase font-serif">Planes de Membresía VIP</h2>
            <p className="text-zinc-400 text-xs max-w-md mx-auto font-light">Selecciona tu plan, realiza tu depósito bancario y envía tu comprobante para activar tu acceso inmediato.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membresias.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-[#08080c] border rounded-3xl p-8 flex flex-col justify-between shadow-xl transition-all ${
                  plan.popular ? 'border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.15)] bg-gradient-to-b from-[#12100b] to-[#08080c] scale-[1.02]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c5a059] text-black text-[9px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                    Más Solicitado
                  </span>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-wide text-white">{plan.titulo}</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-light">{plan.descripcion}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-[#c5a059]">{plan.precio}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ {plan.frecuencia}</span>
                  </div>

                  <hr className="border-white/10" />

                  <ul className="space-y-3 text-xs text-zinc-300">
                    {plan.beneficios.map((beneficio, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <span className="text-[#c5a059] font-bold">✓</span> <span className="font-light">{beneficio}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-zinc-400">
                    <span className="text-[#c5a059] font-bold block mb-0.5">💳 Cuenta de Depósito:</span>
                    {INFO_BANCO}
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => {
                      setPlanSeleccionado(plan.titulo);
                      setModalMembresiaOpen(true);
                    }}
                    className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                      plan.popular 
                        ? 'bg-[#c5a059] hover:opacity-90 text-black shadow-lg shadow-[#c5a059]/20' 
                        : 'bg-zinc-900 hover:bg-black text-white border border-white/10 hover:border-[#c5a059]/40'
                    }`}
                  >
                    Elegir Este Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VAULT STORE / TIENDA */}
        <section id="store" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
                EXECUTIVE VAULT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
                OTRO FLOW PRIVATE VAULT
              </h2>
            </div>

            {/* BOTONES DE CATEGORÍAS */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Tenis', 'Gorras', 'Sandalias', 'Perfumes', 'Ropa', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                    categoriaActiva === cat
                      ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-lg shadow-[#c5a059]/20'
                      : 'bg-[#08080c] text-zinc-400 border-white/10 hover:border-[#c5a059]/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 italic border border-dashed border-white/10 rounded-3xl">
              No hay artículos disponibles en la categoría <span className="text-[#c5a059] font-bold">{categoriaActiva}</span> actualmente.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#08080c] border border-white/10 hover:border-[#c5a059]/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300"
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
                      <span className="absolute top-3 left-3 bg-[#c5a059] text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                        VIP EXCLUSIVE
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setProductoQuickView(prod)}
                        className="bg-black/90 hover:bg-black text-white p-3 rounded-xl border border-white/20 transition-all shadow-lg cursor-pointer"
                        title="Vista rápida"
                      >
                        <IconEye className="w-4 h-4 text-[#c5a059]" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase block">{prod.categoria || 'Colección'}</span>
                      <h3 className="text-xs font-black uppercase tracking-wider text-white line-clamp-1">{prod.nombre}</h3>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono font-black text-[#c5a059]">{prod.precio}</span>
                      {prod.precioAnterior && (
                        <span className="text-xs font-mono text-zinc-500 line-through">{prod.precioAnterior}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleSolicitarProducto(prod)}
                      className="w-full bg-zinc-900 hover:bg-[#c5a059] hover:text-black border border-white/10 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Solicitar Artículo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UBICACIÓN Y CONTACTO */}
        <section id="ubicacion" className="space-y-10">
          <div className="bg-[#08080c] border border-white/10 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[#c5a059] font-black tracking-[0.3em] text-[9px] uppercase bg-[#c5a059]/10 px-3 py-1 rounded-full border border-[#c5a059]/20">Localización</span>
              <h2 className="text-3xl font-black uppercase tracking-wider font-serif">Visítanos en Hainamosa</h2>
              
              <div className="space-y-4 text-xs text-zinc-300 font-light">
                <p className="flex items-start gap-3">
                  <IconLocation className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span><strong>Dirección:</strong> {UBICACION_TIENDA}</span>
                </p>
                <p className="flex items-start gap-3">
                  <IconClock className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span><strong>Horario:</strong> Lunes a Sábado de 9:00 AM a 8:00 PM. Domingos 9:00 AM a 6:00.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-[#c5a059] font-bold text-base shrink-0">📞</span>
                  <span><strong>Teléfono / WhatsApp:</strong> +1 ({TELEFONO_BARBERIA.slice(0,3)}) {TELEFONO_BARBERIA.slice(3,6)}-{TELEFONO_BARBERIA.slice(6)}</span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setModalReservaOpen(true)}
                  className="bg-[#c5a059] hover:opacity-90 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#c5a059]/20"
                >
                  Reservar Mi Cita Ahora
                </button>
              </div>
            </div>

            <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                title="Mapa Ubicacion Hainamosa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.68412211915!2d-69.8315!3d18.5135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzQ4LjYiTiA2OWfCsDQ5JzUzLjQiVw!5e0!3m2!1ses!2sdo!4v1650000000000"
                className="w-full h-full border-0 filter contrast-125 invert hue-rotate-180"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#020204] border-t border-white/10 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-lg font-black tracking-[0.2em] text-[#c5a059] font-serif uppercase">OTRO FLOW</span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">Executive Barbershop • Hainamosa</p>
          </div>

          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Ezequiel Peña Cuevas. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODAL DE RESERVA DE CITAS */}
      {modalReservaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#08080c] border border-[#c5a059]/30 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalReservaOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <IconX />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase">SISTEMA DE CITAS VIP</span>
              <h3 className="text-xl font-black uppercase text-white font-serif">Reservar Tu Espacio</h3>
            </div>

            <form onSubmit={handleReservarWhatsApp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Martínez"
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 829-000-0000"
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Servicio Seleccionado *</label>
                  <select
                    value={servicioReserva}
                    onChange={(e) => setServicioReserva(e.target.value)}
                    className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                  >
                    <option value="Corte Executive — RD$400">Corte Executive — RD$400</option>
                    <option value="Corte + Barba Royal — RD$650">Corte + Barba Royal — RD$650</option>
                    <option value="Perfilado y Tratamiento — RD$350">Perfilado y Tratamiento — RD$350</option>
                    <option value="Servicio a Domicilio VIP — Desde RD$1,000+">Servicio a Domicilio VIP — Desde RD$1,000+</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Especialista *</label>
                  <select
                    value={barberoReserva}
                    onChange={(e) => setBarberoReserva(e.target.value)}
                    className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                  >
                    <option value="Ezequiel Cuevas (Master Barber)">Ezequiel Cuevas (Master Barber)</option>
                    <option value="Staff Otro Flow">Staff Otro Flow</option>
                  </select>
                </div>
              </div>

              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div className="space-y-1.5 bg-[#12100b] p-4 rounded-xl border border-[#c5a059]/30">
                  <label className="text-[#c5a059] font-bold uppercase tracking-wider text-[9px]">Dirección exacta para Domicilio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, número, sector o torre..."
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-white outline-none transition-all mt-1"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Hora Preferida *</label>
                  <select
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                  >
                    {horariosDisponibles.map((h, i) => (
                      <option key={i} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-[#c5a059] to-amber-700 hover:opacity-95 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  Confirmar Cita vía WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE INSCRIPCIÓN A MEMBRESÍA VIP */}
      {modalMembresiaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#08080c] border border-[#c5a059]/30 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMembresiaOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <IconX />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase">MEMBRESÍAS EXCLUSIVAS</span>
              <h3 className="text-xl font-black uppercase text-white font-serif">Suscribirse al {planSeleccionado}</h3>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-black/60 border border-[#c5a059]/20 space-y-2 text-xs">
              <span className="text-[#c5a059] font-bold block uppercase tracking-wider text-[10px]">Instrucciones de Pago:</span>
              <p className="text-zinc-300 font-light">Realiza el depósito correspondiente a:</p>
              <p className="font-mono font-bold text-white bg-white/5 p-2.5 rounded-xl border border-white/10">{INFO_BANCO}</p>
              <p className="text-[10px] text-zinc-400">Luego completa tus datos y envía tu comprobante por WhatsApp.</p>
            </div>

            <form onSubmit={handleRegistrarMembresia} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Gómez"
                  value={nombreMembresia}
                  onChange={(e) => setNombreMembresia(e.target.value)}
                  className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 829-000-0000"
                  value={telefonoMembresia}
                  onChange={(e) => setTelefonoMembresia(e.target.value)}
                  className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Número de Transferencia o Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej. Ref 984523 (Opcional)"
                  value={codigoVerificacion}
                  onChange={(e) => setCodigoVerificacion(e.target.value)}
                  className="w-full bg-[#030305] border border-white/10 focus:border-[#c5a059] rounded-xl p-3.5 text-white outline-none transition-all font-mono"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#c5a059] hover:opacity-90 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#c5a059]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconPaperclip className="w-4 h-4 text-black" />
                  <span>Enviar Comprobante vía WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VISTA RÁPIDA DE PRODUCTOS */}
      {productoQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#08080c] border border-white/10 w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <button
              onClick={() => setProductoQuickView(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <IconX />
            </button>

            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black border border-white/10">
              <img
                src={productoQuickView.img}
                alt={productoQuickView.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase bg-[#c5a059]/10 px-2.5 py-1 rounded-md border border-[#c5a059]/20">
                {productoQuickView.categoria || 'Vault Store'}
              </span>

              <h3 className="text-lg font-black uppercase text-white font-serif">{productoQuickView.nombre}</h3>

              <div className="flex items-baseline gap-3">
                <span className="text-xl font-mono font-black text-[#c5a059]">{productoQuickView.precio}</span>
                {productoQuickView.precioAnterior && (
                  <span className="text-sm font-mono text-zinc-500 line-through">{productoQuickView.precioAnterior}</span>
                )}
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {productoQuickView.descripcion || 'Artículo exclusivo seleccionado bajo altos estándares de calidad para complementar tu estilo urbano y ejecutivo.'}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    handleSolicitarProducto(productoQuickView);
                    setProductoQuickView(null);
                  }}
                  className="w-full bg-[#c5a059] hover:opacity-90 text-black font-black py-3.5 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-lg cursor-pointer"
                >
                  Pedir Este Artículo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}