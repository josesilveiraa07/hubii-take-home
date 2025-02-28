import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const mockOrdersService = createMock<OrdersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();
  });

  it('should be defined', () => {
    expect(mockOrdersService).toBeDefined();
  });
});
