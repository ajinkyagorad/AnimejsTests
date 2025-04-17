class AudioVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.animationId = null;
        this.isInitialized = false;

        // Add a button for initialization
        this.addStartButton();
    }

    addStartButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Audio';
        button.className = 'start-audio-btn';
        this.canvas.parentElement.appendChild(button);

        button.addEventListener('click', async () => {
            button.disabled = true;
            await this.initialize();
            button.remove();
        });
    }

    async initialize() {
        try {
            if (!this.isInitialized) {
                console.log('Initializing audio...');
                
                // Create audio context
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('Audio context created');

                // Set up analyser
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.analyser.smoothingTimeConstant = 0.7;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                console.log('Analyser configured');

                // Request microphone access
                console.log('Requesting microphone access...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                console.log('Microphone access granted');

                // Connect audio nodes
                this.source = this.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                console.log('Audio nodes connected');
                
                this.isInitialized = true;
                console.log('Audio system initialized');
                
                // Start visualization
                this.draw();
                
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'audio-notification success';
                notification.textContent = 'Audio visualization active';
                this.canvas.parentElement.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        } catch (error) {
            console.error('Audio initialization failed:', error);
            console.warn('Audio initialization failed:', error);
            // Just log the error, don't show the notification
        }
    }

    draw() {
        this.animationId = requestAnimationFrame(() => this.draw());

        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5;

        this.ctx.clearRect(0, 0, width, height);

        if (this.dataArray && this.isInitialized) {
            this.analyser.getByteFrequencyData(this.dataArray);

            // Create circular gradient
            const gradient = this.ctx.createRadialGradient(
                centerX, centerY, radius * 0.2,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
            gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;

            // Draw circular spectrum
            const binCount = 32; // Reduce for smoother visualization
            const angleStep = (Math.PI * 2) / binCount;

            this.ctx.beginPath();
            for (let i = 0; i < binCount; i++) {
                const value = this.dataArray[i];
                const amplitude = ((value / 255) * (radius * 0.5)) + (radius * 0.5);
                const angle = i * angleStep - Math.PI / 2;

                const x = centerX + Math.cos(angle) * amplitude;
                const y = centerY + Math.sin(angle) * amplitude;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();

            // Add glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--glow-color');
            this.ctx.stroke();
            
            // Fill with subtle gradient
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            this.ctx.fill();

            // Reset shadow
            this.ctx.shadowBlur = 0;

            // Draw center dot
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            this.ctx.fill();
        }
    }
}
