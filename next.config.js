/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['pzouscxbbynaghyiwovy.supabase.co', 'api.dicebear.com'],
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
