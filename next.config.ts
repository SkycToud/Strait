import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ローカル開発時の next/image 最適化を有効化
    // 外部ドメインの画像を使う場合はここに追加する
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],

    // 開発環境でも WebP/AVIF 変換を行う
    formats: ["image/avif", "image/webp"],

    // デバイス幅のブレークポイント（レスポンシブ対応）
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // 画像サイズのバリエーション
    imageSizes: [16, 32, 64, 96, 128, 256],
  },
};

export default nextConfig;
