import './globals.css';

export const metadata = {
    title: "Yesol's Metronome",
    description: 'A beautiful digital metronome with customizable BPM and time signatures',
    manifest: '/manifest.json',
    themeColor: '#00d4ff',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: "Yesol's Metronome",
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                {/* Google Analytics */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-8EFX6741WN"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-8EFX6741WN');
                        `,
                    }}
                />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Yesol's Metronome" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#00d4ff" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#00d4ff" />

                {/* Wake Lock 관련 메타 태그 */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
                />
                <meta name="format-detection" content="telephone=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
