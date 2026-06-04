/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const frontendUrl = process.env.FRONTEND_URL || 'https://spmh-careers.netlify.app';
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: frontendUrl },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
