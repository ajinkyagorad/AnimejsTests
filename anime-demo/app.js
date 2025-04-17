// Create grid items
const grid = document.querySelector('.staggering-grid');
for (let i = 0; i < 32; i++) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    grid.appendChild(div);
}

// Animation
const gridAnimation = anime({
    targets: '.grid-item',
    scale: [
        {value: .1, easing: 'easeOutSine', duration: 500},
        {value: 1, easing: 'easeInOutQuad', duration: 1200}
    ],
    delay: anime.stagger(200, {grid: [8, 4], from: 'center'}),
    loop: true,
    direction: 'alternate',
    backgroundColor: [
        {value: '#FF0000', duration: 500},
        {value: '#00FF00', duration: 500},
        {value: '#0000FF', duration: 500},
        {value: '#FFFFFF', duration: 500}
    ],
    borderRadius: [
        {value: '0%', duration: 500, delay: 1000},
        {value: '50%', duration: 500, delay: 500}
    ],
    autoplay: true
});
