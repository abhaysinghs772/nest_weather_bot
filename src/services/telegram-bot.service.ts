// telegram-bot.service.ts
import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { WeatherService } from './weather.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as cron from 'node-cron';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TelegramBotService {
    public bot: TelegramBot;
    private readonly WHEATHER_API_KEY;
    private readonly TELEGRAM_API_KEY;

    @InjectRepository(User)
    public readonly userRepo: Repository<User>
    constructor(
        private readonly weatherService: WeatherService
    ) {
        this.WHEATHER_API_KEY = process.env.WHEATHER_API_KEY;
        this.TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;

        this.bot = new TelegramBot(this.TELEGRAM_API_KEY, { polling: true });

        cron.schedule('*/5 * * * *', () => {
            this.sendWeatherUpdates();
        });
    }

    async subscribe(msg, city: string): Promise<void> {
        try {
            // console.log(msg);

            const chatId = msg.chat.id;
            const weather = await this.weatherService.getWeather(city);
            const message = `You have subscribed for daily weather updates in ${city}. Current weather: ${weather}.`;

            // save user's info in db here and puth the is subscribed flag to true 
            let subscribed = await this.userRepo.findOneBy({chat_id : msg.chat.id})
            if (subscribed && city!== subscribed.city){
                // then udate the city of user only 
                subscribed.city = city
                subscribed.updated_at = new Date();
                await this.userRepo.save(subscribed);
                console.log(`user's city has succesfully been updated: `, subscribed);
                this.bot.sendMessage(chatId, message);
            } else {
                let userData = new User();
                Object.assign(userData, {
                    chat_id: msg.chat.id,
                    telegram_user_id: msg.from.id,
                    is_bot: msg.from.is_bot,
                    first_name: msg.from.first_name,
                    last_name: msg.from.last_name,
                    language_code: msg.from.language_code,
                    isSubscribed: true,
                    city: city,
                    subscribed_at: new Date()
                })
                let user = await this.userRepo.save(userData);
                console.log(`user has succesfully been subscribed: `, user);
                this.bot.sendMessage(chatId, message);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async unsubscribe(chatId: number): Promise<void> {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    chat_id: chatId
                }
            });
            console.log(user);
            

            if (!user) return;
            if (user && user.isSubscribed) {
                user.isSubscribed = false;
                await this.userRepo.save(user);
                console.log(`user successfully unSubscribed`, user);

                const message = `See You soon, , miss you 😔`;
                this.bot.sendMessage(chatId, message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Send daily weather notification on a fixed time  
    private async sendWeatherUpdates(): Promise<void> {
        try {
            // Retrieve the list of subscribed users from the database
            const subscribedUsers = await this.userRepo.find({
                where: {
                    isSubscribed: true
                }
            });

            // Send weather updates to the subscribed users
            for (const user of subscribedUsers) {
                // Fetch weather data based on the user's city
                const apiKey = this.WHEATHER_API_KEY;
                // const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${user.city}`;
                let temperatureUnit = 'metric';
                const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${user.city}&units=${temperatureUnit}&appid=${this.WHEATHER_API_KEY}`;
                const response = await axios.get(weatherUrl);
                console.log(response);

                // Get the weather details from the API response
                const temperature = response.data.main.temp;
                const weatherCondition = response.data.weather[0].description;

                const message = `Hello ${user.first_name}, the current weather in ${user.city} is ${temperature}°C with ${weatherCondition}.`;
                await this.bot.sendMessage(user.chat_id, message);
            }
        } catch (error) {
            // Handle errors here, e.g., log the error or send an error message to the admin
            console.log(error);
        }
    }
}
