/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // İstemci tarafında çalışan modüller için çözümlemeyi devre dışı bırak
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false
      };
    }

    return config;
  }
};

module.exports = nextConfig;
