'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydqmwtwyiuogthqyxthj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW13dHd5aXVvZ3RocXl4dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTgxNTYsImV4cCI6MjA5OTk3NDE1Nn0.SbCzxMDdSr-_3iLCBxIsw8t-ZdCiN2FwVYNoAEo9L6k';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  img: string;
  stock: number;
  categoria: string;
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaImg, setNuevaImg] = useState('');
  const [nuevoStock, setNuevoStock] = useState('10');
  const [nuevaCategoria, setNuevaCategoria] = useState('Ceras');
  const [cargando, setCargando] = useState(false);

  // Toast flotante state
  const [toastMsg, setToastMsg] = useState('');

  const CLAVE_ADMIN = 'otroflow2026';

  const mostrarToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CLAVE_ADMIN) {
      setAutenticado(true);
      fetchProductos();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });
    setProductos(data || []);
  };

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio) return;

    setCargando(true);
    const { error } = await supabase.from('productos').insert([
      {
        nombre: nuevoNombre,
        precio: nuevoPrecio,
        stock: parseInt(nuevoStock) || 1,
        categoria: nuevaCategoria,
        img:
          nuevaImg ||
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=400',
      },
    ]);
    setCargando(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevaImg('');
      setNuevoStock('10');
      fetchProductos();
      mostrarToast('✨ ¡Producto publicado con éxito!');
    }
  };

  const handleActualizarStock = async (
    id: number,
    stockActual: number,
    cambio: number
  ) => {
    const nuevoValor = Math.max(0, stockActual + cambio);
    await supabase.from('productos').update({ stock: nuevoValor }).eq('id', id);
    fetchProductos();
  };

  const handleEliminarProducto = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este artículo?')) return;
    await supabase.from('productos').delete().eq('id', id);
    fetchProductos();
    mostrarToast('🗑️ Producto eliminado');
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full"
        >
          <h1 className="text-2xl font-black text-amber-400 mb-2">
            Panel Restringido
          </h1>
          <p className="text-zinc-400 text-xs mb-6">
            Introduce tu clave de seguridad para administrar la tienda.
          </p>
          <input
            type="password"
            placeholder="Contraseña secreta"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-amber-400 text-sm mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3.5 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg"
          >
            Acceder al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 relative">
      {/* Notificación Toast Flotante */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-zinc-950 font-black px-6 py-3 rounded-2xl shadow-2xl animate-bounce text-xs uppercase tracking-wider">
          {toastMsg}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Modo Admin
            </span>
            <h1 className="text-3xl font-black mt-2">Panel de Control</h1>
          </div>
          <a
            href="/"
            className="text-xs bg-zinc-900 border border-white/10 text-zinc-300 px-4 py-2.5 rounded-2xl hover:bg-zinc-800 transition-all font-bold"
          >
            Ver Tienda Pública ↗
          </a>
        </div>

        {/* Formulario de Alta */}
        <form
          onSubmit={handleAgregarProducto}
          className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-xl mb-12"
        >
          <h2 className="text-base font-extrabold mb-5 text-white uppercase tracking-wider">
            Publicar Nuevo Producto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre (ej. Cera Matte)"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
            <input
              type="text"
              placeholder="Precio (ej. RD$6500)"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
            <input
              type="number"
              placeholder="Stock disponible"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
            <select
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Ceras">Ceras</option>
              <option value="Ropa">Ropa</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              type="url"
              placeholder="URL de la imagen del producto (opcional)"
              value={nuevaImg}
              onChange={(e) => setNuevaImg(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/30"
          >
            {cargando ? 'Publicando...' : 'Publicar Artículo'}
          </button>
        </form>

        <h2 className="text-xl font-black mb-6 uppercase tracking-wider text-zinc-200">
          Inventario y Stock
        </h2>
        {productos.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No hay productos en la base de datos.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className="bg-zinc-900/60 border border-white/10 p-4 rounded-3xl flex items-center gap-4 shadow-xl"
              >
                <img
                  src={prod.img}
                  alt={prod.nombre}
                  className="w-20 h-20 object-cover rounded-2xl border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">
                    {prod.nombre}
                  </h3>
                  <p className="text-amber-400 font-bold text-sm">
                    {prod.precio}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-zinc-400 font-semibold">
                      Stock: {prod.stock ?? 0}
                    </span>
                    <button
                      onClick={() =>
                        handleActualizarStock(prod.id, prod.stock ?? 0, -1)
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 w-6 h-6 rounded-lg text-xs font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        handleActualizarStock(prod.id, prod.stock ?? 0, 1)
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 w-6 h-6 rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminarProducto(prod.id)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-2xl text-xs font-bold transition-all"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
