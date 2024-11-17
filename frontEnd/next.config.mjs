/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/backend/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'dreamsimg.s3.us-west-2.amazonaws.com',
          port: "", 
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;