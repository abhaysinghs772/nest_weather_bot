import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotService } from './services/telegram-bot.service';
import { WeatherService } from './services/weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity"
// import { AppDataSource } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'bot.db.sqlite',
    entities: [User],
    synchronize: true
  }),
  TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [AppService, TelegramBotService, WeatherService],
})
export class AppModule { }
