class WeatherManager {
    constructor() {
        this.city = 'Helsinki';
        this.apiKey = ''; // Will be set by user
        this.weatherElement = document.querySelector('.weather-display');
        this.setupWeatherInput();
    }

    setupWeatherInput() {
        if (!localStorage.getItem('openweather_api_key')) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter OpenWeather API Key';
            input.className = 'weather-api-input';
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.length > 0) {
                    localStorage.setItem('openweather_api_key', input.value);
                    this.apiKey = input.value;
                    input.remove();
                    this.initWeather();
                }
            });
            
            this.weatherElement.appendChild(input);
        } else {
            this.apiKey = localStorage.getItem('openweather_api_key');
            this.initWeather();
        }
    }

    async initWeather() {
        try {
            const weather = await this.fetchWeather();
            this.updateWeatherDisplay(weather);
            
            // Update every 5 minutes
            setInterval(() => this.updateWeather(), 5 * 60 * 1000);
        } catch (error) {
            console.error('Weather initialization failed:', error);
        }
    }

    async fetchWeather() {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Weather API error');
        return await response.json();
    }

    async updateWeather() {
        try {
            const weather = await this.fetchWeather();
            this.updateWeatherDisplay(weather);
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }

    updateWeatherDisplay(data) {
        if (!this.weatherElement) return;

        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].main;
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed);

        this.weatherElement.innerHTML = `
            <div class="weather-main">
                <div class="temp">${temp}°C</div>
                <div class="condition">${condition}</div>
            </div>
            <div class="weather-details">
                <div class="detail">
                    <span class="label">HUMIDITY</span>
                    <span class="value">${humidity}%</span>
                </div>
                <div class="detail">
                    <span class="label">WIND</span>
                    <span class="value">${windSpeed} m/s</span>
                </div>
            </div>
        `;
    }
}
