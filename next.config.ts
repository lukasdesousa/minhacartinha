import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const privateLetterHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
    ];

    return [
      { source: "/c/:path*", headers: privateLetterHeaders },
      { source: "/para/:path*", headers: privateLetterHeaders },
    ];
  },
};

export default nextConfig;
