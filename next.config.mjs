/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // Force dynamic rendering for all routes since we use database
    experimental: {
        dynamicIO: true,
    },
    // Disable static optimization
    output: 'standalone',
};

export default nextConfig;
