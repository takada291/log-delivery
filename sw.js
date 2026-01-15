const CACHE_NAME = 'log-delivery-v0.2-cache';
const urlsToCache = [
  './',
  './index.html', // HTMLファイル名が違う場合は変更してください
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// インストール時にキャッシュする
self.addEventListener('install', (event) => {
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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});