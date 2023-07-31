import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotService } from './services/telegram-bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const botService = app.get(TelegramBotService);

  // Handle incoming Telegram messages
  botService.bot.onText(/\/subscribe (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];
    botService.subscribe(msg, city);
  });

  botService.bot.on("message", async (msg, match) => {
    if (msg.text === '/unsubscribe'){
      const chatId = msg.chat.id
      await botService.unsubscribe(chatId);
    }
  });

  await app.listen(3000, ()=> {
    console.log(`bot server is up at post 3000`);
  });
}
bootstrap();
