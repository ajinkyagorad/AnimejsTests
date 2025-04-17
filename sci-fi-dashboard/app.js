// Initialize the dashboard
class SciFiDashboard {
    constructor() {
        // Initialize all canvases first
        this.initializeCanvases();

        // Initialize draggable elements
        this.initializeDraggable();

        // Initialize YouTube player
        this.initializeYouTubePlayer();

        // Initialize core systems
        this.notifications = new NotificationSystem();
        this.audioVisualizer = new AudioVisualizer(document.getElementById('audio-canvas'));
        this.particleSystems = new Map();
        this.connectionStatus = {
            connected: true,
            lastCheck: Date.now()
        };

        // Initialize all subsystems in order
        this.initializeTimeDisplay();

        // Initialize visual systems with error handling
        Promise.all([
            this.initializeWeather().catch(err => console.warn('Weather init failed:', err)),
            this.initializeVitalityWheel().catch(err => console.warn('Vitality init failed:', err)),
            this.initializeMoodTracker().catch(err => console.warn('Mood init failed:', err)),
            this.initializeActivityLog().catch(err => console.warn('Activity init failed:', err)),
            this.audioVisualizer.initialize().catch(err => console.warn('Audio init failed:', err))
        ]).then(() => {
            // Initialize particle effects after main systems are ready
            this.initializeParticleSystems();
            this.checkConnection();
            console.log('All systems initialized');
        }).catch(error => {
            console.error('System initialization error:', error);
        });
    }

