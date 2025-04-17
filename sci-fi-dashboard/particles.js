class ParticleSystem {
    constructor(canvas, color = 'rgba(0, 255, 255, 0.5)') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.color = color;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 3 + 1
        };
    }

    addParticles(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.size *= 0.99;
        });

        this.draw();
    }

    draw() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color.replace(')', `,${p.life})`);
            this.ctx.fill();
        });
    }
}
