/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", 
    "localhost",
    "nwz-sandbox.net",
    "twt-api.nps-sb.nwz-sandbox.net",
    "twt-web.nps-sb.nwz-sandbox.net"],
  },
}

module.exports = nextConfig
