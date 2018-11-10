import { Get, Controller, Param } from '@nestjs/common';
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
}
