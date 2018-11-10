import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensors } from './sensors.interface';

@Controller('sensors')
export class SensorsController {
  constructor(
    @InjectModel('Sensors') private readonly sensorsModel: Model<Sensors>,
  ) {}

  @Get()
  findAll() {
    return this.sensorsModel.find().exec();
  }
}
