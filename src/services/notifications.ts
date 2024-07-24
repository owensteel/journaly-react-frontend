// Notifications utils

import axiosInstance from './api';

const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_NOTIFICATIONS_PUBLIC_KEY || "")
    });

    await axiosInstance.post('/notifications/subscribe', { subscription }, { headers: {} });
};

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

function init() {
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                subscribeUser();
            } else {
                console.log('Notification permission denied.');
            }
        });
    }
}

export { init, subscribeUser }