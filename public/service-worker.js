const CACHE_NAME = 'cash-app-v5';
const urlsToCache = [
  '/manifest.json',
];

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up ALL old caches and claim clients
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - NETWORK FIRST strategy (always try network first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Got network response, return it
        return response;
      })
      .catch(() => {
        // Network failed, try cache as fallback
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Tienes una nueva notificación',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Ver' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Nexxdi Cash', options)
  );
});

// Notification click event - open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data;
    // Mostrar notificación del sistema operativo
    self.registration.showNotification(title, {
      body,
      icon: icon || '/favicon.png',
      badge: '/favicon.png',
      vibrate: [200, 100, 200],
      tag: 'money-received',
      renotify: true,
      requireInteraction: true, // Mantener visible hasta que el usuario interactúe
      silent: false, // Reproducir sonido del sistema
    });
  }
});

// Programar notificación con delay
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, icon, delay } = event.data;
    
    // Esperar el delay y luego mostrar la notificación
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: icon || '/favicon.png',
        badge: '/favicon.png',
        vibrate: [200, 100, 200],
        tag: 'money-received-scheduled',
        renotify: true,
        requireInteraction: true,
        silent: false,
      });
    }, delay);
  }
});
