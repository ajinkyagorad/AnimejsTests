class ARInterface {
    constructor() {
        this.initializeTimeAndDate();
        this.initializeAnimations();
        this.initializeModeSwitch();
    }

    initializeTimeAndDate() {
        const updateDateTime = () => {
            const now = new Date();
            const timeElement = document.querySelector('.time');
            const dateElement = document.querySelector('.date');

            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            dateElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        };

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    initializeAnimations() {
        // Energy field effect around the assistant
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'energy-particles';
        document.querySelector('.assistant-bubble').appendChild(particlesContainer);

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';
            particlesContainer.appendChild(particle);

            anime({
                targets: particle,
                rotate: [0, 360],
                translateX: () => anime.random(-30, 30),
                translateY: () => anime.random(-30, 30),
                scale: [0, 1],
                opacity: [0.5, 0],
                duration: () => anime.random(1000, 2000),
                delay: () => anime.random(0, 1000),
                easing: 'easeOutExpo',
                loop: true
            });
        }

        // Assistant bubble animation with energy pulse
        anime({
            targets: '.assistant-bubble',
            scale: [0.95, 1.05],
            duration: 2000,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true
        });

        // Menu items entrance
        anime({
            targets: '.menu-item',
            translateX: [-50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)',
            duration: 1500
        });

        // Task calendar entrance
        anime({
            targets: '.task-calendar',
            translateX: [300, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1500
        });

        // Add hover effects for interactive elements
        document.querySelectorAll('.menu-item, .task-item, .calendar-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                anime({
                    targets: element,
                    scale: 1.05,
                    duration: 300,
                    easing: 'easeOutElastic(1, .8)'
                });
            });

            element.addEventListener('mouseleave', () => {
                anime({
                    targets: element,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutElastic(1, .8)'
                });
            });
        });
    }

    initializeModeSwitch() {
        const modes = document.querySelectorAll('.mode-btn');
        modes.forEach(mode => {
            mode.addEventListener('click', () => {
                // Remove active class from all modes
                modes.forEach(m => m.classList.remove('active'));
                // Add active class to clicked mode
                mode.classList.add('active');

                // Animate mode switch
                anime({
                    targets: mode,
                    scale: [1.2, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)'
                });

                this.switchMode(mode.dataset.mode);
            });
        });
    }

    switchMode(mode) {
        const overlay = document.querySelector('.ar-overlay');
        
        // Enhanced mode configurations with sci-fi themes
        const modeConfigs = {
            daily: {
                background: 'linear-gradient(135deg, #1a2a3a 0%, #0a1a2a 100%)',
                primary: '#00ffff',
                particleColor: '#00ffff',
                energyGlow: '0 0 20px #00ffff'
            },
            leisure: {
                background: 'linear-gradient(135deg, #2a1a3a 0%, #1a0a2a 100%)',
                primary: '#ff00ff',
                particleColor: '#ff00ff',
                energyGlow: '0 0 20px #ff00ff'
            },
            science: {
                background: 'linear-gradient(135deg, #3a1a2a 0%, #2a0a1a 100%)',
                primary: '#00ff00',
                particleColor: '#00ff00',
                energyGlow: '0 0 20px #00ff00'
            },
            universe: {
                background: 'linear-gradient(135deg, #1a1a3a 0%, #0a0a2a 100%)',
                primary: '#ffff00',
                particleColor: '#ffff00',
                energyGlow: '0 0 20px #ffff00'
            }
        };

        const config = modeConfigs[mode];
        document.body.style.background = config.background;
        document.documentElement.style.setProperty('--primary', config.primary);

        // Animate transition
        anime({
            targets: '.ar-overlay',
            opacity: [0.8, 1],
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
}

// Initialize the interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ARInterface();
});
