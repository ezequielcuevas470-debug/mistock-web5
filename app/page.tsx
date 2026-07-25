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
  const [servicioReserva, setServicioReserva] = useState('');
  const [barberoReserva, setBarberoReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');
  const [fechaReserva, setFechaReserva] = useState('');

  useEffect(() => {
    fetchProductosTienda();
  }, []);

  const fetchProductosTienda = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  const handleReservarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReserva || !servicioReserva || !barberoReserva || !horaReserva || !fechaReserva) {
      alert('Por favor completa todos los campos de la reserva');
      return;
    }
    const telefonoBarberia = '18090000000';
    const mensaje = `Hola, quiero hacer una reserva:%0A- *Nombre:* ${nombreReserva}%0A- *Servicio:* ${servicioReserva}%0A- *Barbero:* ${barberoReserva}%0A- *Fecha:* ${fechaReserva}%0A- *Hora:* ${horaReserva}`;
    window.open(`https://wa.me/${telefonoBarberia}?text=${mensaje}`, '_blank');
  };

  const handleComprarWhatsApp = (prod: Producto) => {
    if (prod.stock <= 0) return;
    const telefonoBarberia = '18090000000';
    const mensaje = `Hola, estoy interesado en comprar este producto:%0A- *${prod.nombre}*%0A- *Precio:* ${prod.precio}`;
    window.open(`https://wa.me/${telefonoBarberia}?text=${mensaje}`, '_blank');
  };

  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col md:flex-row selection:bg-amber-500 selection:text-black">
      <div className="flex-1 p-6 md:p-12 max-w-2xl mx-auto w-full">
        {/* Cabecera Luxury */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            High-End Barber & Shop
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-3 tracking-tight">OTRO FLOW</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            Cortes modernos, afeitados de precisión y estilo urbano exclusivo. Reserva tu espacio y descubre nuestra tienda.
          </p>
        </div>

        {/* Formulario de Reserva con Barbero */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl mb-12">
          <h3 className="text-amber-400 font-extrabold text-sm tracking-wider uppercase mb-6 flex items-center gap-2">
            ✨ Reserva tu Cita VIP
          </h3>
          <form onSubmit={handleReservarWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-400 mb-1 font-bold">Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Carlos Manuel"
                value={nombreReserva}
                onChange={(e) => setNombreReserva(e.target.value)}
                className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1 font-bold">Servicio</label>
                <select
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                  required
                >
                  <option value="">Selecciona servicio...</option>
                  <option value="Corte Clásico">Corte Clásico</option>
                  <option value="Corte + Barba">Corte + Barba</option>
                  <option value="Afeitado Urbano">Afeitado Urbano</option>
                  <option value="Diseño / Barbería VIP">Diseño / Barbería VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1 font-bold">Barbero</label>
                <select
                  value={barberoReserva}
                  onChange={(e) => setBarberoReserva(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                  required
                >
                  <option value="">Elige tu barbero...</option>
                  <option value="Cualquiera disponible">Cualquiera disponible</option>
                  <option value="Carlos (Master Barber)">Carlos (Master Barber)</option>
                  <option value="Junior (Stylist)">Junior (Stylist)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1 font-bold">Hora</label>
                <input
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-1 font-bold">Fecha</label>
                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 mt-2"
            >
              Confirmar Cita por WhatsApp
            </button>
          </form>
        </div>

        {/* Sección Tienda Premium */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-black tracking-tight">NUESTRA TIENDA</h3>
              <p className="text-zinc-400 text-xs mt-0.5">Artículos y productos profesionales.</p>
            </div>

            {/* Pestañas de Categorías */}
            <div className="flex gap-1.5 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5">
              {['Todos', 'Ceras', 'Ropa', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    categoriaActiva === cat 
                      ? 'bg-amber-500 text-zinc-950 shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl text-center text-zinc-500 text-sm">
              No hay productos en esta categoría por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {productosFiltrados.map((prod) => {
                const sinStock = prod.stock <= 0;
                return (
                  <div 
                    key={prod.id} 
                    className="bg-zinc-900/60 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-5 transition-all hover:border-white/20 shadow-xl"
                  >
                    <div className="relative w-full sm:w-28 h-28 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover" />
                      {sinStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-red-400 font-black text-xs uppercase tracking-wider bg-red-950/80 border border-red-500/30 px-3 py-1 rounded-full">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="font-bold text-base text-white">{prod.nombre}</h4>
                        <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
                          Stock: {prod.stock ?? 1} disp.
                        </span>
                      </div>
                      <p className="text-amber-400 font-black text-lg mb-4">{prod.precio}</p>
                      
                      <button
                        onClick={() => handleComprarWhatsApp(prod)}
                        disabled={sinStock}
                        className={`w-full sm:w-auto font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                          sinStock 
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                            : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
                        }`}
                      >
                        {sinStock ? 'Sin Existencias' : 'Comprar por WhatsApp'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}