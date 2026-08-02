'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Supabase (Soporta .env.local con fallbacks seguros)
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

interface Resena {
  id: number;
  nombre: string;
  rol: string;
  comentario: string;
  estrellas: number;
  fecha: string;
}

// ⚙️ DATOS OFICIALES DE EZEQUIEL CUEVAS / OTRO FLOW
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

const IconStar = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconBag = ({ className = "w-4 h-4 text-[#c5a059]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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

const SignatureSVG = ({ className = "h-12 text-[#c5a059]" }) => (
  <svg className={className} viewBox="0 0 320 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 52 Q 35 12, 55 42 T 95 32 T 135 62 Q 155 22, 185 52 T 235 42 T 275 57 M 45 62 C 85 67, 125 67, 210 59" />
  </svg>
);

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [modalMembresiaOpen, setModalMembresiaOpen] = useState(false);
  const [productoQuickView, setProductoQuickView] = useState<Producto | null>(null);

  // Modalidad de Membresía (Mensual vs Anual con 15% Descuento)
  const [modalidadMembresia, setModalidadMembresia] = useState<'mensual' | 'anual'>('mensual');

  // Imágenes de alta resolución
  const [fotoHero, setFotoHero] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80');
  const [fotoBarber, setFotoBarber] = useState('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&auto=format&fit=crop&q=80');

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

  // Reseñas Reales para Social Proof
  const reseñasGoogle: Resena[] = [
    { id: 1, nombre: 'Carlos M. Rosario', rol: 'Socio VIP', comentario: 'La mejor experiencia de barbería en Piantini. Ezequiel capta el estilo exacto desde la primera consulta.', estrellas: 5, fecha: 'Hace 2 días' },
    { id: 2, nombre: 'Ing. Fernando Guzmán', rol: 'Cliente Recurrente', comentario: 'Puntualidad británica y un ambiente súper privado. La cerveza fría al llegar marca la diferencia.', estrellas: 5, fecha: 'Hace 1 semana' },
    { id: 3, nombre: 'Lic. Jean L. Tavárez', rol: 'Socio Duo', comentario: 'Tengo la membresía Duo con mi hermano. Nos ahorramos tiempo y la atención executive es impecable.', estrellas: 5, fecha: 'Hace 2 semanas' },
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
        if (configObj.img_barbero) setFotoBarber(configObj.img_barbero);
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
            descripcion: 'Edición limitada con suela ergonómica de amortiguación alta y acabado en piel nobuck con detalles dorados.',
            detalles: ['100% Piel Legítima', 'Suela de goma antideslizante', 'Incluye estuche protector']
          },
          { 
            id: 2, 
            nombre: 'GORRA OTRO FLOW BLACK EMBOSSED', 
            precio: 'RD$1,500', 
            img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80', 
            stock: 6, 
            categoria: 'Gorras', 
            exclusivo: true,
            descripcion: 'Diseño estructural de corona alta con bordado 3D en relieve mate e interior absorbente.',
            detalles: ['Ajuste Snapback de precisión', 'Algodón Premium transpirable']
          },
          { 
            id: 3, 
            nombre: 'SLIDES EXECUTIVE COMFORT', 
            precio: 'RD$2,200', 
            img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80', 
            stock: 5, 
            categoria: 'Sandalias', 
            exclusivo: false,
            descripcion: 'Chanclas de descanso ortopédicas de densidad dual, perfectas para después del entrenamiento o estancia casual.',
            detalles: ['Suela Memory Foam', 'Banda acolchada ajuste anatómico']
          },
          { 
            id: 4, 
            nombre: 'PERFUME DE AUTOR "OTRO FLOW" 50ML', 
            precio: 'RD$2,800', 
            img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80', 
            stock: 4, 
            categoria: 'Perfumes', 
            exclusivo: true,
            descripcion: 'Extracto de perfume intenso con notas de madera de cedro, ámbar gris, bergamota y fondo de cuero ahumado.',
            detalles: ['Duración superior a 12 horas', 'Envase de cristal soplado oscuro']
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

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans selection:bg-[#c5a059] selection:text-black relative overflow-x-hidden">
      
      {/* STRUCTURED DATA FOR SEO LOCAL */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BarberShop",
            "name": "Otro Flow Executive Barbershop",
            "image": fotoHero,
            "telephone": "+1-849-284-4395",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Av. Winston Churchill #105, Piantini",
              "addressLocality": "Santo Domingo",
              "addressCountry": "DO"
            },
            "priceRange": "$$",
            "openingHours": "Mo-Sa 09:00-20:00",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "128"
            }
          })
        }}
      />

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

          {/* Menú Superior */}
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
              SANTO DOMINGO •  BARBERING
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.92] font-serif text-white">
              EL ESTÁNDAR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#c5a059] to-amber-500">
                DE LA ELEGANCIA.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light tracking-wide">
             
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

            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-8 text-zinc-400 text-[10px] font-bold tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-[#c5a059]" />
                <span>Atención Puntual Sin Esperas</span>
              </div>
              <div className="flex items-center gap-2">
               
                <span></span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-96 sm:h-[520px] rounded-2xl overflow-hidden border border-[#c5a059]/30 mt-10 lg:mt-0 shadow-2xl group">
            <img
              src={fotoHero}
              alt="Otro Flow Executive Barbering"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-90 contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-6 left-6 right-6 bg-[#030305]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#c5a059]/30 grid grid-cols-3 gap-2 text-center shadow-2xl">
              <div className="space-y-1">
                <p className="text-base font-black font-mono text-white tracking-wider">+5,000</p>
                <p className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">Cortes Elite</p>
              </div>
              <div className="space-y-1 border-x border-white/10">
                <div className="flex items-center justify-center text-[#c5a059] gap-0.5">
                  <IconStar className="w-3.5 h-3.5" />
                  <span className="text-sm font-black font-mono text-white">5.0</span>
                </div>
                <p className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">Calificación</p>
              </div>
              <div className="space-y-1">
                <p className="text-base font-black font-mono text-white tracking-wider">100%</p>
                <p className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">Privacidad</p>
              </div>
            </div>
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
            <p className="text-xs text-zinc-400 max-w-md font-light">
              
            </p>
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

        {/* MASTER BARBER */}
        <section id="master" className="bg-[#08080c] border border-[#c5a059]/30 rounded-3xl p-8 sm:p-14 relative overflow-hidden space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            
            <div className="sm:col-span-7 space-y-6">
              <div className="inline-block border border-[#c5a059]/40 bg-[#12100b] px-3 py-1 rounded-full text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase">
                MASTER BARBER 
              </div>
              
              <h3 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif tracking-tight">
                EZEQUIEL CUEVAS
              </h3>

              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed italic border-l-2 border-[#c5a059] pl-4">
              "No vendemos simplemente un corte de cabello; creamos la imagen y la confianza con la que nuestros clientes se presentan al mundo día a día."
              </p>

              <div className="py-2">
                <SignatureSVG className="h-12 text-[#c5a059]" />
              </div>

              <button
                onClick={() => {
                  setBarberoReserva('Ezequiel Cuevas (Master Barber)');
                  setModalReservaOpen(true);
                }}
                className="bg-[#c5a059] hover:bg-amber-400 text-black font-black text-[10px] px-8 py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg"
              >
                SOLICITAR CITA CON EZEQUIEL
              </button>
            </div>

            <div className="sm:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#c5a059]/40 relative shadow-2xl">
              <img
                src={fotoBarber}
                alt="Ezequiel Cuevas"
                className="w-full h-full object-cover filter contrast-[1.15]"
              />
            </div>

          </div>
        </section>

        {/* SECCIÓN PLANES DE MEMBRESÍA CON TOGGLE ANUAL */}
        <section id="club" className="space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
              MEMBRESÍAS VIP DE SUSCRIPCIÓN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
              OTRO FLOW PRIVATE CLUB
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Mantén tu imagen impecable todo el mes con acceso preferencial, área VIP y bebida fría incluida.
            </p>

            {/* TOGGLE MENSUAL / ANUAL */}
            <div className="inline-flex items-center bg-[#08080c] border border-white/10 p-1.5 rounded-full gap-2 mt-4">
              <button
                onClick={() => setModalidadMembresia('mensual')}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                  modalidadMembresia === 'mensual'
                    ? 'bg-[#c5a059] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                PAGO MENSUAL
              </button>
              <button
                onClick={() => setModalidadMembresia('anual')}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  modalidadMembresia === 'anual'
                    ? 'bg-[#c5a059] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>SUSCRIPCIÓN ANUAL</span>
                <span className="bg-emerald-500 text-black text-[8px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  15% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* PLAN INDIVIDUAL */}
            <div className="bg-[#08080c] border border-white/10 hover:border-[#c5a059]/50 rounded-3xl p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#c5a059] uppercase tracking-wider block">PLAN PERSONAL</span>
                    <h3 className="text-2xl font-black text-white font-serif uppercase">INDIVIDUAL EXECUTIVE</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-[#c5a059]">
                      {modalidadMembresia === 'anual' ? 'RD$ 22,440' : 'RD$ 2,200'}
                    </span>
                    <span className="text-xs font-normal text-zinc-500 block">
                      {modalidadMembresia === 'anual' ? '/ año' : '/ mes'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Diseñado para el caballero que requiere cortes frecuentes y mantenimiento de imagen impecable.
                </p>

                <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-zinc-300 pt-2 border-t border-white/5">
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Cortes ilimitados o hasta 4 al mes</span>
                  </li>
                  <li className="flex items-center gap-3">
                  </li>
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>1 Cerveza por visita</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Prioridad de reserva en horarios pico</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setPlanMembresia('individual');
                  setModalMembresiaOpen(true);
                }}
                className="w-full bg-[#12100b] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/40 text-[#c5a059] font-black text-xs py-4 rounded-xl uppercase tracking-widest transition-all"
              >
                SOLICITAR PLAN INDIVIDUAL
              </button>
            </div>

            {/* PLAN EXECUTIVE DUO */}
            <div className="bg-[#08080c] border border-[#c5a059] rounded-3xl p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-[0_0_40px_rgba(197,160,89,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#c5a059] text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                MÁS POPULAR
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#c5a059] uppercase tracking-wider block">PLAN COMPARTIDO</span>
                    <h3 className="text-2xl font-black text-white font-serif uppercase">EXECUTIVE DUO</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-[#c5a059]">
                      {modalidadMembresia === 'anual' ? 'RD$ 40,800' : 'RD$ 4,000'}
                    </span>
                    <span className="text-xs font-normal text-zinc-500 block">
                      {modalidadMembresia === 'anual' ? '/ año' : '/ mes'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Para compartir con tu hijo, hermano o socio de negocios con todos los privilegios VIP.
                </p>

                <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-zinc-300 pt-2 border-t border-white/5">
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Cortes para 2 personas todo el mes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Arreglo de barba y perfilado incluido</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Una bebida de su preferencia por cada visita </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IconCheck className="w-4 h-4 text-[#c5a059]" />
                    <span>Acceso preferencial sin fila de espera</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setPlanMembresia('duo');
                  setModalMembresiaOpen(true);
                }}
                className="w-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6d3b] text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg hover:opacity-90"
              >
                SOLICITAR PLAN EXECUTIVE DUO
              </button>
            </div>

          </div>
        </section>

        {/* VAULT STORE */}
        <section id="store" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block flex items-center gap-2">
                <IconBag className="w-3.5 h-3.5" />
                EXECUTIVE VAULT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
              OTRO FLOW PRIVATE VAULT

              </h2>
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Tenis', 'Gorras', 'Sandalias', 'Perfumes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    categoriaActiva === cat
                      ? 'bg-[#c5a059] border-[#c5a059] text-black'
                      : 'bg-[#08080c] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#08080c] border border-white/10 hover:border-[#c5a059]/60 rounded-2xl overflow-hidden group transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-64 overflow-hidden bg-black/40">
                  <img
                    src={prod.img}
                    alt={prod.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  
                  {prod.exclusivo && (
                    <span className="absolute top-3 left-3 bg-[#c5a059] text-black text-[8px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-lg">
                      EXCLUSIVO
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-mono px-2 py-1 rounded font-bold">
                    STOCK: {prod.stock} UNID.
                  </span>

                  {/* Botón Quick View Eye */}
                  <button
                    onClick={() => setProductoQuickView(prod)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#c5a059]"
                    title="Vista Rápida"
                  >
                    <IconEye />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-[#c5a059] uppercase tracking-widest">{prod.categoria || 'Colección'}</span>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{prod.nombre}</h3>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-mono font-black text-white block">{prod.precio}</span>
                      {prod.precioAnterior && (
                        <span className="text-[10px] font-mono text-zinc-500 line-through">{prod.precioAnterior}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleSolicitarProducto(prod)}
                      className="bg-[#12100b] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/40 text-[#c5a059] text-[9px] font-black px-3.5 py-2 rounded-lg uppercase tracking-wider transition-all"
                    >
                      SOLICITAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UBICACIÓN Y MAPA */}
        <section id="ubicacion" className="bg-[#08080c] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-black tracking-[0.35em] text-[#c5a059] uppercase block">
              UBICACIÓN & ATENCIÓN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-serif tracking-wider">
              VISÍTANOS
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Un ambiente pensado para la desconexión total y el cuidado de tu imagen personal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-black uppercase tracking-wider">
                  <IconMapPin />
                  <span>DIRECCIÓN Y ESTUDIO VIP</span>
                </div>
                <p className="text-sm font-bold text-white uppercase">SANTO DOMINGO, REPÚBLICA DOMINICANA</p>
                <p className="text-xs text-zinc-400">Av. Winston Churchill #105, Piantini</p>
                <p className="text-[10px] text-[#c5a059] font-mono pt-1">★ ATENCIÓN EN ESTUDIO  & SERVICIO DOMICILIO</p>
              </div>

              <div className="space-y-2 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-black uppercase tracking-wider">
                  <IconClock />
                  <span>HORARIO DE ATENCIÓN</span>
                </div>
                <p className="text-xs text-zinc-300">Lunes a Sábado: <span className="text-white font-bold">9:00 AM – 8:00 PM</span></p>
                <p className="text-xs text-zinc-300">Domingos: <span className="text-[#c5a059] font-bold">10:00 AM – 7:00 PM</span></p>
              </div>

              <button
                onClick={() => setModalReservaOpen(true)}
                className="w-full bg-[#c5a059] text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg"
              >
                AGENDAR CITA AHORA
              </button>
            </div>

            <div className="lg:col-span-7 h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.285816391482!2d-69.94215802422204!3d18.47072558261303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eef8dcbcdcb6a11%3A0x8e8334bc615d0bf0!2sAv.%20Winston%20Churchill%2C%20Santo%20Domingo!5e0!3m2!1ses-419!2sdo!4v1710000000000!5m2!1ses-419!2sdo"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#030305] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-base font-black tracking-[0.2em] text-[#c5a059] font-serif uppercase block">
              OTRO FLOW BARBERSHOP
            </span>
            <p className="text-[10px] text-zinc-500 font-mono">
              © {new Date().getFullYear()} OTRO FLOW BARBERSHOP — EZEQUIEL CUEVAS. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>

          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <a href="#inicio" className="hover:text-[#c5a059]">Inicio</a>
            <a href="#servicios" className="hover:text-[#c5a059]">Servicios</a>
            <a href="#club" className="hover:text-[#c5a059]">Membresías</a>
            <a href="#ubicacion" className="hover:text-[#c5a059]">Ubicación</a>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE CONCIERGE WHATSAPP CON PUNTO EN LÍNEA */}
      <a
        href={`https://wa.me/${TELEFONO_BARBERIA}?text=Hola,%20deseo%20más%20información%20sobre%20los%20servicios%20Executive.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform group flex items-center gap-2"
        title="Atención VIP WhatsApp 24/7"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <IconWhatsApp className="w-6 h-6 fill-white" />
      </a>

      {/* MODAL QUICK VIEW PRODUCTO */}
      {productoQuickView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08080c] border border-[#c5a059]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative space-y-6 shadow-2xl">
            <button
              onClick={() => setProductoQuickView(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              <IconX />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-64 rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <img src={productoQuickView.img} alt={productoQuickView.nombre} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">{productoQuickView.categoria}</span>
                <h3 className="text-lg font-black text-white uppercase leading-snug">{productoQuickView.nombre}</h3>
                <p className="text-xl font-mono font-black text-[#c5a059]">{productoQuickView.precio}</p>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">{productoQuickView.descripcion}</p>

                {productoQuickView.detalles && (
                  <ul className="space-y-1 text-[10px] text-zinc-400">
                    {productoQuickView.detalles.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <IconCheck className="w-3 h-3 text-[#c5a059]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => {
                    handleSolicitarProducto(productoQuickView);
                    setProductoQuickView(null);
                  }}
                  className="w-full bg-[#c5a059] text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-widest hover:bg-amber-400 transition-all"
                >
                  PEDIR VÍA CONCIERGE WHATSAPP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESERVA */}
      {modalReservaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#08080c] border border-[#c5a059]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 shadow-2xl my-8">
            <button
              onClick={() => setModalReservaOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              <IconX />
            </button>

            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase block">CITAS ONLINE</span>
              <h3 className="text-xl font-black text-white uppercase font-serif">AGENDAR MI EXPERIENCIA VIP</h3>
            </div>

            <form onSubmit={handleReservarWhatsApp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 8091234567"
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Servicio</label>
                  <select
                    value={servicioReserva}
                    onChange={(e) => setServicioReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-3 py-3 text-white outline-none"
                  >
                    <option>Corte Executive — RD$400</option>
                    <option>Corte + Barba Royal — RD$650</option>
                    <option>Perfilado y Tratamiento — RD$350</option>
                    <option>Servicio a Domicilio VIP — Desde RD$1,000+</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Barbero</label>
                  <select
                    value={barberoReserva}
                    onChange={(e) => setBarberoReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-3 py-3 text-white outline-none"
                  >
                    <option>Ezequiel Cuevas (Master Barber)</option>
                    <option>Barber Specialist Senior</option>
                  </select>
                </div>
              </div>

              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div className="space-y-1">
                  <label className="text-[#c5a059] uppercase font-bold text-[9px] tracking-wider block">Dirección Domicilio / Oficina</label>
                  <input
                    type="text"
                    required
                    placeholder="Torre, Sector, Apt/Oficina..."
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    className="w-full bg-[#12100b] border border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase font-bold text-[9px] tracking-wider block">Hora Preferida</label>
                  <select
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-3 py-3 text-white outline-none"
                  >
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6d3b] text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest hover:opacity-90 transition-all pt-3"
              >
                CONFIRMAR RESERVA POR WHATSAPP
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MEMBRESÍA */}
      {modalMembresiaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#08080c] border border-[#c5a059]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 shadow-2xl my-8">
            <button
              onClick={() => setModalMembresiaOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              <IconX />
            </button>

            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[9px] font-black tracking-[0.3em] text-[#c5a059] uppercase block">PRIVATE CLUB</span>
              <h3 className="text-xl font-black text-white uppercase font-serif">ACTIVAR MEMBRESÍA VIP</h3>
            </div>

            {/* Datos Bancarios */}
            <div className="bg-[#12100b] border border-[#c5a059]/30 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-wider block">1. DATOS DE TRANSFERENCIA BANCARIA</span>
              <div className="text-xs space-y-1 text-zinc-300">
                <p><strong className="text-white">Banco:</strong> {DATOS_BANCO.banco}</p>
                <p><strong className="text-white">Tipo:</strong> {DATOS_BANCO.tipoCuenta}</p>
                <p><strong className="text-white">Titular:</strong> {DATOS_BANCO.titular}</p>
                <div className="flex justify-between items-center bg-black/50 p-2.5 rounded-xl border border-white/10 mt-2">
                  <span className="font-mono font-bold text-[#c5a059] text-sm">{DATOS_BANCO.numeroCuenta}</span>
                  <button
                    type="button"
                    onClick={copiarNumeroCuenta}
                    className="text-[9px] font-bold text-zinc-400 hover:text-white uppercase flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md"
                  >
                    <IconCopy />
                    {copiadoCuenta ? '¡COPIADO!' : 'COPIAR'}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSolicitarMembresiaWhatsApp} className="space-y-4 text-xs">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">2. REGISTRAR TUS DATOS</span>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase font-bold text-[9px]">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  value={nombreMembresia}
                  onChange={(e) => setNombreMembresia(e.target.value)}
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase font-bold text-[9px]">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="Tu número de contacto"
                  value={telefonoMembresia}
                  onChange={(e) => setTelefonoMembresia(e.target.value)}
                  className="w-full bg-[#12100b] border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[10px] text-zinc-400">
                Plan Seleccionado: <strong className="text-[#c5a059] uppercase">{planMembresia} ({modalidadMembresia})</strong>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c5a059] hover:bg-amber-400 text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest transition-all"
              >
                ENVIAR COMPROBANTE POR WHATSAPP
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}