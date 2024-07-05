/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      hostname: '*.supabase.co',
      protocol: 'https',
    }, {
      hostname: '*.dicebear.com',
      protocol: 'https',
    }]
  }
};

module.exports = nextConfig;
