import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(){
    return {
      online: true,
      message: 'Api object-engine'
    };
  }
}
