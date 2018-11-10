import { Body, Controller, Post, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Happiness } from './happiness.interface';
import * as dayJs from 'dayjs';

export const groupByHour = list =>
  list.reduce((r, item) => {
    const d = dayJs(item.createdAt);
    const hour = d.hour();
    if (!r[hour]) r[hour] = [];
    r[hour].push(item);
    return r;
  }, {});

@Controller('happiness')
export class HappinessController {
  constructor(
    @InjectModel('Happiness') private readonly happinessModel: Model<Happiness>,
  ) {}

  @Post()
  async postHappiness(@Body('ratio') ratio: number) {
    const happiness = new this.happinessModel({ ratio });
    return await happiness.save();
  }

  @Get()
  async getAll() {
    return await this.happinessModel.find().exec();
  }

  @Get('/hours')
  async getHours() {
    const items = await this.happinessModel.find().exec();
    const gH = groupByHour(items);

    return Object.keys(gH).map(k => ({
      name: k,
      value: gH[k].reduce((s, x) => s + x.ratio, 0) / gH[k].length,
    }));
  }
}
