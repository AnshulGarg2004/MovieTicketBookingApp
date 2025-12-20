/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-in.bmscdn.com",
      },
      {
        protocol: "https",
        hostname: "bharatsamachartv.in",
      },
      {
        protocol: "https",
        hostname: "**.bollywoodhungama.com",
      },
      {
        protocol: "https",
        hostname: "**.static.toiimg.com",
      },
    ],
  },
};

module.exports = nextConfig;
