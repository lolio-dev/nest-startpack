import { Test, TestingModule } from '@nestjs/testing';
import { ObjmcFilesService } from './objmc-files.service';

describe('ObjmcFilesService', () => {
  let service: ObjmcFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjmcFilesService],
    }).compile();

    service = module.get<ObjmcFilesService>(ObjmcFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
