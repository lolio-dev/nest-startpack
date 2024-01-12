import { Test, TestingModule } from '@nestjs/testing';
import { ObjmcService } from './objmc.service';

describe('ObjmcService', () => {
  let service: ObjmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjmcService],
    }).compile();

    service = module.get<ObjmcService>(ObjmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
