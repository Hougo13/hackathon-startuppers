import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { HappinessController } from './happiness/happiness.controller';
import { HappinessSchema } from './happiness/happiness.schema';
import { SensorsController } from './sensors/sensors.controller';
import { SensorsSchema } from './sensors/sensors.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017'),
    MongooseModule.forFeature([
      { name: 'Happiness', schema: HappinessSchema },
      { name: 'Sensors', schema: SensorsSchema },
    ]),
    HttpModule,
  ],
  controllers: [AppController, HappinessController, SensorsController],
  providers: [],
})
export class AppModule {}
