import { Body, Controller, Post, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Happiness } from './happiness.interface';

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
}
