'use client';

import { useState, useEffect } from 'react';

const OfflineIndicator = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            console.log('온라인 상태로 변경');
            setIsOffline(false);
        };

        const handleOffline = () => {
            console.log('오프라인 상태로 변경');
            setIsOffline(true);
        };

        // 초기 상태 설정
        const initialOfflineState = !navigator.onLine;
        console.log('초기 온라인 상태:', !initialOfflineState);
        setIsOffline(initialOfflineState);

        // 이벤트 리스너 등록
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // 클린업
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="text-sm font-medium">오프라인 모드</span>
            </div>
        </div>
    );
};

export default OfflineIndicator;
