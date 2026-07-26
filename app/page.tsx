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

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  
  const [nombreReserva, setNombreReserva] = useState('');
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [servicioReserva, setServicioReserva] = useState('');
  const [barberoReserva, setBarberoReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');
  const [fechaReserva, setFechaReserva] = useState('');

  const [estaAbierto, setEstaAbierto] = useState(false);
  const telefonoBarberia = '8492844395';

  useEffect(() => {
    fetchProductosTienda();
    verificarHorario();
  }, []);

  const verificarHorario = () => {
    const ahora = new Date();
    const hora = ahora.getHours();
    // Abierto todos los días de 9 AM a 7 PM (19:00)
    if (hora >= 9 && hora < 19) {
      setEstaAbierto(true);
    } else {
      setEstaAbierto(false);
    }
  };

  const fetchProductosTienda = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  const handleReservarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReserva || !telefonoReserva || !servicioReserva || !barberoReserva || !horaReserva || !fechaReserva) {
      alert('Por favor completa todos los campos de la reserva');
      return;
    }

    const { error } = await supabase.from('citas').insert([
      {
        nombre_cliente: nombreReserva,
        telefono: telefonoReserva,
        servicio: servicioReserva,
        barbero: barberoReserva,
        fecha: fechaReserva,
        hora: horaReserva,
        estado: 'Pendiente'
      }
    ]);

    if (error) {
      alert('Hubo un error al registrar la cita en el sistema: ' + error.message);
      return;
    }

    const mensaje = `¡Hola! 👋 Quiero confirmar una cita en *OTRO FLOW BARBERSHOP*:%0A%0A- *Cliente:* ${nombreReserva}%0A- *Teléfono:* ${telefonoReserva}%0A- *Servicio:* ${servicioReserva}%0A- *Barbero Seleccionado:* ${barberoReserva}%0A- *Fecha:* ${fechaReserva}%0A- *Hora:* ${horaReserva}`;
    window.open(`https://wa.me/${telefonoBarberia}?text=${mensaje}`, '_blank');
    
    setNombreReserva('');
    setTelefonoReserva('');
    setServicioReserva('');
    setBarberoReserva('');
    setHoraReserva('');
    setFechaReserva('');
  };

  const handleComprarWhatsApp = (prod: Producto) => {
    if (prod.stock <= 0) return;
    const mensaje = `¡Hola! 👋 Me interesa comprar este artículo de la tienda:%0A%0A- *Producto:* ${prod.nombre}%0A- *Precio:* ${prod.precio}%0A%0A¿Está disponible?`;
    window.open(`https://wa.me/${telefonoBarberia}?text=${mensaje}`, '_blank');
  };

  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black relative overflow-hidden font-sans">
      
      {/* FONDOS Y EFECTOS DE LUZ PREMIUM */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neutral-900/50 rounded-full blur-[100px] pointer-events-none"></div>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href={`https://wa.me/${telefonoBarberia}?text=¡Hola!%20Quiero%20información%20sobre%20sus%20servicios%20en%20Otro%20Flow.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:scale-110 flex items-center justify-center border border-emerald-400/50"
        title="Escríbenos por WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      <div className="flex-1 p-6 md:p-12 max-w-3xl mx-auto w-full space-y-16 relative z-10 pt-12 md:pt-20">
        
        {/* CABECERA PREMIUM */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-amber-400 font-bold tracking-[0.3em] text-[10px] uppercase border border-amber-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-sm">
              Premium Barbershop
            </span>
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/5 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-sm">
              <span className={`w-2 h-2 rounded-full ${estaAbierto ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-zinc-300 font-medium">
                {estaAbierto ? 'Abierto (9 AM - 7 PM)' : 'Cerrado'}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mt-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-amber-400 to-amber-600 drop-shadow-sm">
            OTRO FLOW
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 font-light tracking-wide max-w-md mx-auto">
            La máxima expresión del estilo urbano. Cortes de precisión para clientes exclusivos en RD.
          </p>
        </div>

        {/* APARTADO DE CITAS - GLASSMORPHISM */}
        <div className="relative bg-neutral-900/30 border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">Reserva tu Experiencia VIP</h3>
            <p className="text-xs text-amber-400 font-medium tracking-widest uppercase mt-2">Atención de primera clase</p>
          </div>

          <form onSubmit={handleReservarWhatsApp} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">Tu Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Manuel"
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Ej. 8491234567"
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">Servicio</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all appearance-none"
                  required
                >
                  <option value="" className="bg-neutral-900">Selecciona el servicio...</option>
                  <option value="Corte Clásico" className="bg-neutral-900">Corte Clásico</option>
                  <option value="Corte + Barba" className="bg-neutral-900">Corte + Barba</option>
                  <option value="Afeitado Urbano" className="bg-neutral-900">Afeitado Urbano</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">Barbero Master</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all appearance-none"
                  required
                >
                  <option value="" className="bg-neutral-900">Elige a tu barbero...</option>
                  <option value="Ezequiel Cuevas" className="bg-neutral-900">Ezequiel Cuevas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">Hora</label>
                <input
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1 group-focus-within:text-amber-400 transition-colors">Fecha</label>
                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black py-5 rounded-2xl transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(245,158,11,0.2)] text-[11px] uppercase tracking-[0.2em] mt-4"
            >
              Confirmar Cita por WhatsApp
            </button>
          </form>
        </div>

        {/* NUESTRO EQUIPO */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
            <h3 className="text-xl font-black tracking-widest uppercase">Expertos</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group bg-neutral-900/30 border border-white/5 hover:border-amber-500/30 p-4 rounded-3xl flex items-center gap-5 transition-all hover:bg-neutral-900/50 cursor-default">
              <div className="relative">
                <img 
                  src="image_7fe6a0.jpg" 
                  alt="Ezequiel Cuevas" 
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
                />
                <div className="absolute inset-0 rounded-2xl border border-amber-500/20 group-hover:border-amber-400 transition-colors"></div>
              </div>
              <div>
                <h4 className="font-bold text-base text-white tracking-tight">Ezequiel Cuevas</h4>
                <p className="text-[11px] text-amber-400 font-medium uppercase tracking-widest mt-1">Master Barber</p>
              </div>
            </div>

            <div className="bg-black/20 border border-dashed border-white/10 p-4 rounded-3xl flex items-center gap-5 opacity-50">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-zinc-600 font-light text-2xl">
                +
              </div>
              <div>
                <h4 className="font-bold text-base text-zinc-400 tracking-tight">Próximamente</h4>
                <p className="text-[11px] text-zinc-600 font-medium uppercase tracking-widest mt-1">Nuevo Talento</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIENDA PREMIUM */}
        <div className="space-y-8 pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-black tracking-tight mb-2">Exclusive Shop</h3>
            <p className="text-zinc-500 text-sm font-light">Productos seleccionados para el cuidado de tu imagen.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['Todos', 'Ceras', 'Ropa', 'Accesorios'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                  categoriaActiva === cat 
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                    : 'bg-neutral-900/50 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="bg-neutral-900/20 border border-white/5 p-12 rounded-[2rem] text-center text-zinc-500 text-sm font-light">
              Catálogo en actualización.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {productosFiltrados.map((prod) => {
                const sinStock = prod.stock <= 0;
                return (
                  <div 
                    key={prod.id} 
                    className="group bg-neutral-900/30 border border-white/5 p-5 rounded-[2rem] flex items-center gap-5 transition-all hover:bg-neutral-900/60 hover:border-white/10"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black flex-shrink-0">
                      <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {sinStock && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] border border-zinc-600 px-3 py-1 rounded-full">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-white truncate">{prod.nombre}</h4>
                      <p className="text-amber-400 font-medium text-sm mt-1 mb-3">{prod.precio}</p>
                      <button
                        onClick={() => handleComprarWhatsApp(prod)}
                        disabled={sinStock}
                        className={`w-full font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-[0.15em] transition-all ${
                          sinStock 
                            ? 'bg-neutral-900 text-zinc-600 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-amber-400 shadow-md transform hover:-translate-y-0.5'
                        }`}
                      >
                        {sinStock ? 'Agotado' : 'Adquirir'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER PREMIUM */}
      <footer className="mt-20 border-t border-white/5 bg-black py-12 px-4 text-center relative z-10">
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-black text-white tracking-[0.3em] text-lg bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
            OTRO FLOW
          </p>
          <p className="text-zinc-500 text-xs font-light tracking-wide">Santo Domingo Este, RD • Tel: 849-284-4395</p>
          <a 
            href="https://www.instagram.com/eezek1/?hl=es" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-amber-500/80 hover:text-amber-400 text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Instagram @eezek1
          </a>
          <div className="pt-6">
            <p className="text-[9px] text-zinc-700 tracking-widest uppercase">© 2026 Otro Flow Barbershop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}