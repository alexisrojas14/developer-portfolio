import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "react-icons/fa",
      "react-icons/si",
      "react-icons/gi",
      "react-icons/vsc",
      "@emailjs/browser",
    ],
  },
};

export default nextConfig;
