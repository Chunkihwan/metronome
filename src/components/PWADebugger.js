'use client';

import { useState, useEffect } from 'react';

const PWADebugger = () => {
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const checkPWACriteria = () => {
            const info = {
                isHTTPS: window.location.protocol === 'https:',
                hasManifest: !!document.querySelector('link[rel="manifest"]'),
                hasServiceWorker: 'serviceWorker' in navigator,
                isStandalone: window.matchMedia('(display-mode: standalone)').matches,
                userAgent: navigator.userAgent,
                beforeInstallPromptSupported: 'onbeforeinstallprompt' in window,
            };

            // manifest 내용 확인
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                fetch(manifestLink.href)
                    .then((response) => response.json())
                    .then((manifest) => {
                        info.manifestName = manifest.name;
                        info.manifestDisplay = manifest.display;
                        info.manifestIcons = manifest.icons?.length || 0;
                        setDebugInfo(info);
                    })
                    .catch((err) => {
                        info.manifestError = err.message;
                        setDebugInfo(info);
                    });
            } else {
                setDebugInfo(info);
            }
        };

        checkPWACriteria();
    }, []);

    if (process.env.NODE_ENV === 'production') {
        return null; // 프로덕션에서는 숨김
    }

    return (
        <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
            <h3 className="font-bold mb-2">PWA 디버그 정보</h3>
            <div className="space-y-1">
                <div>HTTPS: {debugInfo.isHTTPS ? '✅' : '❌'}</div>
                <div>Manifest: {debugInfo.hasManifest ? '✅' : '❌'}</div>
                <div>Service Worker: {debugInfo.hasServiceWorker ? '✅' : '❌'}</div>
                <div>Standalone: {debugInfo.isStandalone ? '✅' : '❌'}</div>
                <div>Install Prompt: {debugInfo.beforeInstallPromptSupported ? '✅' : '❌'}</div>
                {debugInfo.manifestName && <div>Manifest Name: {debugInfo.manifestName}</div>}
                {debugInfo.manifestDisplay && <div>Display: {debugInfo.manifestDisplay}</div>}
                {debugInfo.manifestIcons && <div>Icons: {debugInfo.manifestIcons}</div>}
            </div>
        </div>
    );
};

export default PWADebugger;
