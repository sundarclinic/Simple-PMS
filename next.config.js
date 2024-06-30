/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'pzouscxbbynaghyiwovy.supabase.co',
      protocol: 'https',
    }, {
      hostname: 'api.dicebear.com',
      protocol: 'https',
    }]
  }
};

module.exports = nextConfig;
