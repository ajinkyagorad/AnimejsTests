// Time Display
function updateTime() {
    const now = new Date();
    document.querySelector('.time').textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.querySelector('.date').textContent = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
}
setInterval(updateTime, 100);

// Starfield Animation
const starfield = document.getElementById('starfield');
const starfieldCtx = starfield.getContext('2d');
starfield.width = window.innerWidth;
starfield.height = window.innerHeight;

class Star {
    constructor() {
        this.x = Math.random() * starfield.width;
        this.y = Math.random() * starfield.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = starfield.width;
        if (this.x > starfield.width) this.x = 0;
        if (this.y < 0) this.y = starfield.height;
        if (this.y > starfield.height) this.y = 0;
    }

    draw() {
        starfieldCtx.fillStyle = '#ffffff';
        starfieldCtx.beginPath();
        starfieldCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        starfieldCtx.fill();
    }
}

const stars = Array(200).fill().map(() => new Star());

function animateStars() {
    starfieldCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    starfieldCtx.fillRect(0, 0, starfield.width, starfield.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}
animateStars();

// Vital Stats Animation
function animateVitalSigns() {
    const heartRate = document.getElementById('heartRateCanvas');
    const respRate = document.getElementById('respRateCanvas');
    const hrCtx = heartRate.getContext('2d');
    const rrCtx = respRate.getContext('2d');

    // Set canvas size
    function resizeCanvas(canvas) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }
    resizeCanvas(heartRate);
    resizeCanvas(respRate);

    // Heart Rate Signal Generator
    let hrTime = 0;
    let hrData = [];
    const hrBaseline = 75;
    
    function generateHeartbeat(t) {
        const mainBeat = Math.exp(-((t % 1) ** 2) * 50) * 30;
        const echo = Math.exp(-((t % 1 + 0.15) ** 2) * 30) * 10;
        const noise = (Math.random() - 0.5) * 1.5;
        return mainBeat + echo + noise;
    }

    // Respiratory Rate Signal Generator
    let rrTime = 0;
    let rrData = [];
    const rrBaseline = 16;

    function updateVitalSigns() {
        // Update heart rate
        hrTime += 0.03;
        hrData.push(hrBaseline + generateHeartbeat(hrTime));
        if (hrData.length > 100) hrData.shift();

        // Update respiratory rate
        rrTime += 0.01;
        rrData.push(rrBaseline + Math.sin(rrTime) * 4 + (Math.random() - 0.5));
        if (rrData.length > 100) rrData.shift();

        // Draw heart rate with sci-fi effect
        hrCtx.clearRect(0, 0, heartRate.width, heartRate.height);
        
        // Draw glow effect
        const gradient = hrCtx.createLinearGradient(0, 0, heartRate.width, 0);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 170, 255, 0.2)');
        hrCtx.fillStyle = gradient;
        hrCtx.fillRect(0, 0, heartRate.width, heartRate.height);

        // Draw main signal
        hrCtx.strokeStyle = 'rgba(0, 170, 255, 0.8)';
        hrCtx.lineWidth = 2;
        hrCtx.shadowBlur = 10;
        hrCtx.shadowColor = '#00aaff';
        hrCtx.beginPath();
        
        hrData.forEach((value, index) => {
            const x = (index / 100) * heartRate.width;
            const y = heartRate.height - ((value - 60) / 40) * heartRate.height;
            if (index === 0) hrCtx.moveTo(x, y);
            else hrCtx.lineTo(x, y);
        });
        
        hrCtx.stroke();

        // Draw echo effect
        hrCtx.strokeStyle = 'rgba(0, 170, 255, 0.2)';
        hrCtx.lineWidth = 1;
        hrCtx.beginPath();
        
        hrData.forEach((value, index) => {
            const x = (index / 100) * heartRate.width;
            const y = heartRate.height - ((value - 60) / 40) * heartRate.height + 5;
            if (index === 0) hrCtx.moveTo(x, y);
            else hrCtx.lineTo(x, y);
        });
        
        hrCtx.stroke();

        // Draw respiratory rate
        rrCtx.clearRect(0, 0, respRate.width, respRate.height);
        rrCtx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        rrCtx.lineWidth = 1.5;
        rrCtx.beginPath();
        
        rrData.forEach((value, index) => {
            const x = (index / 100) * respRate.width;
            const y = respRate.height - ((value - 10) / 12) * respRate.height;
            if (index === 0) rrCtx.moveTo(x, y);
            else rrCtx.lineTo(x, y);
        });
        
        rrCtx.stroke();

        // Update values
        document.querySelector('.heart-rate .value').textContent = 
            Math.round(hrData[hrData.length - 1]);
        document.querySelector('.respiratory-rate .value').textContent = 
            Math.round(rrData[rrData.length - 1]);
    }

    setInterval(updateVitalSigns, 50);
}

