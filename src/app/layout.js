import './globals.css';
import Script from 'next/script';

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

                {/* iOS 아이콘 */}
                <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="144x144" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="120x120" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="114x114" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="76x76" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="72x72" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="60x60" href="/icon-192.svg" />
                <link rel="apple-touch-icon" sizes="57x57" href="/icon-192.svg" />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Yesol's Metronome" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                />

                {/* Google Analytics */}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-8EFX6741WN" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-8EFX6741WN');
                    `}
                </Script>

                {/* Service Worker 등록 */}
                <Script id="service-worker" strategy="afterInteractive">
                    {`
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', function() {
                                navigator.serviceWorker.register('/sw.js')
                                    .then(function(registration) {
                                        console.log('SW registered successfully: ', registration);
                                        
                                        // Service Worker 상태 확인
                                        if (registration.active) {
                                            console.log('SW is active');
                                        }
                                        if (registration.waiting) {
                                            console.log('SW is waiting');
                                        }
                                        if (registration.installing) {
                                            console.log('SW is installing');
                                        }
                                    })
                                    .catch(function(registrationError) {
                                        console.log('SW registration failed: ', registrationError);
                                    });
                            });
                        } else {
                            console.log('Service Worker not supported');
                        }
                    `}
                </Script>
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
