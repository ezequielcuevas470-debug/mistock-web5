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

const TELEFONO_BARBERIA = '8492844395';

const DATOS_BANCO = {
  banco: 'Banco Popular Dominicano',
  tipoCuenta: 'Cuenta de Ahorros',
  numeroCuenta: '830947628',
  titular: 'Ezequiel Cuevas',
};

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

const IconCheck = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCopy = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconWhatsApp = ({ className = "w-6 h-6 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
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

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  // Categoría activa inicializada en 'Todos'
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [modalMembresiaOpen, setModalMembresiaOpen] = useState(false);
  const [productoQuickView, setProductoQuickView] = useState<Producto | null>(null);

  const [modalidadMembresia, setModalidadMembresia] = useState<'mensual' | 'anual'>('mensual');
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
  const [planMembresia, setPlanMembresia] = useState<'individual' | 'duo'>('individual');
  const [nombreMembresia, setNombreMembresia] = useState('');
  const [telefonoMembresia, setTelefonoMembresia] = useState('');
  const [copiadoCuenta, setCopiadoCuenta] = useState(false);

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
            nombre: 'PERFUME DE AUTOR "OTRO FLOW" 50ML', 
            precio: 'RD$2,800', 
            img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80', 
            stock: 4, 
            categoria: 'Fragancias', 
            exclusivo: true,
            descripcion: 'Extracto de perfume intenso con notas de madera de cedro, ámbar gris, bergamota y fondo de cuero ahumado.',
            detalles: ['Duración superior a 12 horas', 'Envase de cristal soplado oscuro']
          },
          { 
            id: 2, 
            nombre: 'CERA MATTE HOLD EXTREME', 
            precio: 'RD$600', 
            img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80', 
            stock: 10, 
            categoria: 'Ceras', 
            exclusivo: false,
            descripcion: 'Cera modeladora con acabado totalmente mate y fijación fuerte de larga duración.',
            detalles: ['Base de agua', 'Fácil lavado']
          }
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

  const handleSolicitarMembresiaWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreMembresia || !telefonoMembresia) {
      alert('Por favor completa tu nombre y número de teléfono.');
      return;
    }

    const fechaInicio = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaInicio.getDate() + (modalidadMembresia === 'anual' ? 365 : 30));

    const inicioFmt = fechaInicio.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const vencimientoFmt = fechaVencimiento.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const precioInd = modalidadMembresia === 'anual' ? 'RD$ 22,440/año (15% OFF)' : 'RD$ 2,200/mes';
    const precioDuo = modalidadMembresia === 'anual' ? 'RD$ 40,800/año (15% OFF)' : 'RD$ 4,000/mes';

    const nombrePlanTxt = planMembresia === 'individual' 
      ? `PLAN INDIVIDUAL EXECUTIVE (${precioInd})` 
      : `PLAN EXECUTIVE DUO (${precioDuo})`;

    try {
      await supabase.from('membresias').insert([
        {
          nombre_cliente: nombreMembresia,
          telefono: telefonoMembresia,
          plan: nombrePlanTxt,
          metodo_pago: 'Transferencia Banco Popular',
          fecha_inicio: inicioFmt,
          fecha_vencimiento: vencimientoFmt,
          estado: 'Pendiente Comprobante'
        }
      ]);
    } catch (err) {
      console.log('Error registrando membresía:', err);
    }

    const mensaje = `*NUEVA MEMBRESÍA VIP — OTRO FLOW*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Socio:* ${nombreMembresia}%0A` +
      `📞 *Teléfono:* ${telefonoMembresia}%0A` +
      `💳 *Plan:* ${nombrePlanTxt}%0A` +
      `🏦 *Método:* Transferencia Banco Popular (${DATOS_BANCO.numeroCuenta})%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `📅 *Fecha de Inicio:* ${inicioFmt}%0A` +
      `⌛ *FECHA DE VENCIMIENTO:* ${vencimientoFmt}%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `Adjunto aquí mi comprobante de transferencia bancaria para activar mi plan.`;

    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
    setModalMembresiaOpen(false);
  };

  const handleSolicitarProducto = (prod: Producto) => {
    const mensaje = `*SOLICITUD STORE - OTRO FLOW*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `🛍️ *Artículo:* ${prod.nombre}%0A` +
      `💰 *Precio:* ${prod.precio}%0A` +
      `Hola, deseo consultar la disponibilidad y pedir este producto exclusivo.`;
    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
  };

  const copiarNumeroCuenta = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(DATOS_BANCO.numeroCuenta);
      setCopiadoCuenta(true);
      setTimeout(() => setCopiadoCuenta(false), 2500);
    }
  };

  // Filtrado sincronizado con las categorías reales de la base de datos y del panel
  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => (p.categoria || '').trim().toLowerCase() === categoriaActiva.trim().toLowerCase());

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans selection:bg-[#c5a059] selection:text-black relative overflow-x-hidden">
      
      {/* BARRA SUPERIOR DE ANUNCIOS */}
      <div className="bg-gradient-to-r from-[#12100b] via-[#241c0e] to-[#12100b] border-b border-[#c5a059]/20 py-2 px-4 text-center text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] flex items-center justify-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>ABIERTO HOY — RESERVAS Y SERVICIO A DOMICILIO VIP</span>
      </div>

      {/* NAVBAR GLASSMORPHISM */}
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
            <a href="#club" className="hover:text-[#c5a059] transition-colors">MEMBRESÍAS VIP</a>
            <a href="#store" className="hover:text-[#c5a059] transition-colors text-[#c5a059]">VAULT STORE</a>
            <a href="#ubicacion" className="hover:text-[#c5a059] transition-colors">UBICACIÓN</a>
          </nav>

          <button
            onClick={() => setModalReservaOpen(true)}
            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
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
              SANTO DOMINGO • BARBERING ELITE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.92] font-serif text-white">
              EL ESTÁNDAR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#c5a059] to-amber-500">
                DE LA ELEGANCIA.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light tracking-wide">
              Barbería ejecutiva de alto nivel en Piantini. Cuidado personal superior, ambiente exclusivo con bebidas de cortesía y atención personalizada por Ezequiel Cuevas.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => setModalReservaOpen(true)}
                className="bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6d3b] hover:opacity-95 text-black font-black text-xs px-9 py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_35px_rgba(197,160,89,0.3)] flex items-center gap-3"
              >
                <IconCalendar className="w-4 h-4 text-black" />
                <span>AGENDAR MI EXPERIENCIA</span>
              </button>

              <a
                href="#servicios"
                className="text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-[#c5a059] transition-colors flex items-center gap-3 group"
              >
                <span className="w-8 h-[1px] bg-zinc-700 group-hover:bg-[#c5a059] group-hover:w-12 transition-all" />
                EXPLORAR TRATAMIENTOS
              </a>
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
                desc: 'Experiencia completa de ritual facial, perfilado de barba y corte ejecutivo.',
                duracion: '60 MIN',
                precio: 'RD$650',
                icono: <IconBarba />,
                img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'
              },
              {
                titulo: 'PERFILADO Y TRATAMIENTO',
                desc: 'Alineación de barba a navaja con toalla vaporizada y bálsamos nutritivos.',
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
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a059]/40 flex items-center justify-center shadow-xl">
                    {serv.icono}
                  </div>
                  <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-mono px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                    <IconClock className="w-3 h-3 text-[#c5a059]" />
                    {serv.duracion}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#c5a059] transition-colors">{serv.titulo}</h3>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{serv.desc}</p>
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

        {/* VAULT STORE / TIENDA CON CATEGORÍAS SINCRONIZADAS AL PANEL */}
        <section id="store" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
                EXECUTIVE VAULT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
                OTRO FLOW STORE
              </h2>
            </div>
            
            {/* Categorías sincronizadas exactamente con el panel de administración */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Fragancias', 'Ceras', 'Ropa', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    categoriaActiva === cat
                      ? 'bg-[#c5a059] text-black shadow-[0_0_20px_rgba(197,160,89,0.4)]'
                      : 'bg-[#0f0f14] text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#08080c] border border-white/10 hover:border-[#c5a059]/60 rounded-2xl overflow-hidden group flex flex-col justify-between shadow-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]"
              >
                <div className="relative h-64 overflow-hidden bg-zinc-900">
                  <img
                    src={prod.img}
                    alt={prod.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  {prod.exclusivo && (
                    <span className="absolute top-3 left-3 bg-[#c5a059] text-black text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-widest shadow-lg">
                      EXCLUSIVO
                    </span>
                  )}
                  <button
                    onClick={() => setProductoQuickView(prod)}
                    className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#c5a059] hover:text-black text-white p-2.5 rounded-xl backdrop-blur-md transition-all shadow-xl"
                    title="Vista rápida"
                  >
                    <IconEye className="w-4 h-4 text-current" />
                  </button>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase block">{prod.categoria || 'Vault'}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#c5a059] transition-colors">{prod.nombre}</h3>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-base font-mono font-black text-white">{prod.precio}</span>
                      {prod.precioAnterior && (
                        <span className="text-xs font-mono text-zinc-500 line-through">{prod.precioAnterior}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSolicitarProducto(prod)}
                    className="w-full bg-[#12100b] hover:bg-[#c5a059] text-[#c5a059] hover:text-black border border-[#c5a059]/30 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <IconWhatsApp className="w-4 h-4" />
                    <span>CONSULTAR / PEDIR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CLUB / MEMBRESÍAS VIP */}
        <section id="club" className="relative rounded-3xl bg-gradient-to-br from-[#12100b] via-[#08080c] to-[#040406] border border-[#c5a059]/30 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a059]/30 bg-[#0a0a0e] text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase">
              CLUB PRIVADO EXECUTIVO
            </span>

            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif tracking-wider">
              MEMBRESÍAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#c5a059] to-amber-600">VIP OTRO FLOW</span>
            </h2>

            <div className="inline-flex bg-[#050508] p-1.5 rounded-xl border border-white/10 gap-2">
              <button
                onClick={() => setModalidadMembresia('mensual')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  modalidadMembresia === 'mensual'
                    ? 'bg-[#c5a059] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Plan Mensual
              </button>
              <button
                onClick={() => setModalidadMembresia('anual')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  modalidadMembresia === 'anual'
                    ? 'bg-[#c5a059] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Plan Anual (15% OFF ⭐)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-left">
              <div className="bg-[#050508]/80 backdrop-blur-xl border border-white/10 hover:border-[#c5a059] rounded-2xl p-6 space-y-6 flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">INDIVIDUAL EXECUTIVE</h3>
                  <div className="text-3xl font-mono font-black text-white">
                    {modalidadMembresia === 'anual' ? 'RD$22,440' : 'RD$2,200'}
                    <span className="text-xs text-zinc-500 font-sans font-normal"> / {modalidadMembresia === 'anual' ? 'año' : 'mes'}</span>
                  </div>
                  <ul className="space-y-3 text-xs text-zinc-300 font-light">
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> Cortes y perfilados ilimitados</li>
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> Prioridad absoluta en agenda WhatsApp</li>
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> 15% de descuento en Vault Store</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setPlanMembresia('individual');
                    setModalMembresiaOpen(true);
                  }}
                  className="w-full bg-[#c5a059] hover:bg-amber-400 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  SUSCRIBIRME AL PLAN INDIVIDUAL
                </button>
              </div>

              <div className="bg-[#050508]/80 backdrop-blur-xl border border-[#c5a059]/40 hover:border-[#c5a059] rounded-2xl p-6 space-y-6 flex flex-col justify-between transition-all shadow-[0_0_30px_rgba(197,160,89,0.15)]">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[#c5a059] uppercase tracking-wider">EXECUTIVE DUO</h3>
                  <div className="text-3xl font-mono font-black text-white">
                    {modalidadMembresia === 'anual' ? 'RD$40,800' : 'RD$4,000'}
                    <span className="text-xs text-zinc-500 font-sans font-normal"> / {modalidadMembresia === 'anual' ? 'año' : 'mes'}</span>
                  </div>
                  <ul className="space-y-3 text-xs text-zinc-300 font-light">
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> Beneficios para 2 personas</li>
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> Cortes y perfilados ilimitados ambos</li>
                    <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-[#c5a059]" /> 20% de descuento en Vault Store</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setPlanMembresia('duo');
                    setModalMembresiaOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 via-[#c5a059] to-amber-600 hover:opacity-95 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  SUSCRIBIRME AL PLAN DUO
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* UBICACIÓN & CONTACTO */}
        <section id="ubicacion" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 bg-[#08080c] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
                UBICACIÓN & HORARIOS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-serif tracking-wider">
                VISÍTANOS EN PIANTINI
              </h2>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-zinc-300">
                <IconMapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Dirección Principal:</strong>
                  <span>Av. Winston Churchill #105, Piantini, Santo Domingo, D.R.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-zinc-300">
                <IconClock className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Horario de Atención:</strong>
                  <span>Lunes a Sábado: 09:00 AM — 08:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-white/10 min-h-[350px] shadow-xl relative">
            <iframe
              title="Ubicación Otro Flow Executive Barbershop"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.34123456789!2d-69.9387!3d18.4821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI4JzU2LjQiTiA2OWKwNTfnMjguMyJX!5e0!3m2!1ses!2sdo!4v1650000000000!5m2!1ses!2sdo"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020204] mt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-lg font-black tracking-[0.2em] text-[#c5a059] font-serif uppercase">
              OTRO FLOW EXECUTIVE BARBERING
            </span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
              © 2026 Ezequiel Cuevas. Todos los derechos reservados. Santo Domingo, D.R.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL RESERVA */}
      {modalReservaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0e] border border-[#c5a059]/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalReservaOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <IconX className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase">EXECUTIVE BOOKING</span>
              <h3 className="text-xl font-black text-white uppercase font-serif">RESERVAR TU TURNO</h3>
            </div>
            <form onSubmit={handleReservarWhatsApp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Número de Teléfono</label>
                <input
                  type="tel"
                  required
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  placeholder="Ej. 8490000000"
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Servicio Seleccionado</label>
                  <select
                    value={servicioReserva}
                    onChange={(e) => setServicioReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                  >
                    <option value="Corte Executive — RD$400">Corte Executive — RD$400</option>
                    <option value="Corte + Barba Royal — RD$650">Corte + Barba Royal — RD$650</option>
                    <option value="Perfilado y Tratamiento — RD$350">Perfilado y Tratamiento — RD$350</option>
                    <option value="Servicio a Domicilio VIP — Desde RD$1,000+">Servicio a Domicilio VIP — Desde RD$1,000+</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Especialista</label>
                  <select
                    value={barberoReserva}
                    onChange={(e) => setBarberoReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                  >
                    <option value="Ezequiel Cuevas (Master Barber)">Ezequiel Cuevas (Master Barber)</option>
                    <option value="Junior Barber (Senior Stylist)">Junior Barber (Senior Stylist)</option>
                  </select>
                </div>
              </div>
              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#c5a059]">Dirección Exacta (Domicilio VIP)</label>
                  <input
                    type="text"
                    required
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    placeholder="Torre, Calle, Sector en Santo Domingo"
                    className="w-full bg-[#12100b] border border-[#c5a059]/40 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Fecha de Cita</label>
                  <input
                    type="date"
                    required
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Hora Preferida</label>
                  <select
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                  >
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-[#c5a059] to-amber-600 hover:opacity-95 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                <IconWhatsApp className="w-4 h-4 fill-current" />
                <span>CONFIRMAR CITA POR WHATSAPP</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MEMBRESÍA */}
      {modalMembresiaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0e] border border-[#c5a059]/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMembresiaOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <IconX className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase">ACTIVACIÓN DE MEMBRESÍA</span>
              <h3 className="text-xl font-black text-white uppercase font-serif">DATOS DE PAGO BANCARIO</h3>
            </div>
            <div className="bg-[#12100b] border border-[#c5a059]/30 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Banco:</span>
                <strong className="text-white">{DATOS_BANCO.banco}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Tipo de Cuenta:</span>
                <strong className="text-white">{DATOS_BANCO.tipoCuenta}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Titular:</span>
                <strong className="text-white">{DATOS_BANCO.titular}</strong>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-400 block">Número de Cuenta:</span>
                  <strong className="text-sm font-mono text-[#c5a059]">{DATOS_BANCO.numeroCuenta}</strong>
                </div>
                <button
                  onClick={copiarNumeroCuenta}
                  className="bg-black/60 hover:bg-[#c5a059] hover:text-black text-zinc-300 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border border-white/10"
                >
                  <IconCopy />
                  <span>{copiadoCuenta ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
            <form onSubmit={handleSolicitarMembresiaWhatsApp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Tu Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nombreMembresia}
                  onChange={(e) => setNombreMembresia(e.target.value)}
                  placeholder="Ej. Roberto Almonte"
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Tu Número de Teléfono</label>
                <input
                  type="tel"
                  required
                  value={telefonoMembresia}
                  onChange={(e) => setTelefonoMembresia(e.target.value)}
                  placeholder="Ej. 8490000000"
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-[#c5a059] to-amber-600 hover:opacity-95 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <IconWhatsApp className="w-4 h-4 fill-current" />
                <span>ENVIAR COMPROBANTE POR WHATSAPP</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUICK VIEW PRODUCTO */}
      {productoQuickView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0e] border border-[#c5a059]/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductoQuickView(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <IconX className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="rounded-2xl overflow-hidden h-64 border border-white/10 bg-zinc-900">
                <img src={productoQuickView.img} alt={productoQuickView.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-widest text-[#c5a059] uppercase">{productoQuickView.categoria || 'VAULT EXCLUSIVE'}</span>
                <h3 className="text-lg font-black text-white uppercase">{productoQuickView.nombre}</h3>
                <div className="text-xl font-mono font-black text-[#c5a059]">{productoQuickView.precio}</div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">{productoQuickView.descripcion || 'Artículo exclusivo seleccionado bajo el estándar de calidad Otro Flow.'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const prod = productoQuickView;
                setProductoQuickView(null);
                handleSolicitarProducto(prod);
              }}
              className="w-full bg-[#c5a059] hover:bg-amber-400 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <IconWhatsApp className="w-4 h-4 fill-current" />
              <span>PEDIR ESTE ARTÍCULO POR WHATSAPP</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}