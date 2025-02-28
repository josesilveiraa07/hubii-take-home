import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  const mockProductsService = createMock<ProductsService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();
  });

  it('should be defined', () => {
    expect(mockProductsService).toBeDefined();
  });
});
