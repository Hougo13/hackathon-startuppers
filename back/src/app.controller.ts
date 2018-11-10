import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): string {
    return 'Hello World';
  }

  // @Get('/:id')
  // id(@Param() id): any {
  //   let data = { test: 'test', test1: 'test1', test2: 'test2' };
  //   return data;
  // }
}
