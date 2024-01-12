import { Test, TestingModule } from '@nestjs/testing';
import { ObjmcController } from './objmc.controller';

describe('ObjmcController', () => {
  let controller: ObjmcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjmcController],
    }).compile();

    controller = module.get<ObjmcController>(ObjmcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
