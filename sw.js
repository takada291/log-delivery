const CACHE_NAME = 'log-delivery-v1.8.1-cache';// 2026.01.18 15:11
const urlsToCache = [
  './',
  './index.html', // HTMLファイル名がindex.htmlでない場合はここを修正
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// インストール時にキャッシュする
self.addEventListener('install', (event) => {
  // ★追加: 待機状態をスキップして即座に有効化する
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時にキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す、なければネットワークに取りに行く
        return response || fetch(event.request);
      })
  );
});

// 新しいバージョンがでたら古いキャッシュを削除する
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    Promise.all([
      // ★追加: 更新後、すぐにページをコントロール下に置く
      clients.claim(),
      
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});









