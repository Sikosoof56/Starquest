// เก็บไฟล์เกมไว้ในเครื่อง ให้เล่นได้แม้ไม่มีเน็ต
const CACHE = 'starquest-v66';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192-v2.png', 'icon-512-v2.png', 'apple-touch-icon-v2.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // only cache the game's own files — never Firebase / login / database traffic
  if(e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  // ดึงของใหม่จากเน็ตก่อน ถ้าไม่มีเน็ตค่อยใช้ของที่เก็บไว้
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
