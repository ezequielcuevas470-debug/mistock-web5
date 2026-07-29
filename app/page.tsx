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
  exclusivo?: boolean;
}

const TELEFONO_BARBERIA = '8492844395';
const DIRECCION_TEXTO = 'Av. Abraham Lincoln #1002, Piantini, Santo Domingo';
const MAPS_LINK = 'https://maps.google.com';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalReservaOpen, setModalReservaOpen] = useState(false);

  // Campos Reserva Formulario
  const [nombreReserva, setNombreReserva] = useState('');
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [servicioReserva, setServicioReserva] = useState('Corte Executive - RD$400');
  const [barberoReserva, setBarberoReserva] = useState('Ezequiel Cuevas (Master Barber)');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');
  const [direccionDomicilio, setDireccionDomicilio] = useState('');

  useEffect(() => {
    fetchProductosTienda();
  }, []);

  const fetchProductosTienda = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });
    
    if (data && data.length > 0) {
      setProductos(data);
    } else {
      setProductos([
        { id: 1, nombre: 'PERFUME DE AUTOR "OTRO FLOW" 50ML', precio: 'RD$2,450', img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=80', stock: 4, categoria: 'Fragancias', exclusivo: true },
        { id: 2, nombre: 'CERA MATTE GOLD EDITION (CUIDADO PREMIUM)', precio: 'RD$850', img: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500&auto=format&fit=crop&q=80', stock: 6, categoria: 'Ceras', exclusivo: true },
        { id: 3, nombre: 'ACEITE HIDRATANTE DE BARBA ROYAL', precio: 'RD$950', img: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=500&auto=format&fit=crop&q=80', stock: 3, categoria: 'Ceras', exclusivo: true },
        { id: 4, nombre: 'GORRA OTRO FLOW BLACK EMBOSSED', precio: 'RD$1,200', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80', stock: 8, categoria: 'Ropa', exclusivo: false },
      ]);
    }
  };

  const handleReservarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReserva || !telefonoReserva || !servicioReserva || !barberoReserva || !horaReserva || !fechaReserva) {
      alert('Por favor completa los datos obligatorios para apartar tu cupo.');
      return;
    }

    const esDomicilio = servicioReserva.toLowerCase().includes('domicilio');
    if (esDomicilio && !direccionDomicilio) {
      alert('Por favor indica la dirección exacta para el servicio VIP a domicilio.');
      return;
    }

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

    let mensaje = `*RESERVA VIP - OTRO FLOW BARBERSHOP*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Cliente:* ${nombreReserva}%0A` +
      `📞 *Contacto:* ${telefonoReserva}%0A` +
      `✂️ *Servicio:* ${servicioReserva}%0A` +
      `💈 *Especialista:* ${barberoReserva}%0A` +
      `📅 *Fecha:* ${fechaReserva}%0A` +
      `⏰ *Hora:* ${horaReserva}`;

    if (esDomicilio) {
      mensaje += `%0A🚗 *Dirección VIP:* ${direccionDomicilio}`;
    }

    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
    setModalReservaOpen(false);
  };

  const handleSolicitarProductoVIP = (prod: Producto) => {
    const mensaje = `*SOLICITUD EXCLUSIVA DE PRODUCTO - PRIVATE VAULT*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━%0A` +
      `🛍️ *Producto:* ${prod.nombre}%0A` +
      `💎 *Precio:* ${prod.precio}%0A` +
      `STATUS: Deseo reservar esta unidad para mi próxima cita o envío.`;
    window.open(`https://wa.me/${TELEFONO_BARBERIA}?text=${mensaje}`, '_blank');
  };

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="min-h-screen bg-[#030304] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      
      {/* GLOW DE FONDO AMBIENTAL */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full z-0" />

      {/* BOTÓN FLOTANTE WHATSAPP VIP */}
      <a
        href={`https://wa.me/${TELEFONO_BARBERIA}?text=Hola,%20deseo%20solicitar%20atención%20VIP%20en%20Otro%20Flow.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#09090b]/90 backdrop-blur-xl border border-amber-500/40 text-amber-400 hover:text-black hover:bg-amber-400 p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-300 transform hover:scale-105 flex items-center gap-3 group"
      >
        <div className="relative">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </div>
        <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">Atención VIP</span>
      </a>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#030304]/80 backdrop-blur-2xl border-b border-amber-500/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 font-serif leading-none">
              OTRO FLOW
            </span>
            <span className="text-[8px] font-black tracking-[0.45em] text-zinc-400 uppercase mt-1">
              EXECUTIVE BARBERSHOP
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">
            <a href="#inicio" className="hover:text-amber-400 transition-colors">INICIO</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">SERVICIOS</a>
            <a href="#lookbook" className="hover:text-amber-400 transition-colors">GALLERY</a>
            <a href="#boss" className="hover:text-amber-400 transition-colors">MASTER BARBER</a>
            <a href="#ubicacion" className="hover:text-amber-400 transition-colors">UBICACIÓN</a>
            <a href="#tienda-exclusive" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>🔒</span> PRIVATE VAULT
            </a>
          </nav>

          <button
            onClick={() => setModalReservaOpen(true)}
            className="relative group overflow-hidden rounded-xl p-[1px] font-black text-xs uppercase tracking-wider"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 transition-all duration-300 group-hover:opacity-90" />
            <div className="relative px-5 py-2.5 bg-[#030304] rounded-[11px] transition-all duration-300 group-hover:bg-transparent text-amber-400 group-hover:text-black flex items-center gap-2">
              <span>📅</span> RESERVAR CITA
            </div>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16 relative z-10">

        {/* HERO SECTION */}
        <section id="inicio" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#08080a]/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="lg:col-span-7 space-y-6 z-10">
            
            <div className="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-amber-400 font-black tracking-[0.25em] text-[10px] uppercase">
                ABIERTO AHORA • ATENCIÓN VIP EXCLUSIVA
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-[1.05] font-serif text-white">
              EL ARTE DE LA<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                PRECISIÓN MASCULINA.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light">
              Diseño de imagen, cortes de autor y tratamiento VIP personalizado. Disfruta de un ambiente ejecutivo único en el corazón de Santo Domingo o en la comodidad de tu espacio.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setModalReservaOpen(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs px-8 py-4 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] transform hover:-translate-y-0.5"
              >
                <span>📅</span> APARTAR MI TURNO
              </button>
              <a
                href="#servicios"
                className="border border-white/10 hover:border-amber-500/50 bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-7 py-4 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <span>✂️</span> EXPLORAR SERVICIOS
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">☕</span>
                <span>BAR DE CORTESÍA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">♨️</span>
                <span>TOALLA CALIENTE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">📶</span>
                <span>WIFI HIGH SPEED</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative h-80 sm:h-[460px] rounded-2xl overflow-hidden border border-amber-500/30 group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&auto=format&fit=crop&q=80"
              alt="Experiencia Otro Flow"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#08080a]/80 backdrop-blur-md border border-amber-500/30 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black tracking-widest text-amber-400 uppercase">EXPERIENCIA PREMIUM</p>
                <p className="text-xs font-bold text-white uppercase">Sillones Ergonómicos Custom</p>
              </div>
              <span className="text-xl">👑</span>
            </div>
          </div>
        </section>

        {/* ✂️ SERVICIOS */}
        <section id="servicios" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase">
                CUIDADO MASCULINO COMPLETO
              </span>
              <h2 className="text-3xl font-black uppercase text-white font-serif">MENÚ DE SERVICIOS</h2>
            </div>
            <p className="text-xs font-mono text-zinc-400">Todos los servicios incluyen perfilado y producto de acabado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '✂️',
                titulo: 'CORTE EXECUTIVE',
                precio: 'RD$400',
                desc: 'Asesoría de visagismo, corte con técnica de graduación de precisión y acabado matte/brillo.',
                incluye: ['Lavado con champú VIP', 'Cera de autor', 'Toalla refrescante']
              },
              {
                icon: '💈',
                titulo: 'CORTE + BARBA ROYAL',
                precio: 'RD$650',
                desc: 'Experiencia completa. Diseño de corte + alineado de barba con navaja libre y ritual de vapor.',
                incluye: ['Ritual de toalla caliente', 'Aceite hidratante de barba', 'Cortesía de bar']
              },
              {
                icon: '🪒',
                titulo: 'PERFILADO DE BARBA',
                precio: 'RD$300',
                desc: 'Alineación milimétrica, diseño de contornos con navaja tradicional y bálsamo calmante.',
                incluye: ['Vapor de ozono', 'Tratamiento de piel', 'Cera para bigote']
              },
              {
                icon: '🚗',
                titulo: 'SERVICIO A DOMICILIO VIP',
                precio: 'DESDE RD$1,000',
                desc: 'Llevamos el salón executive hasta tu residencia, torre u oficina con todo el equipamiento.',
                incluye: ['Equipo sanitizado', 'Kit de barbería móvil', 'Atención en tu horario']
              },
            ].map((serv, index) => (
              <div key={index} className="bg-[#08080a] border border-amber-500/20 hover:border-amber-400 p-6 rounded-2xl flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] group">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl group-hover:scale-110 transition-transform">{serv.icon}</span>
                    <span className="text-sm font-black text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">{serv.precio}</span>
                  </div>
                  <h3 className="text-base font-black uppercase text-white tracking-wider">{serv.titulo}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light">{serv.desc}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">INCLUYE SIN COSTO EXTRA:</p>
                  <ul className="space-y-1">
                    {serv.incluye.map((inc, i) => (
                      <li key={i} className="text-[10px] text-zinc-300 flex items-center gap-1.5 font-medium">
                        <span className="text-amber-400 font-bold">✓</span> {inc}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setServicioReserva(`${serv.titulo} - ${serv.precio}`);
                      setModalReservaOpen(true);
                    }}
                    className="w-full bg-[#030304] hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-400 font-black py-2.5 rounded-xl uppercase text-[10px] tracking-widest transition-all mt-2"
                  >
                    ELEGIR ESTE SERVICIO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🖼️ GALERÍA DE TRABAJOS */}
        <section id="lookbook" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase">
              GALERÍA EXCLUSIVA
            </span>
            <h2 className="text-3xl font-black uppercase text-white font-serif">NUESTRO WORKBOOK VIP</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'MID FADE TEXTURIZADO', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80' },
              { title: 'PERFILADO DE BARBA CUEVAS', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80' },
              { title: 'EXECUTIVE TAPER FADE', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80' },
              { title: 'CROP URBANO CON DISEÑO', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80' },
            ].map((item, idx) => (
              <div key={idx} className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-500/20 group cursor-pointer">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[9px] font-black text-amber-400 tracking-widest uppercase">OTRO FLOW CUT</p>
                  <p className="text-xs font-black text-white uppercase tracking-wider">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 👑 MASTER BARBER */}
        <section id="boss" className="bg-[#08080a] border border-amber-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] h-[350px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <img
                  src="image_7fe6a0.jpg"
                  alt="Ezequiel Cuevas Master Barber"
                  className="w-full h-full object-cover filter contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">MASTER BARBER &amp; CEO</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div>
                <span className="text-[10px] font-black tracking-[0.3em] text-amber-400 uppercase">
                  LA MENTE DETRÁS DE LA MARCA
                </span>
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-serif mt-1">
                  EZEQUIEL CUEVAS
                </h3>
              </div>

              <blockquote className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed italic border-l-2 border-amber-500 pl-4 text-left">
                &quot;No vendemos simplemente un corte de cabello; creamos la imagen y la confianza con la que nuestros clientes se presentan al mundo día a día.&quot;
              </blockquote>

              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Pionero en la estética masculina urbana de alta gama. Con más de una década perfeccionando técnicas de degradado, perfilado quirúrgico de barba y asesoría de imagen para empresarios, deportistas y personalidades.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { valor: '+10 AÑOS', label: 'EXPERIENCIA' },
                  { valor: '+4.5K', label: 'CLIENTES' },
                  { valor: '100%', label: 'GARANTÍA VIP' },
                  { valor: 'TOP 1', label: 'SANTO DOMINGO' },
                ].map((st, i) => (
                  <div key={i} className="bg-[#030304] border border-amber-500/20 p-3 rounded-xl text-center">
                    <p className="text-sm font-black text-amber-400 font-mono">{st.valor}</p>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{st.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setBarberoReserva('Ezequiel Cuevas (Master Barber)');
                    setModalReservaOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <span>👑</span> RESERVAR CITA DIRECTA CON EZEQUIEL
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 📍 UBICACIÓN */}
        <section id="ubicacion" className="bg-[#08080a] border border-amber-500/25 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase">
                UBICACIÓN PRIVILEGIADA
              </span>
              <h2 className="text-2xl font-black uppercase text-white font-serif">NUESTRO SALÓN EXECUTIVE</h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">📍 Piantini, Santo Domingo, R.D.</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#030304] border border-amber-500/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-xl mt-1">🏢</span>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">DIRECCIÓN FÍSICA</p>
                    <p className="text-xs font-bold text-white uppercase">{DIRECCION_TEXTO}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">✓ Parqueo privado y seguridad 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <span className="text-amber-400 text-xl mt-1">🕒</span>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">HORARIO DE ATENCIÓN</p>
                    <p className="text-xs font-semibold text-zinc-300">Lun - Sáb: <span className="text-amber-400 font-mono">9:00 AM - 8:00 PM</span></p>
                    <p className="text-xs font-semibold text-zinc-300">Domingos: <span className="text-amber-400 font-mono">10:00 AM - 4:00 PM</span></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] p-3.5 rounded-xl uppercase tracking-widest text-center transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>MAPS</span> GOOGLE MAPS
                </a>
                <a
                  href={`https://wa.me/${TELEFONO_BARBERIA}?text=Hola,%20solicito%20la%20ubicación%20exacta%20por%20favor.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-amber-500/40 hover:border-amber-400 text-amber-400 font-black text-[10px] p-3.5 rounded-xl uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>📍</span> PEDIR PIN WHATSAPP
                </a>
              </div>

            </div>

            <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-amber-500/30 relative shadow-2xl bg-neutral-900">
              <iframe
                title="Ubicación Otro Flow"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.12345!2d-69.93!3d18.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI4JzEyLjAiTiA2OcKwNTUnNDguMCJX!5e0!3m2!1ses!2sdo!4v1600000000000!5m2!1ses!2sdo"
                className="w-full h-full filter invert-[0.9] hue-rotate-180 contrast-[1.2] opacity-85"
                loading="lazy"
              />
            </div>

          </div>
        </section>

        {/* 🔒 TIENDA EXCLUSIVA */}
        <section id="tienda-exclusive" className="bg-[#08080a] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.08)]">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  🔒 CLIENTS &amp; MEMBERS ONLY
                </span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold">• EDICIÓN LIMITADA</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase font-serif">
                OTRO FLOW <span className="text-amber-400">PRIVATE VAULT</span>
              </h2>
              <p className="text-zinc-400 text-xs max-w-xl font-light">
                Productos de cuidado personal, fragancias de nicho y accesorios exclusivos seleccionados personalmente por Ezequiel Cuevas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Todos', 'Fragancias', 'Ceras', 'Ropa'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    categoriaActiva === cat
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#030304] border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="bg-[#030304] border border-amber-500/20 hover:border-amber-400/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all duration-300 relative shadow-xl">
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                  {prod.exclusivo && (
                    <span className="bg-black/90 backdrop-blur-md border border-amber-500/50 text-amber-300 text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      👑 LOTE RESERVADO
                    </span>
                  )}
                  <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Quedan {prod.stock} ud.
                  </span>
                </div>

                <div className="h-52 rounded-xl overflow-hidden bg-neutral-900 relative">
                  <img
                    src={prod.img}
                    alt={prod.nombre}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-transparent opacity-40" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-wider truncate">{prod.nombre}</p>
                  <p className="text-amber-400 font-mono font-black text-sm">{prod.precio}</p>
                </div>

                <button
                  onClick={() => handleSolicitarProductoVIP(prod)}
                  className="w-full bg-[#08080a] hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-400 font-black py-2.5 rounded-xl uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <span>🛍️</span> SOLICITAR RESERVA VIP
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ❓ PREGUNTAS FRECUENTES */}
        <section className="bg-[#08080a] border border-amber-500/20 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase">INFORMACIÓN ÚTIL</span>
            <h2 className="text-2xl font-black uppercase text-white font-serif">PREGUNTAS FRECUENTES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: '¿Es obligatorio reservar cita previa?', a: 'Para garantizar la mejor experiencia sin esperas, recomendamos reservar por WhatsApp o por esta web. También atendemos por orden de llegada según disponibilidad.' },
              { q: '¿Cómo funciona el servicio VIP a domicilio?', a: 'Nos desplazamos a tu residencia u oficina con todo el equipo profesional sanitizado. Se cotiza según la zona dentro de Santo Domingo.' },
              { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos efectivo, transferencias bancarias (BHD, Banco Popular, Banreservas) y tarjetas de crédito/débito.' },
              { q: '¿Puedo comprar productos en la tienda física?', a: 'Sí, la Private Vault está disponible tanto en el salón como para pedidos con entrega a domicilio.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#030304] border border-white/5 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-black text-amber-400 uppercase tracking-wider">❓ {faq.q}</p>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] bg-[#030304] space-y-3">
        <p className="text-amber-400 text-xs font-serif italic tracking-widest">OTRO FLOW BARBERSHOP</p>
        <p>© 2026 EZEQUIEL CUEVAS • SANTO DOMINGO, REPÚBLICA DOMINICANA.</p>
      </footer>

      {/* MODAL DE RESERVA CITA VIP */}
      {modalReservaOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08080a] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-[0_0_60px_rgba(245,158,11,0.2)]">
            
            <button
              onClick={() => setModalReservaOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-amber-400 font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase">RESERVA INMEDIATA</span>
              <h3 className="text-2xl font-black uppercase text-white font-serif">SISTEMA DE CITAS VIP</h3>
            </div>

            <form onSubmit={handleReservarWhatsApp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">NOMBRE COMPLETO</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Manuel"
                    value={nombreReserva}
                    onChange={(e) => setNombreReserva(e.target.value)}
                    className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none"
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
                    className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">SERVICIO DESEADO</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-zinc-200 focus:border-amber-400 outline-none"
                  required
                >
                  <option value="Corte Executive - RD$400">Corte Executive (En Local) - RD$400</option>
                  <option value="Corte + Barba Royal - RD$650">Corte + Barba Royal (En Local) - RD$650</option>
                  <option value="Perfilado de Barba - RD$300">Perfilado de Barba (En Local) - RD$300</option>
                  <option value="Servicio A Domicilio VIP - Desde RD$1,000">🚗 Servicio VIP A DOMICILIO - Desde RD$1,000</option>
                </select>
              </div>

              {servicioReserva.toLowerCase().includes('domicilio') && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-amber-400 mb-1">DIRECCIÓN DE ATENCIÓN</label>
                  <input
                    type="text"
                    placeholder="Ej. Torre Lincoln #4B, Piantini"
                    value={direccionDomicilio}
                    onChange={(e) => setDireccionDomicilio(e.target.value)}
                    className="w-full bg-[#030304] border border-amber-500/60 rounded-xl p-3 text-white focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">MASTER BARBER / ESPECIALISTA</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-zinc-200 focus:border-amber-400 outline-none"
                  required
                >
                  <option value="Ezequiel Cuevas (Master Barber)">👑 Ezequiel Cuevas (Master Barber)</option>
                  <option value="Barbero Certificado VIP">Barbero Certificado VIP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">FECHA</label>
                  <input
                    type="date"
                    value={fechaReserva}
                    onChange={(e) => setFechaReserva(e.target.value)}
                    className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-zinc-200 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">HORA</label>
                  <input
                    type="time"
                    value={horaReserva}
                    onChange={(e) => setHoraReserva(e.target.value)}
                    className="w-full bg-[#030304] border border-white/10 rounded-xl p-3 text-zinc-200 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black py-4 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                <span>💬</span> CONFIRMAR MI CITA VÍA WHATSAPP
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}