// public/service-worker.js

self.addEventListener('push', event => {
    const data = event.data.json();

    const options = {
        body: data.message,
        // icon: '/path/to/icon.png',
        // badge: '/path/to/badge.png',
        data: {
            url: data.url
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
