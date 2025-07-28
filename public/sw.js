const CACHE_NAME = 'metronome-v2';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/favicon.svg',
    '/favicon.ico',
    '/icon-192.svg',
    '/icon-512.svg',
    '/apple-touch-icon.svg',
    '/browserconfig.xml',
];

// Service Worker 설치 시 캐시에 리소스 저장
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Service Worker 활성화 시 이전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 네트워크 요청 가로채기 및 캐시에서 응답
self.addEventListener('fetch', (event) => {
    // GET 요청만 처리
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // 캐시에서 찾으면 반환
            if (response) {
                console.log('SW: 캐시에서 응답 반환', event.request.url);
                return response;
            }

            // 캐시에 없으면 네트워크에서 가져오기
            return fetch(event.request)
                .then((response) => {
                    // 유효한 응답이 아니면 그대로 반환
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    // 응답을 복제하여 캐시에 저장
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                        console.log('SW: 새 리소스 캐시됨', event.request.url);
                    });

                    return response;
                })
                .catch((error) => {
                    console.log('SW: 네트워크 오류', event.request.url, error);

                    // 네트워크 오류 시 기본 페이지 반환
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }

                    // API 요청이나 다른 리소스의 경우 빈 응답 반환
                    return new Response('', {
                        status: 503,
                        statusText: 'Service Unavailable',
                    });
                });
        })
    );
});
