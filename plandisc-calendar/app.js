class PlandiscCalendar {
    constructor() {
        this.canvas = document.getElementById('calendar-disc');
        this.ctx = this.canvas.getContext('2d');
        this.events = [];
        this.scale = 1;
        this.rotation = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupModal();
        this.startClock();
        
        // Initial render
        this.render();
    }

    setupCanvas() {
        const resize = () => {
            const container = this.canvas.parentElement;
            const size = Math.min(container.offsetWidth, container.offsetHeight);
            this.canvas.width = size * window.devicePixelRatio;
            this.canvas.height = size * window.devicePixelRatio;
            this.canvas.style.width = `${size}px`;
            this.canvas.style.height = `${size}px`;
            this.render();
        };

        resize();
        window.addEventListener('resize', resize);
    }

    setupEventListeners() {
        // Zoom controls
        document.querySelector('.zoom-in').addEventListener('click', () => {
            this.scale = Math.min(this.scale * 1.2, 3);
            this.render();
        });

        document.querySelector('.zoom-out').addEventListener('click', () => {
            this.scale = Math.max(this.scale / 1.2, 0.5);
            this.render();
        });

        // Rotation controls
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const dx = e.clientX - this.lastX;
            this.rotation += dx * 0.005;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    setupModal() {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        
        document.querySelector('.add-event').addEventListener('click', () => {
            modal.style.display = 'block';
        });

        document.querySelector('.cancel').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const event = {
                title: formData.get('title'),
                date: new Date(formData.get('date') + 'T' + (formData.get('time') || '00:00')),
                category: formData.get('category'),
                description: formData.get('description')
            };
            
            this.addEvent(event);
            modal.style.display = 'none';
            form.reset();
        });
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.querySelector('.current-time').textContent = timeStr;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    addEvent(event) {
        this.events.push(event);
        this.updateEventList();
        this.render();
    }

    updateEventList() {
        const list = document.querySelector('.event-list');
        list.innerHTML = '';
        
        const sortedEvents = [...this.events].sort((a, b) => a.date - b.date);
        
        sortedEvents.forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-item';
            div.innerHTML = `
                <div class="event-time">${event.date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                })}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-category">${event.category}</div>
            `;
            list.appendChild(div);
        });
    }

    render() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        
        // Save the current state
        this.ctx.save();
        
        // Move to center and apply transformations
        this.ctx.translate(width/2, height/2);
        this.ctx.rotate(this.rotation);
        this.ctx.scale(this.scale, this.scale);

        // Draw circular grid
        this.drawGrid();
        
        // Draw month sections
        this.drawMonths();
        
        // Draw events
        this.drawEvents();
        
        // Restore the context
        this.ctx.restore();
    }

    drawGrid() {
        const radius = this.canvas.width * 0.4;
        
        // Draw concentric circles
        for(let i = 1; i <= 12; i++) {
            const r = (radius / 12) * i;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 - (i/24)})`;
            this.ctx.stroke();
        }

        // Draw radial lines
        for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            this.ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
            this.ctx.stroke();
        }
    }

    drawMonths() {
        const radius = this.canvas.width * 0.42;
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        this.ctx.font = '16px Inter';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        months.forEach((month, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Rotate text to be readable
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI/2);
            this.ctx.fillText(month, 0, 0);
            this.ctx.restore();
        });
    }

    drawEvents() {
        const radius = this.canvas.width * 0.4;
        
        this.events.forEach(event => {
            const date = event.date;
            const month = date.getMonth();
            const day = date.getDate();
            
            // Calculate position
            const angleMonth = (month / 12) * Math.PI * 2 - Math.PI/2;
            const radiusOffset = (day / 31) * (radius / 12);
            const r = radius - radiusOffset;
            
            const x = Math.cos(angleMonth) * r;
            const y = Math.sin(angleMonth) * r;
            
            // Draw event dot
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(100, 255, 218, 0.8)';
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(100, 255, 218, 0.2)';
            this.ctx.fill();
        });
    }
}

// Initialize the calendar
new PlandiscCalendar();
