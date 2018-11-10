import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensors } from './sensors.interface';
import * as dayJs from 'dayjs';

const groupByHour = list =>
  list.reduce((r, item) => {
    const d = dayJs(item.createdAt);
    const hour = d.hour();
    if (!r[hour]) r[hour] = [];
    r[hour].push(item);
    return r;
  }, {});

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
    const groupByUid = items.reduce((acc, { uid, temperature, createdAt }) => {
      if (!acc[uid]) acc[uid] = { temperatures: [] };
      acc[uid].temperatures.push({ temperature, createdAt });
      return acc;
    }, {});

    const groupByUidAndHour = {};
    for (const key of Object.keys(groupByUid)) {
      const hoursTemp = groupByHour(groupByUid[key].temperatures);
      groupByUidAndHour[key] = {};
      for (const h of Object.keys(hoursTemp)) {
        const sum = hoursTemp[h].reduce((s, t) => s + t.temperature, 0);
        groupByUidAndHour[key][h] = sum / hoursTemp[h].length;
      }
    }

    result.items = groupByUidAndHour;
    return result;
  }

  @Get('/uid/:id')
  async getById(@Param('id') id: string) {
    const items = await this.sensorsModel.find({ uid: id }).exec();
    return { items, total: items.length };
  }
}
