/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["app.easywork.com.mx", "localhost", "192.168.0.106"],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "gm-bitrix-bucket.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
