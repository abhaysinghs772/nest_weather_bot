// weather.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
    private apiKey = process.env.WHEATHER_API_KEY;

    async getWeather(city: string): Promise<string> {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
        try {
            const response = await axios.get(url);
            const weather = response.data.weather[0].description;
            return weather;
        } catch (error) {
            return 'Weather information not available.';
        }
    }
}