    initializeTimeDisplay() {
        const timeDisplay = document.querySelector('.time-display');
        setInterval(() => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }, 1000);
    }

    initializeYouTubePlayer() {
        // Create a global function for YouTube API
        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube API Ready');
            this.createYouTubePlayer();
        };
    }

    createYouTubePlayer() {
        try {
            new YT.Player('youtube-player', {
                videoId: 'vZjTMzEZp2A',
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                    loop: 1,
                    playlist: 'vZjTMzEZp2A'
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(50);
                        this.notifications.show('Music stream connected', 'info');
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            document.querySelector('.track-name').textContent = 'Lofi Hip Hop Radio';
                            document.querySelector('.track-artist').textContent = 'ChilledCow';
                        }
                    }
                }
            });
            console.log('YouTube player initialized');
        } catch (error) {
            console.error('YouTube player initialization failed:', error);
            // Retry after a delay if failed
            setTimeout(() => this.createYouTubePlayer(), 2000);
        }
    }

    initializeDraggable() {
        const elements = document.querySelectorAll('.floating-element');
        elements.forEach(element => {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            element.addEventListener('mousedown', (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === element || e.target.parentElement === element) {
                    isDragging = true;
                    element.classList.add('dragging');
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    element.classList.remove('dragging');
                }
            });
        });
    }

    initializeCanvases() {
        // Set all canvas sizes
        const canvases = {
            'activity-canvas': { width: 180, height: 40 },
            'activity-particles': { width: 180, height: 40 },
            'vitality-canvas': { width: 200, height: 200 },
            'mood-canvas': { width: 150, height: 80 },
            'audio-canvas': { width: 200, height: 60 }
        };

        for (const [id, size] of Object.entries(canvases)) {
            const canvas = document.getElementById(id);
            if (canvas) {
                canvas.width = size.width;
                canvas.height = size.height;
            } else {
                console.warn(`Canvas ${id} not found`);
            }
        }
    }

    async initializeWeather() {
        const API_KEY = 'YOUR_API_KEY'; // Replace with actual OpenWeatherMap API key
        const CITY = 'Helsinki';
        
        const updateWeather = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                
                document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
                document.querySelector('.condition').textContent = data.weather[0].description.toUpperCase();
                document.querySelector('.weather-details .detail:nth-child(1) .value').textContent = `${data.main.humidity}%`;
                document.querySelector('.weather-details .detail:nth-child(2) .value').textContent = `${data.wind.speed} m/s`;
                document.querySelector('.weather-details .detail:nth-child(3) .value').textContent = `${data.main.pressure} hPa`;
            } catch (error) {
                console.error('Weather update failed:', error);
            }
        };

        // Update weather every 5 minutes
        updateWeather();
        setInterval(updateWeather, 300000);
    }

    initializeVitalityWheel() {
        const canvas = document.getElementById('vitality-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;

        const rings = [
            { label: 'PHYSICAL', value: 0.8, color: 'rgba(0, 255, 255, 0.9)' },
            { label: 'MENTAL', value: 0.7, color: 'rgba(255, 0, 255, 0.9)' },
            { label: 'SOCIAL', value: 0.6, color: 'rgba(255, 255, 0, 0.9)' },
            { label: 'REST', value: 0.9, color: 'rgba(0, 255, 0, 0.9)' }
        ];

        const drawRing = (centerX, centerY, radius, startAngle, endAngle, color) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.stroke();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            rings.forEach((ring, i) => {
                const radius = 40 + (i * 15);
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + (2 * Math.PI * ((Math.sin(Date.now() * 0.001) * 0.1) + ring.value));
                
                // Draw background ring
                ctx.globalAlpha = 0.1;
                drawRing(centerX, centerY, radius, 0, 2 * Math.PI, ring.color);
                
                // Draw value ring with glow
                ctx.globalAlpha = 0.9;
                ctx.shadowColor = ring.color;
                ctx.shadowBlur = 10;
                drawRing(centerX, centerY, radius, startAngle, endAngle, ring.color);
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeMoodTracker() {
        const canvas = document.getElementById('mood-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 80;

        const moods = [
            { name: 'ENERGETIC', value: 0.8 },
            { name: 'FOCUSED', value: 0.7 },
            { name: 'CALM', value: 0.9 },
            { name: 'CREATIVE', value: 0.6 },
            { name: 'TIRED', value: 0.4 }
        ];
        let currentMoodIndex = 0;

        const updateMood = () => {
            currentMoodIndex = (currentMoodIndex + 1) % moods.length;
            document.querySelector('.mood-value').textContent = moods[currentMoodIndex].name;

            // Update mood wave
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0.9)');

            // Draw wave
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            
            for (let x = 0; x < canvas.width; x++) {
                const y = (canvas.height / 2) + 
                          Math.sin(x * 0.05 + Date.now() * 0.002) * 15 +
                          Math.cos(x * 0.02 + Date.now() * 0.001) * 10;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            requestAnimationFrame(updateMood);
        };

        updateMood();
    }

    initializeActivityLog() {
        const canvas = document.getElementById('activity-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 180;
        canvas.height = 40;

        const activities = [
            { name: 'CODING', duration: '45:00' },
            { name: 'DESIGNING', duration: '30:00' },
            { name: 'MEETING', duration: '15:00' },
            { name: 'BREAK', duration: '10:00' }
        ];
        let currentActivityIndex = 0;
        let startTime = Date.now();

        const updateActivity = () => {
            const activity = activities[currentActivityIndex];
            document.querySelector('.activity-type').textContent = activity.name;
            document.querySelector('.activity-duration').textContent = activity.duration;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw timeline
            const progress = (duration % 3600) / 3600; // 1 hour cycle

            // Background line
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.lineWidth = 4;
            ctx.moveTo(0, canvas.height/2);
            ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();

            // Progress line with glow
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
            ctx.shadowBlur = 10;
            ctx.moveTo(0, canvas.height/2);
            ctx.lineTo(canvas.width * progress, canvas.height/2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Pulse effect at progress point
            const pulseSize = Math.sin(Date.now() * 0.01) * 2 + 4;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
            ctx.arc(canvas.width * progress, canvas.height/2, pulseSize, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(updateActivity);
        };

        updateActivity();
        setInterval(() => {
            if (Math.random() < 0.1) {
                currentActivityIndex = (currentActivityIndex + 1) % activities.length;
                startTime = Date.now();
            }
        }, 1000);
    }

    initializeWaveform() {
        const ctx = document.querySelector('#waveform .chart').getContext('2d');
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
        gradientFill.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
        gradientFill.addColorStop(1, 'rgba(0, 255, 255, 0)');

        this.waveformChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(50).fill(''),
                datasets: [{
                    data: Array(50).fill(0),
                    borderColor: '#00ffff',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradientFill,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        min: -100,
                        max: 100
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });

        setInterval(() => this.updateWaveform(), 50);
    }

    updateWaveform() {
        const data = this.waveformChart.data.datasets[0].data;
        data.push(Math.sin(Date.now() * 0.01) * 50 + Math.random() * 20);
        data.shift();
        this.waveformChart.update();
    }

    initializeParticles() {
        const container = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            container.appendChild(particle);
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const randomX = () => Math.random() * 100;
        const randomY = () => Math.random() * 100;
        const randomSize = () => Math.random() * 4 + 2;
        const randomDuration = () => Math.random() * 3000 + 2000;

        const animate = () => {
            particle.style.left = randomX() + '%';
            particle.style.top = randomY() + '%';
            particle.style.width = randomSize() + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.5;

            anime({
                targets: particle,
                duration: randomDuration(),
                easing: 'easeInOutSine',
                complete: animate
            });
        };

        animate();
    }

    initializeMetrics() {
        const metrics = document.querySelectorAll('.metric');
        metrics.forEach(metric => {
            const bar = metric.querySelector('.metric-bar');
            const value = metric.querySelector('.metric-value');
            
            setInterval(() => {
                const newValue = Math.random() * 100;
                bar.style.width = newValue + '%';
                value.textContent = Math.round(newValue);
                
                bar.style.background = `linear-gradient(90deg, 
                    var(--primary-color) ${newValue}%, 
                    rgba(0, 255, 255, 0.1) ${newValue}%)`;
            }, 2000);
        });
    }

    initializeHexMap() {
        const container = document.querySelector('.hex-container');
        for (let i = 0; i < 48; i++) {
            const hex = document.createElement('div');
            hex.className = 'hex';
            container.appendChild(hex);
            
            setInterval(() => {
                const intensity = Math.random();
                hex.style.background = `rgba(0, 255, 255, ${intensity * 0.3})`;
                hex.style.transform = `scale(${0.8 + intensity * 0.2})`;
            }, Math.random() * 2000 + 1000);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SciFiDashboard();
});
