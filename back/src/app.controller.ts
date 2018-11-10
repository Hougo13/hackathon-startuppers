import { Get, Controller, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('/:id')
  id(@Param() id): any {
    let data = { test: 'test', test1: 'test1', test2: 'test2' };
    return data;
  }

  @Post('/happiness')
  postHappiness(
    @Body('ratio') ratio: number,
    @Body('datetime') datetime: Date,
  ) {
    console.log(ratio, datetime);
    return 'Ok';
  }
}
