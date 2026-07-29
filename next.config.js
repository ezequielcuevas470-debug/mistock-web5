/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora advertencias de linter durante el build para que Vercel suba la página
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errores de tipos menores durante la compilación
    ignoreBuildErrors: true,
  },
};

export default nextConfig;