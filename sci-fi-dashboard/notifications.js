class NotificationSystem {
    constructor() {
        this.queue = [];
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    async requestPermission() {
        if (!("Notification" in window)) {
            console.warn("This browser does not support notifications");
            return;
        }

        if (Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    }

    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        icon.innerHTML = type === 'info' ? '🔵' : type === 'warning' ? '⚠️' : '❌';
        
        const text = document.createElement('div');
        text.className = 'notification-text';
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        
        this.container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    async showSystemNotification(title, options = {}) {
        if (Notification.permission === "granted") {
            return new Notification(title, options);
        }
    }
}
