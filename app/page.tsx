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
    const dia = ahora.getDay();
    const hora = ahora.getHours();
    if (dia >= 1 && dia <= 6 && hora >= 9 && hora < 20) {
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

    // Guardar la cita y el teléfono en la base de datos de Supabase
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

    // Abrir WhatsApp con el mensaje preescrito
    const mensaje = `¡Hola! 👋 Quiero confirmar una cita en *OTRO FLOW BARBERSHOP*:%0A%0A- *Cliente:* ${nombreReserva}%0A- *Teléfono:* ${telefonoReserva}%0A- *Servicio:* ${servicioReserva}%0A- *Barbero Seleccionado:* ${barberoReserva}%0A- *Fecha:* ${fechaReserva}%0A- *Hora:* ${horaReserva}`;
    window.open(`https://wa.me/${telefonoBarberia}?text=${mensaje}`, '_blank');
    
    // Limpiar formulario
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
    <div className="min-h-screen bg-[#070708] text-white flex flex-col selection:bg-amber-500 selection:text-black relative">
      
      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href={`https://wa.me/${telefonoBarberia}?text=¡Hola!%20Quiero%20información%20sobre%20sus%20servicios%20en%20Otro%20Flow.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-emerald-400/40"
        title="Escríbenos por WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      <div className="flex-1 p-6 md:p-12 max-w-2xl mx-auto w-full space-y-12">
        
        {/* CABECERA */}
        <div className="text-center md:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-3">
            <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full shadow-inner">
              High-End Barbershop
            </span>
            <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3.5 py-1.5 rounded-full text-xs shadow-md">
              <span className={`w-2 h-2 rounded-full ${estaAbierto ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-zinc-300 font-medium">
                {estaAbierto ? 'Abierto Ahora' : 'Cerrado'}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">OTRO FLOW</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Cortes de precisión y estilo urbano exclusivo en RD.
          </p>
        </div>

        {/* APARTADO DE CITAS */}
        <div className="relative bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Reserva Online</span>
            <h3 className="text-xl font-black tracking-tight mt-0.5">Agenda tu Cita VIP</h3>
          </div>

          <form onSubmit={handleReservarWhatsApp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Tu Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Manuel"
                  value={nombreReserva}
                  onChange={(e) => setNombreReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Ej. 8491234567"
                  value={telefonoReserva}
                  onChange={(e) => setTelefonoReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Servicio</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                >
                  <option value="">Selecciona servicio...</option>
                  <option value="Corte Clásico">Corte Clásico</option>
                  <option value="Corte + Barba">Corte + Barba</option>
                  <option value="Afeitado Urbano">Afeitado Urbano</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Barbero</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                >
                  <option value="">Elige barbero...</option>
                  <option value="Ezequiel Cuevas">Ezequiel Cuevas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Hora</label>
                <input
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5 ml-1">Fecha</label>
                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400 text-sm transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 mt-3"
            >
              Confirmar Cita por WhatsApp
            </button>
          </form>
        </div>

        {/* NUESTRO EQUIPO */}
        <div>
          <h3 className="text-xl font-black tracking-tight mb-4">EQUIPO</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-neutral-900/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-md">
              <img 
                src="image_7fe6a0.jpg" 
                alt="Ezequiel Cuevas" 
                className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shadow" 
              />
              <div>
                <h4 className="font-bold text-sm text-white">Ezequiel Cuevas</h4>
                <p className="text-xs text-amber-400 font-medium">Master Barber / Propietario</p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-dashed border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-inner opacity-60">
              <div className="w-14 h-14 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-center text-zinc-600 text-xs font-bold">
                +
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-400">Espacio Disponible</h4>
                <p className="text-xs text-zinc-600 font-medium">Próximamente</p>
              </div>
            </div>

          </div>
        </div>

        {/* TIENDA */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Catálogo</span>
              <h3 className="text-xl font-black tracking-tight mt-0.5">Nuestra Tienda</h3>
            </div>

            <div className="flex gap-1.5 bg-neutral-900 p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {['Todos', 'Ceras', 'Ropa', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoriaActiva === cat 
                      ? 'bg-amber-500 text-neutral-950 shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-3xl text-center text-zinc-500 text-sm">
              No hay productos disponibles en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productosFiltrados.map((prod) => {
                const sinStock = prod.stock <= 0;
                return (
                  <div 
                    key={prod.id} 
                    className="bg-neutral-900/40 border border-white/10 p-4 rounded-3xl flex items-center gap-4 transition-all hover:border-white/20 shadow-xl"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-neutral-950">
                      <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover" />
                      {sinStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-red-400 font-black text-[9px] uppercase tracking-wider bg-red-950/80 px-2 py-0.5 rounded-full">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{prod.nombre}</h4>
                      <p className="text-amber-400 font-black text-sm my-1">{prod.precio}</p>
                      <button
                        onClick={() => handleComprarWhatsApp(prod)}
                        disabled={sinStock}
                        className={`w-full font-bold py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider transition-all transform active:scale-95 ${
                          sinStock 
                            ? 'bg-neutral-800 text-zinc-600 cursor-not-allowed' 
                            : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
                        }`}
                      >
                        {sinStock ? 'Agotado' : 'Comprar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 py-10 px-4 text-center text-zinc-400 text-xs">
        <div className="max-w-md mx-auto space-y-3">
          <p className="font-bold text-white tracking-widest">OTRO FLOW BARBER SHOP</p>
          <p className="text-zinc-500 text-[11px]">Santo Domingo Este, RD • Tel: 849-284-4395</p>
          <a 
            href="https://www.instagram.com/eezek1/?hl=es" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-amber-400 font-bold hover:underline"
          >
            📸 Instagram: @eezek1
          </a>
          <p className="text-[10px] text-zinc-600 pt-2">© 2026 Otro Flow Barbershop. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}