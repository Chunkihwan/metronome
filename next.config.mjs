/** @type {import('next').NextConfig} */
const nextConfig = {
    // PWA 최적화 설정
    experimental: {
        optimizeCss: true,
    },
    // 정적 파일 캐싱 설정
    async headers() {
        return [
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
