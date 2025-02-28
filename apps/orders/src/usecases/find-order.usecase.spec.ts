import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';
import { FindOrderUseCase } from './find-order.usecase';

describe('FindOrderUseCase', () => {
  const mockOrdersRepository = createMock<OrdersRepository>();

  let useCase: FindOrderUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderUseCase,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOrderUseCase>(FindOrderUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const orderId = 'order-1';

    const mockOrder: Order = {
      id: orderId,
      items: [
        {
          id: 'item-1',
          productId: '1',
          quantity: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      deliveryOptions: [
        {
          id: 'option-1',
          companyName: 'Transportadora A',
          price: 10,
          estimatedArrival: '2 dias úteis',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return the order if it exists', async () => {
      mockOrdersRepository.findOneById.mockResolvedValue(mockOrder);

      const result = await useCase.execute(orderId);

      expect(mockOrdersRepository.findOneById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it('should throw RpcException if the order is not found', async () => {
      mockOrdersRepository.findOneById.mockResolvedValue(null);

      await expect(useCase.execute(orderId)).rejects.toThrow(RpcException);
      expect(mockOrdersRepository.findOneById).toHaveBeenCalledWith(orderId);
    });
  });
});