// Audio Visualization
let audioContext;
let analyser;
let audioInitialized = false;

async function initAudio() {
    if (audioInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        audioInitialized = true;
        visualize();
        console.log('Audio initialized successfully');
    } catch (err) {
        console.error('Audio initialization failed:', err);
    }
}

function visualize() {
    const spectrogramCanvas = document.getElementById('spectrogramCanvas');
    const beatCanvas = document.getElementById('beatHistogramCanvas');
    const spectrogramCtx = spectrogramCanvas.getContext('2d');
    const beatCtx = beatCanvas.getContext('2d');

    // Set canvas sizes
    function resizeCanvas(canvas) {
        if (!canvas) return;
        const container = canvas.parentElement;
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
    }

    // Initial resize
    resizeCanvas(spectrogramCanvas);
    resizeCanvas(beatCanvas);

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas(spectrogramCanvas);
        resizeCanvas(beatCanvas);
    });

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const rings = 64; // Number of frequency rings
    let phase = 0;
    
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        // Clear canvases with fade effect
        spectrogramCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        spectrogramCtx.fillRect(0, 0, spectrogramCanvas.width, spectrogramCanvas.height);
        beatCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        beatCtx.fillRect(0, 0, beatCanvas.width, beatCanvas.height);

        const centerX = spectrogramCanvas.width / 2;
        const centerY = spectrogramCanvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.9;

        // Draw concentric rings
        for(let ring = 0; ring < rings; ring++) {
            const freqIndex = Math.floor((ring / rings) * dataArray.length);
            const value = dataArray[freqIndex];
            const radius = (ring / rings) * maxRadius;
            const intensity = value / 255;
            const hue = (ring / rings) * 180 + 180; // Cyan to blue spectrum

            // Draw main ring
            spectrogramCtx.beginPath();
            spectrogramCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            spectrogramCtx.strokeStyle = `hsla(${hue}, 100%, 50%, ${intensity * 0.5})`;
            spectrogramCtx.lineWidth = 2;
            spectrogramCtx.stroke();

            // Draw data points around the ring
            const points = 32;
            const angleStep = (Math.PI * 2) / points;
            const radiusVariation = Math.sin(phase + ring * 0.1) * 5;

            spectrogramCtx.beginPath();
            for(let i = 0; i < points; i++) {
                const angle = i * angleStep;
                const pointRadius = radius + (intensity * radiusVariation);
                const x = centerX + Math.cos(angle) * pointRadius;
                const y = centerY + Math.sin(angle) * pointRadius;

                if(i === 0) spectrogramCtx.moveTo(x, y);
                else spectrogramCtx.lineTo(x, y);
            }
            spectrogramCtx.closePath();
            spectrogramCtx.strokeStyle = `hsla(${hue}, 100%, 50%, ${intensity * 0.3})`;
            spectrogramCtx.stroke();
        }

        // Draw energy histogram in a circular pattern
        const totalEnergy = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const segments = 32;
        const segmentAngle = (Math.PI * 2) / segments;

        beatCtx.save();
        beatCtx.translate(beatCanvas.width / 2, beatCanvas.height / 2);

        for(let i = 0; i < segments; i++) {
            const angle = i * segmentAngle;
            const value = dataArray[Math.floor((i / segments) * dataArray.length)];
            const length = (value / 255) * (beatCanvas.width * 0.4);
            const hue = (i / segments) * 180 + 180;

            beatCtx.save();
            beatCtx.rotate(angle);
            beatCtx.beginPath();
            beatCtx.moveTo(0, 0);
            beatCtx.lineTo(length, 0);
            beatCtx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.5)`;
            beatCtx.lineWidth = 2;
            beatCtx.stroke();
            beatCtx.restore();
        }

        beatCtx.restore();
        phase += 0.03;
    }
    
draw();
}

// Quantum Animation
function createQuantumEffect() {
const quantumCanvas = document.getElementById('quantumCanvas');
const quantumCtx = quantumCanvas.getContext('2d');

// Set canvas size
function resizeQuantumCanvas() {
quantumCanvas.width = quantumCanvas.offsetWidth * window.devicePixelRatio;
quantumCanvas.height = quantumCanvas.offsetHeight * window.devicePixelRatio;
}
resizeQuantumCanvas();
window.addEventListener('resize', resizeQuantumCanvas);

const particles = [];
const particleCount = 30;
let time = 0;

class QuantumParticle {
constructor() {
this.reset();
this.x = Math.random() * quantumCanvas.width;
this.y = Math.random() * quantumCanvas.height;
}

reset() {
this.baseX = Math.random() * quantumCanvas.width;
this.baseY = Math.random() * quantumCanvas.height;
this.size = Math.random() * 3 + 1;
this.amplitude = Math.random() * 30 + 20;
this.speed = Math.random() * 0.02 + 0.01;
this.phase = Math.random() * Math.PI * 2;
this.color = `hsla(${180 + Math.random() * 60}, 100%, 50%, 0.8)`;
}

update() {
this.phase += this.speed;
this.x = this.baseX + Math.cos(this.phase) * this.amplitude;
this.y = this.baseY + Math.sin(this.phase * 1.5) * this.amplitude;

if (Math.random() < 0.001) this.reset();
}

draw() {
quantumCtx.beginPath();
quantumCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
quantumCtx.fillStyle = this.color;
quantumCtx.fill();
}
}

// Initialize particles
for(let i = 0; i < particleCount; i++) {
particles.push(new QuantumParticle());
}

function drawQuantumField() {
const gridSize = 20;
const cellSize = quantumCanvas.width / gridSize;
        
for(let x = 0; x < gridSize; x++) {
for(let y = 0; y < gridSize; y++) {
const value = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 0.5 + 0.5;
const px = x * cellSize;
const py = y * cellSize;
                
quantumCtx.fillStyle = `rgba(0, 255, 255, ${value * 0.1})`;
quantumCtx.fillRect(px, py, cellSize, cellSize);
}
}
}

function animateQuantum() {
requestAnimationFrame(animateQuantum);
quantumCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
quantumCtx.fillRect(0, 0, quantumCanvas.width, quantumCanvas.height);

// Draw quantum field
drawQuantumField();

// Update and draw particles
particles.forEach(particle => {
particle.update();
particle.draw();
});

// Draw connections
quantumCtx.beginPath();
particles.forEach((particle, i) => {
particles.slice(i + 1).forEach(other => {
const dx = particle.x - other.x;
const dy = particle.y - other.y;
const distance = Math.sqrt(dx * dx + dy * dy);

if(distance < 100) {
quantumCtx.moveTo(particle.x, particle.y);
quantumCtx.lineTo(other.x, other.y);
}
});
});
quantumCtx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
quantumCtx.stroke();

time += 0.01;
}

animateQuantum();
}

// Initialize Google Maps
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 15,
                styles: [
                    {
                        elementType: 'geometry',
                        stylers: [{color: '#000000'}]
                    },
                    {
                        elementType: 'labels.text.stroke',
                        stylers: [{color: '#00ffff'}]
                    },
                    {
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#00aaff'}]
                    }
                ]
            });
        });
    }
}

// Initialize everything
window.onload = () => {
    updateTime();
    animateVitalSigns();
    createQuantumEffect();
    initMap();

    // Initialize audio on user interaction
    document.addEventListener('click', async () => {
        if (!audioInitialized) {
            await initAudio();
        } else if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
    });
};
