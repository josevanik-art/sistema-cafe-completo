/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas para produção
  output: 'standalone',
  
  // Otimizações
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configurações de imagem
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Remover console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig