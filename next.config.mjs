/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Blocks iframe injection
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Stops cross-site scripting
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents MIME sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Protects referral data
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';", // Modern iframe blocking
          }
        ],
      },
    ]
  },
}

export default nextConfig;
