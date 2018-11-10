import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { HappinessSchema } from './happiness/happiness.schema';
import { HappinessController } from './happiness/happiness.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017'),
    MongooseModule.forFeature([{ name: 'Happiness', schema: HappinessSchema }]),
  ],
  controllers: [AppController, HappinessController],
  providers: [],
})
export class AppModule {}
