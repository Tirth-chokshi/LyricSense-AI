/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.genius.com", "s3.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
