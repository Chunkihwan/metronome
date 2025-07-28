'use client';

import { useState, useEffect } from 'react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        console.log('InstallPrompt: 컴포넌트 마운트됨');

        const handleBeforeInstallPrompt = (e) => {
            console.log('InstallPrompt: beforeinstallprompt 이벤트 발생');
            // 기본 설치 프롬프트 방지
            e.preventDefault();
            // 나중에 사용하기 위해 이벤트 저장
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        };

        const handleAppInstalled = () => {
            // 앱이 설치되면 프롬프트 숨기기
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // 설치 프롬프트 표시
        deferredPrompt.prompt();

        // 사용자 응답 대기
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('사용자가 앱 설치를 수락했습니다');
        } else {
            console.log('사용자가 앱 설치를 거부했습니다');
        }

        // 프롬프트 초기화
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
    };

    if (!showInstallPrompt) return null;

    return (
        <div className="fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2">
            <div className="px-6 py-4 max-w-sm text-black bg-white rounded-lg shadow-lg">
                <div className="flex items-center mb-3 space-x-3">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div>
                        <h3 className="text-sm font-semibold">앱 설치</h3>
                        <p className="text-xs text-gray-600">홈 화면에 추가하여 더 빠르게 접근하세요</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded transition-colors hover:bg-blue-600"
                    >
                        설치
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded transition-colors hover:bg-gray-300"
                    >
                        나중에
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
