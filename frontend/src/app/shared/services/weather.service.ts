import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  feelsLike: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = environment.weatherApiKey;

  weather = signal<WeatherData | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadWeather(): void {
    if (!navigator.geolocation) {
      this.error.set('Geolocation not supported');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

        this.http.get<any>(url).subscribe({
          next: (data) => {
            this.weather.set({
              city: data.name,
              temp: Math.round(data.main.temp),
              description: data.weather[0].description,
              icon: data.weather[0].icon,
              humidity: data.main.humidity,
              feelsLike: Math.round(data.main.feels_like),
            });
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Could not fetch weather data');
            this.loading.set(false);
          }
        });
      },
      () => {
        this.error.set('Location access denied');
        this.loading.set(false);
      }
    );
  }
}
