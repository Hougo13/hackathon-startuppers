import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('/uids')
  async getUids() {
    return await this.sensorsModel.distinct('uid').exec();
  }

  @Get('/temperatures')
  async getTemperatures() {
    const result: any = {};
    const items = await this.sensorsModel.find().exec();
    result.total = items.length;
    const temperatures = items.map(x => x.temperature);
    result.max = Math.max(...temperatures);
    result.min = Math.min(...temperatures);
    result.items = items.reduce((acc, { uid, temperature, createdAt }) => {
      if (!acc[uid]) acc[uid] = { temperatures: [] };
      acc[uid].temperatures.push({ temperature, createdAt });
      return acc;
    }, {});

    return result;
  }

  @Get('/uid/:id')
  async getById(@Param('id') id: string) {
    const items = await this.sensorsModel.find({ uid: id }).exec();
    return { items, total: items.length };
  }
}
