class ThemeManager {
    constructor() {
        this.themes = {
            cyan: {
                name: 'Cyan',
                primary: '#00ffff',
                secondary: '#ff00ff',
                text: '#ffffff',
                background: '#000000',
                glow: 'rgba(0, 255, 255, 0.5)',
                gradient: ['rgba(0, 255, 255, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 255, 0.8)']
            },
            green: {
                name: 'Matrix',
                primary: '#00ff00',
                secondary: '#33ff33',
                text: '#ffffff',
                background: '#000000',
                glow: 'rgba(0, 255, 0, 0.5)',
                gradient: ['rgba(0, 255, 0, 0.8)', 'rgba(51, 255, 51, 0.8)', 'rgba(0, 255, 0, 0.8)']
            },
            yellow: {
                name: 'Solar',
                primary: '#ffff00',
                secondary: '#ffa500',
                text: '#ffffff',
                background: '#000000',
                glow: 'rgba(255, 255, 0, 0.5)',
                gradient: ['rgba(255, 255, 0, 0.8)', 'rgba(255, 165, 0, 0.8)', 'rgba(255, 255, 0, 0.8)']
            },
            white: {
                name: 'Minimal',
                primary: '#ffffff',
                secondary: '#cccccc',
                text: '#ffffff',
                background: '#000000',
                glow: 'rgba(255, 255, 255, 0.5)',
                gradient: ['rgba(255, 255, 255, 0.8)', 'rgba(204, 204, 204, 0.8)', 'rgba(255, 255, 255, 0.8)']
            }
        };

        this.currentTheme = localStorage.getItem('theme') || 'cyan';
        this.applyTheme(this.currentTheme);
        this.addThemeSelector();
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--background-color', theme.background);
        document.documentElement.style.setProperty('--glow-color', theme.glow);

        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;
    }

    addThemeSelector() {
        const container = document.createElement('div');
        container.className = 'theme-selector';
        
        Object.keys(this.themes).forEach(themeName => {
            const theme = this.themes[themeName];
            const button = document.createElement('button');
            button.className = 'theme-button';
            button.style.backgroundColor = theme.primary;
            button.style.border = `1px solid ${theme.secondary}`;
            button.title = theme.name;
            
            if (themeName === this.currentTheme) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.theme-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.applyTheme(themeName);
            });
            
            container.appendChild(button);
        });

        document.body.appendChild(container);
    }
}
