import './globals.css';

export const metadata = {
    title: "Yesol's Metronome",
    description: 'A beautiful and responsive metronome app',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: "Yesol's Metronome",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                {/* 파비콘 */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/favicon.svg" />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Yesol's Metronome" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                />

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
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
