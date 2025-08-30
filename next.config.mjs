/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['tile.openstreetmap.org'],
  },
  transpilePackages: ['@react-leaflet', 'react-leaflet'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      type: "asset",
    });
    return config;
  },
}

export default nextConfig
