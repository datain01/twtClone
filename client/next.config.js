/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", 
    "localhost",
    "twt-web.nps-sb.nwz-sandbox"],
  },
}

module.exports = nextConfig
