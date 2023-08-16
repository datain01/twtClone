/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", 
    "localhost",
    "ec2-13-209-22-9.ap-northeast-2.compute.amazonaws.com"],
  },
}

module.exports = nextConfig
