/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", 
    "localhost",
    "nwz-sandbox.net",
    "twt-api.nps-sb.nws-sandbox.net",
    "twt-web.nps-sb.nws-sandbox.net"],
  },
}

module.exports = nextConfig
